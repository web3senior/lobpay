/**
 * @file app/api/v1/auth/merchant/verify/route.js
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyMessage } from 'ethers'
import { SignJWT } from 'jose'

export async function POST(request) {
  try {
    const { address, signature, nonce } = await request.json()

    // 1. Validate Secret Existence
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
      console.error('[CRITICAL]: JWT_SECRET is not defined in environment variables.')
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 })
    }

    // 2. Verify Nonce from DB
    const [nonceRows] = await pool.execute('SELECT * FROM nonces WHERE wallet_address = ? AND nonce = ? AND expires_at > NOW()', [address.toLowerCase(), nonce])

    if (nonceRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired session' }, { status: 422 })
    }

    // 3. Signature Verification
    const message = `Sign this message to verify ownership of this wallet for ${process.env.NEXT_PUBLIC_NAME} Merchant Portal.\nNonce: ${nonce}`
    const recoveredAddress = verifyMessage(message, signature)

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
    }

    // 4. Upsert User
    await pool.execute('INSERT INTO users (wallet_address) VALUES (?) ON DUPLICATE KEY UPDATE wallet_address = wallet_address', [address.toLowerCase()])

    const [userRows] = await pool.execute('SELECT id FROM users WHERE wallet_address = ?', [address.toLowerCase()])
    const userId = userRows[0].id

    // 5. Generate JWT
    // Use TextEncoder to create a valid Uint8Array from the secret string
    const encodedSecret = new TextEncoder().encode(secretKey)

    const token = await new SignJWT({
      address: address.toLowerCase(),
      userId: userId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(encodedSecret) // This is where the Zero-length error occurred

    const response = NextResponse.json({ success: true })

    // 6. Set HttpOnly Cookie
    response.cookies.set('merchant_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    // Cleanup Nonce
    await pool.execute('DELETE FROM nonces WHERE wallet_address = ?', [address.toLowerCase()])

    return response
  } catch (error) {
    console.error('[MERCHANT_VERIFY_ERROR]:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
