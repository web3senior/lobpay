/**
 * @file api/v1/transactions/route.js
 * @description Fetches paginated commerce transactions with standardized metadata.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10 
    const offset = (page - 1) * limit

    /**
     * Ledger Join Logic:
     * Fetch limit + 1 to determine nextPage (Peek-Ahead).
     */
    const [rows] = await pool.execute(
      `SELECT 
        t.id, 
        t.amount, 
        'USDC' AS currency_code, 
        t.created_at,
        t.transaction_hash AS proof_hash,
        t.status,
        a.wallet_address,
        a.agent_name,
        m.business_name AS merchant_name,
        'Agentic Purchase' AS product_name,
        1 AS quantity
      FROM transactions t
      INNER JOIN merchants m ON t.merchant_id = m.id
      INNER JOIN agents a ON t.agent_id = a.id
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`,
      [limit + 1, offset],
    )

    const hasMore = rows.length > limit
    const transactionsToSend = hasMore ? rows.slice(0, limit) : rows
    const nextPage = hasMore ? page + 1 : null

    /* SUCCESS BRANCH: Standardized response including full meta object */
    return NextResponse.json({
      success: true,
      transactions: transactionsToSend,
      nextPage: nextPage,
      meta: {
        page: page,
        limit: limit,
        count: transactionsToSend.length,
        hasMore: hasMore
      }
    })

  } catch (error) {
    console.error('[LobGate API] Ledger Error:', error.message)

    /* ERROR BRANCH: Standardized error response */
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch transaction stream',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}