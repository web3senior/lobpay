/**
 * @file app/api/v1/public/categories/route.js
 * @description Lists product categories with optional filtering by merchant_id.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request) {
  try {
    /* Extract merchantId from query parameters */
    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get('merchant_id')

    let query = `
      SELECT 
        id, 
        merchant_id, 
        name, 
        description, 
        icon, 
        created_at 
      FROM categories
    `
    const queryParams = []

    /* Add dynamic filtering if merchant_id is present */
    if (merchantId) {
      query += ` WHERE merchant_id = ?`
      queryParams.push(merchantId)
    }

    query += ` ORDER BY name ASC`

    const [categories] = await pool.execute(query, queryParams)

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    })
  } catch (error) {
    console.error('[CATEGORIES_GET_ERROR]:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 },
    )
  }
}