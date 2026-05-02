/**
 * @file app/api/v1/merchants/[id]/products/route.js
 * @description Lists products using image_url and merchant_id from lobx.sql.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req, { params }) {
  try {
    const { id } = await params

    const [products] = await pool.execute(
      `SELECT id, name, description, price, stock_quantity, image_url 
       FROM products 
       WHERE merchant_id = ? AND is_active = 1`, // merchant_id is correct here
      [id],
    )

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('[CATALOG_ERROR]:', error.message)
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 })
  }
}
