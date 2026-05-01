/**
 * @file app/api/v1/agents/feedback/route.js
 * @description Records agent feedback linked to a specific transaction.
 * Adheres to unique transaction constraints and records on-chain proof if available.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req) {
  const connection = await pool.getConnection()
  
  try {
    const body = await req.json()
    const { transaction_id, rating, comment, onchain_proof_hash } = body

    // Basic Input Validation
    if (!transaction_id || !rating) {
      return NextResponse.json({ error: 'TRANSACTION_ID_AND_RATING_REQUIRED' }, { status: 400 })
    }

    // Resolve Agent Identity
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null

    const [agentRows] = await connection.query(
      'SELECT id FROM agents WHERE api_key = ? LIMIT 1',
      [apiKey]
    )

    if (agentRows.length === 0) {
      return NextResponse.json({ error: 'UNAUTHORIZED_AGENT_UNIT' }, { status: 401 })
    }

    const agent_id = agentRows[0].id

    /* VERIFICATION: 
       1. Ensure transaction exists and belongs to this agent.
       2. Retrieve the merchant_id associated with the transaction for the feedback record.
    */
    const [txRows] = await connection.query(
      'SELECT id, merchant_id FROM transactions WHERE id = ? AND agent_id = ? AND status = "confirmed" LIMIT 1',
      [transaction_id, agent_id]
    )

    if (txRows.length === 0) {
      return NextResponse.json({ 
        error: 'TRANSACTION_NOT_FOUND_OR_UNAUTHORIZED',
        message: 'Feedback can only be left for your own confirmed transactions.' 
      }, { status: 403 })
    }

    const { merchant_id } = txRows[0]

    // Begin Database Transaction to record feedback
    await connection.beginTransaction()

    /* Note: The UNIQUE KEY `transaction_id` in your SQL will naturally prevent 
       duplicates by throwing an error if this tx_id already exists in `feedback`.
    */
    const [result] = await connection.query(
      `INSERT INTO feedback (transaction_id, merchant_id, agent_id, rating, comment, onchain_proof_hash) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        transaction_id, 
        merchant_id, 
        agent_id, 
        rating, 
        comment || null, 
        onchain_proof_hash || null
      ]
    )

    await connection.commit()

    return NextResponse.json({
      success: true,
      feedback_id: result.insertId,
      message: 'FEEDBACK_SYNCHRONIZED_WITH_LEDGER'
    })

  } catch (error) {
    if (connection) await connection.rollback()
    
    // Handle unique constraint violation specifically
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'FEEDBACK_ALREADY_SUBMITTED_FOR_THIS_TRANSACTION' }, { status: 409 })
    }

    console.error('[FEEDBACK_SYNC_ERROR]:', error)
    return NextResponse.json({ error: 'INTERNAL_LEDGER_FAULT' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}