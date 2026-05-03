/**
 * @file src/proxy.js
 * @description Logic updated to bypass x402 payment check for delivery updates.
 */

import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { paymentProxy, x402ResourceServer } from '@x402/next'
import { ExactEvmScheme } from '@x402/evm/exact/server'
import { HTTPFacilitatorClient } from '@x402/core/server'

const facilitatorUrl = process.env.NODE_ENV === 'production' 
  ? 'https://api.cdp.coinbase.com/platform/v2/x402' 
  : 'https://www.x402.org/facilitator'

const server = new x402ResourceServer(
  new HTTPFacilitatorClient({ url: facilitatorUrl })
).register('eip155:84532', new ExactEvmScheme())

async function getCheckoutDetails(items, origin) {
  const targetUrl = `${origin}/api/v1/public/checkout-info`
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      body: JSON.stringify({ items }),
      headers: { 'Content-Type': 'application/json' },
    })
    return await response.json()
  } catch (e) {
    return { error: 'FETCH_FAILED' }
  }
}

export default async function proxy(request) {
  const { pathname, origin } = request.nextUrl

  // 1. Handle Purchase (requires x402)
  // We check for exact match or ensure it's NOT the update-delivery sub-route
  if (pathname === '/api/v1/agents/purchase') {
    const clone = request.clone()
    let items
    
    try {
      const body = await clone.json()
      items = body.items
      
      if (!items || !Array.isArray(items)) {
        return NextResponse.json({ error: 'ITEMS_ARRAY_REQUIRED' }, { status: 400 })
      }
    } catch (e) {
      return NextResponse.json({ error: 'INVALID_JSON_BODY' }, { status: 400 })
    }

    const checkoutData = await getCheckoutDetails(items, origin)
    
    if (!checkoutData || !checkoutData.success) {
      return NextResponse.json({ error: 'Invalid checkout data' }, { status: 400 })
    }

    const dynamicMiddleware = paymentProxy(
      {
        '/api/v1/agents/purchase': {
          accepts: [
            {
              scheme: 'exact',
              price: `$${checkoutData.totalUSD}`, 
              network: 'eip155:84532',
              payTo: checkoutData.destinationAddress,
            },
          ],
          description: 'LobPay Imperial Procurement',
          mimeType: 'application/json',
        },
      },
      server,
    )

    return dynamicMiddleware(request)
  }

  // 2. Allow Update Delivery to pass through freely to the route.js
  if (pathname === '/api/v1/agents/purchase/update-delivery') {
    return NextResponse.next()
  }

  // 3. Protect Merchant Dashboard
  if (pathname.startsWith('/merchant')) {
    const token = request.cookies.get('merchant_session')?.value
    if (!token) return NextResponse.redirect(new URL('/', request.url))
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (e) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/merchant/:path*', '/api/v1/agents/purchase/:path*'],
}