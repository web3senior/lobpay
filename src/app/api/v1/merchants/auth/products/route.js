/**
 * @file api/v1/merchant/products/route.js
 * @description Handles CRUD operations for merchant products.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request) {
  try {
    // In a real app, get this ID from your JWT/Session
    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get('merchant_id')

    if (!merchantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.merchant_id = ? 
       ORDER BY p.created_at DESC`,
      [merchantId],
    )

    return NextResponse.json({ success: true, products: rows })
  } catch (error) {
    console.error('[Merchant API] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
