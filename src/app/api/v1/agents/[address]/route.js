/**
 * @file app/api/v1/public/agents/profile/[address]/route.js
 * @description Retrieves a public profile for an agent, including their ERC-8004 identity.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req, { params }) {
  try {
    const { address } = await params
    const walletAddress = address.toLowerCase()

    /**
     * Fetch Agent Base Info
     * Including the newly added erc8004_identity column.
     */
    const [agentRows] = await pool.execute(
      `SELECT id, wallet_address, erc8004_identity, agent_name, created_at 
       FROM agents 
       WHERE wallet_address = ? AND is_active = 1`,
      [walletAddress],
    )

    if (agentRows.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const agent = agentRows[0]

    /**
     * Fetch Lobgate Activity Stats
     * We focus on commerce metrics: transactions handled and merchant feedback given.
     */
    const [statsRows] = await pool.execute(
      `SELECT 
        (SELECT COUNT(*) FROM transactions WHERE agent_id = ?) as total_purchases,
        (SELECT COUNT(*) FROM feedback WHERE agent_id = ?) as feedback_given,
        (SELECT IFNULL(SUM(amount), 0) FROM transactions WHERE agent_id = ? AND status = 'confirmed') as volume_processed`,
      [agent.id, agent.id, agent.id],
    )

    /**
     * Fetch Recent Activity
     * Displays recent merchant interactions.
     */
    const [recentActivity] = await pool.execute(
      `SELECT t.id, t.amount, t.status, t.created_at, m.business_name
       FROM transactions t
       JOIN merchants m ON t.merchant_id = m.id
       WHERE t.agent_id = ?
       ORDER BY t.created_at DESC LIMIT 5`,
      [agent.id],
    )

    return NextResponse.json({
      success: true,
      data: {
        identity: {
          name: agent.agent_name || 'Anonymous Agent',
          wallet: agent.wallet_address,
          erc8004: agent.erc8004_identity, // The anchor for decentralized reputation
        },
        stats: {
          total_purchases: statsRows[0].total_purchases,
          feedback_submitted: statsRows[0].feedback_given,
          total_volume: parseFloat(statsRows[0].volume_processed).toFixed(4),
        },
        history: recentActivity,
        meta: {
          joined: agent.created_at,
          status: 'verified_active',
        },
      },
    })
  } catch (error) {
    console.error('[PUBLIC_AGENT_PROFILE_ERROR]:', error.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
