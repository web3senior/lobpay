/**
 * @file api/v1/merchants/[id]/route.js
 * @description Profile API. Joins business types, counts transactions, and extracts filter categories.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID_REQUIRED' }, { status: 400 })
    }

    // 1. Fetch Merchant Profile + Business Type Name
    const [profileRows] = await pool.execute(
      `SELECT m.*, mt.name as business_type 
       FROM merchants m
       LEFT JOIN merchant_types mt ON m.business_type_id = mt.id
       WHERE m.id = ?`,
      [id],
    )

    if (profileRows.length === 0) {
      return NextResponse.json({ success: false, error: 'NODE_NOT_FOUND' }, { status: 404 })
    }

    const profile = profileRows[0]

    // 2. Fetch Transaction Count from 'transactions' table
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM transactions WHERE merchant_id = ?', [id])
    profile.request_count = countRows[0].total || 0

    // 3. Fetch Catalog with Category Names
    const [catalogRows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.merchant_id = ? AND p.is_active = 1`,
      [id],
    )

    // 4. Extract Unique Categories for the Filter Bar
    const availableCategories = Array.from(
      new Map(
        catalogRows
          .filter((item) => item.category_id !== null)
          .map((item) => [item.category_id, { id: item.category_id, name: item.category_name }]),
      ).values(),
    )

    return NextResponse.json({
      success: true,
      profile,
      catalog: catalogRows,
      filterOptions: {
        categories: availableCategories,
      },
    })
  } catch (error) {
    console.error('[API_MERCHANT_PROFILE_ERR]:', error.message)
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR' }, { status: 500 })
  }
}
