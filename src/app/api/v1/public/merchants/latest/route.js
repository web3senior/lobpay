/**
 * @file app/api/v1/public/merchants/latest/route.js
 * @description Fetches recently onboarded merchants with standardized metadata and pagination.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    /* Pagination Logic */
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = (page - 1) * limit

    /**
     * Optimized Query:
     * - Uses LEFT JOIN instead of subqueries for better performance at scale.
     * - Pulls business_name and logo_url as per your established schema.
     */
    const [rows] = await pool.execute(`
      SELECT 
        m.id, 
        m.business_name, 
        m.wallet_address, 
        m.city,
        m.logo_url,
        m.created_at,
        mt.name as business_type,
        COUNT(t.id) as total_tx
      FROM merchants m
      LEFT JOIN merchant_types mt ON m.business_type_id = mt.id
      LEFT JOIN transactions t ON m.id = t.merchant_id
      WHERE m.is_active = 1
      GROUP BY m.id, mt.name
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit + 1, offset]) // Peek-ahead for hasMore logic

    /* Determine if there is a next page */
    const hasMore = rows.length > limit
    const merchantsToSend = hasMore ? rows.slice(0, limit) : rows
    const nextPage = hasMore ? page + 1 : null

    

    /* Standardized Success Branch */
    return NextResponse.json({
      success: true,
      data: merchantsToSend,
      nextPage,
      meta: {
        page,
        limit,
        count: merchantsToSend.length,
        hasMore,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('[LATEST_MERCHANTS_ERROR]:', error.message)
    
    /* Standardized Error Branch */
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recently joined merchants',
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}