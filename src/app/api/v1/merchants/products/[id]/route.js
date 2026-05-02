/**
 * @file app/api/v1/merchants/products/[id]/route.js
 * @description Secure handlers for LobPay.market product retrieval, modification, and removal.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ success: false }, { status: 401 })

    const { id } = await params

    // Fetch product details ensuring the merchant belongs to the logged-in user
    const [rows] = await pool.execute(
      `SELECT p.*, m.business_name 
       FROM products p
       INNER JOIN merchants m ON p.merchant_id = m.id
       WHERE p.id = ? AND m.user_id = ?`,
      [id, session.userId],
    )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('[PRODUCT_GET_ERROR]:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ success: false }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    // We do not update merchant_id or business_id via PUT as they are fixed relations.
    // Ensure numeric types are handled to prevent DB truncation errors.
    const queryParams = [
      body.name ?? null,
      body.description ?? null,
      parseFloat(body.price) || 0,
      parseInt(body.stock_quantity) || 0,
      body.image_url ?? null,
      body.category_id ?? null,
      id, // product_id for WHERE
      session.userId, // user_id for security check
    ]

    // Correct MySQL UPDATE JOIN syntax
    const [result] = await pool.execute(
      `UPDATE products p
       INNER JOIN merchants m ON p.merchant_id = m.id
       SET 
         p.name = ?, 
         p.description = ?, 
         p.price = ?, 
         p.stock_quantity = ?, 
         p.image_url = ?, 
         p.category_id = ?
       WHERE p.id = ? AND m.user_id = ?`,
      queryParams,
    )

    return NextResponse.json({ success: result.affectedRows > 0 })
  } catch (error) {
    // Logging the full error is key to fixing 500 status codes
    console.error('[PRODUCT_UPDATE_ERROR]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ success: false }, { status: 401 })

    const { id } = await params

    const [result] = await pool.execute(
      `DELETE p FROM products p
       INNER JOIN merchants m ON p.merchant_id = m.id
       WHERE p.id = ? AND m.user_id = ?`,
      [id, session.userId],
    )

    return NextResponse.json({ success: result.affectedRows > 0 })
  } catch (error) {
    console.error('[PRODUCT_DELETE_ERROR]:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
