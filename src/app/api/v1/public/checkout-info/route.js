/**
 * @file app/api/v1/internal/checkout-info/route.js
 * @description Pre-checkout verification. Calculates price and identifies destination wallet.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req) {
  try {
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'EMPTY_CART' }, { status: 400 })
    }

    const productIds = items.map((i) => i.product_id)

    const [rows] = await pool.query(
      `SELECT p.id, p.price, m.wallet_address 
       FROM products p 
       JOIN merchants m ON p.merchant_id = m.id 
       WHERE p.id IN (?)`,
      [productIds],
    )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'PRODUCTS_NOT_FOUND' }, { status: 404 })
    }

    let totalUSD = 0
    const destinationAddress = rows[0].wallet_address

    rows.forEach((product) => {
      const item = items.find((i) => i.product_id === product.id)
      if (item) {
        totalUSD += parseFloat(product.price) * item.quantity
      }
    })

    return NextResponse.json({
      success: true,
      totalUSD: totalUSD.toFixed(2), // Becomes the string used by the proxy
      destinationAddress: destinationAddress,
    })
  } catch (error) {
    console.error('[INTERNAL_CHECKOUT_ERROR]:', error)
    return NextResponse.json({ success: false, error: 'SYSTEM_FAULT' }, { status: 500 })
  }
}