/**
 * @file app/api/v1/merchant/transactions/route.js
 * @description Fetches transactions for the logged-in user based on the lobgate schema.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const userId = session.userId
    // Log this to your terminal to see which user is logged in
    console.log(`[Transactions] Request for User ID: ${userId}`)

    // 1. Fetch transactions by joining merchants to filter by the user's ID
    const [transactions] = await pool.execute(
      `SELECT 
        t.*, 
        m.business_name,
        m.logo_url
      FROM transactions t
      INNER JOIN merchants m ON t.merchant_id = m.id
      WHERE m.user_id = ?
      ORDER BY t.created_at DESC`,
      [userId],
    )

    if (transactions.length > 0) {
      const ids = transactions.map((t) => t.id)
      const placeholders = ids.map(() => '?').join(',')

      // 2. Fetch items using product_id join from your 'products' table
      const [allItems] = await pool.execute(
        `SELECT 
          ti.transaction_id,
          ti.quantity,
          ti.price_at_purchase,
          p.name as product_name,
          p.image_url
         FROM transaction_items ti
         LEFT JOIN products p ON ti.product_id = p.id
         WHERE ti.transaction_id IN (${placeholders})`,
        ids,
      )

      // 3. Attach items to transactions
      transactions.forEach((tx) => {
        tx.items = allItems.filter((item) => item.transaction_id === tx.id)
      })
    }

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error('[TX_API_ERROR]:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
