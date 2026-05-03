/**
 * @file api/v1/public/stats/route.js
 * @description Aggregates platform-wide statistics for the LobPay status bar.
 * Calculates verified merchants, transaction volume, and active agents.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    /**
     * Optimized for LobPay Schema:
     * 1. Total Merchants: count from merchants (verified nodes)
     * 2. Total Volume: SUM of amount from transactions (Confirmed only)
     * 3. Global Activity: count from feedback (Agentic reviews)
     * 4. Active Agents: Unique wallets from transactions in last 24h
     */
    
    // 1. Merchants Count
    const [merchantRes] = await pool.execute('SELECT COUNT(*) as count FROM merchants WHERE is_active = 1')
    
    // 2. Transaction Volume (Settled)
    const [volumeRes] = await pool.execute('SELECT SUM(amount) as total FROM transactions WHERE status = "confirmed"')
    
    // 3. Feedback Activity
    const [feedbackRes] = await pool.execute('SELECT COUNT(*) as count FROM feedback')
    
    // 4. Agents active in the last 24 hours
    const [activeRes] = await pool.execute(`
      SELECT COUNT(DISTINCT agent_id) as count 
      FROM transactions 
      WHERE created_at >= NOW() - INTERVAL 1 DAY
    `)

    return NextResponse.json({
      success: true, // Standardized property name
      stats: {
        merchants: merchantRes[0]?.count || 0,
        totalVolume: parseFloat(volumeRes[0]?.total || 0).toFixed(2),
        activity: feedbackRes[0]?.count || 0,
        activeAgents: activeRes[0]?.count || 0,
        networkStatus: 'Healthy',
      },
    })

  } catch (error) {
    console.error('[STATS_API_ERROR]:', error.message)
    
    // Guaranteed Response for all branches
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch platform statistics',
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}