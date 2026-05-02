/**
 * @file app/api/v1/merchant/stats/route.js
 * @description Aggregates real-time merchant stats from the database.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false }, { status: 401 })

    const userId = session.userId

    /**
     * 1. Count Businesses (Merchants)
     * Queries the merchants table for rows owned by the session user.
     */
    const [businessRows] = await pool.execute('SELECT COUNT(*) as count FROM merchants WHERE user_id = ?', [userId])

    /**
     * 2. Count Products
     * Joins products and merchants to ensure we only count items owned by this user.
     */
    const [productRows] = await pool.execute('SELECT COUNT(*) as count FROM products p JOIN merchants m ON p.merchant_id = m.id WHERE m.user_id = ?', [userId])

    /**
     * 3. Calculate Revenue and Sales Count
     * We sum the 'amount' column and count 'confirmed' entries from the transactions table.
     * We join with merchants to filter by the current user's merchant IDs.
     */
    const [transactionRows] = await pool.execute(
      `SELECT 
        SUM(t.amount) as totalRevenue, 
        COUNT(t.id) as totalSales 
       FROM transactions t 
       JOIN merchants m ON t.merchant_id = m.id 
       WHERE m.user_id = ? AND t.status = 'confirmed'`,
      [userId],
    )

    // Default to 0 if no results found
    const revenue = transactionRows[0].totalRevenue || 0
    const salesCount = transactionRows[0].totalSales || 0

    return NextResponse.json({
      success: true,
      stats: {
        businessCount: businessRows[0].count || 0,
        products: productRows[0].count || 0,
        revenue: parseFloat(revenue).toFixed(2), // Formatted for currency
        salesCount: salesCount,
        rating: 5.0, // Static until reviews table is implemented
      },
    })
  } catch (error) {
    console.error('[Stats Error]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
