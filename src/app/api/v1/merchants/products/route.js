/**
 * @file api/v1/merchants/products/route.js
 * @description Fetches merchant products with Category names and filtering logic.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db' // Adjust based on your DB connection path

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // 1. Extract query parameters
    const searchTerm = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || '' // Matches frontend param
    const page = parseInt(searchParams.get('page')) || 1
    const limit = 10
    const offset = (page - 1) * limit

    // 2. Identify the current merchant
    // NOTE: In a real app, get this from your Auth Session (JWT/Cookies)
    const merchantId = 1

    // 3. Build the SQL Query with a JOIN to get the category name
    let query = `
      SELECT 
        p.*, 
        c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.merchant_id = ?
    `

    const queryParams = [merchantId]

    // 4. Add Search Filter
    if (searchTerm) {
      query += ` AND p.name LIKE ?`
      queryParams.push(`%${searchTerm}%`)
    }

    // 5. Add Category Filter (The fix for your filtering issue)
    if (categoryId) {
      query += ` AND p.category_id = ?`
      queryParams.push(categoryId)
    }

    // 6. Add Pagination
    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    queryParams.push(limit, offset)

    // 7. Execute Main Query
    const [products] = await pool.execute(query, queryParams)

    // 8. Get Total Count for Pagination
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM products WHERE merchant_id = ? ${categoryId ? 'AND category_id = ?' : ''}`,
      categoryId ? [merchantId, categoryId] : [merchantId],
    )

    const totalProducts = countRows[0].total

    return NextResponse.json({
      success: true,
      products: products || [],
      pagination: {
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
      },
    })
  } catch (error) {
    console.error('[API_PRODUCTS_ERROR]:', error.message)
    return NextResponse.json({ success: false, error: 'Failed to fetch catalog data.' }, { status: 500 })
  }
}
