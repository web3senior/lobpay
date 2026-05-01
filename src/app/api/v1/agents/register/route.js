/**
 * @file app/api/v1/agents/auth/register/route.js
 * @description Registers agents and links their ERC-8004 decentralized identity using the consolidated agents table.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { recoverMessageAddress } from 'viem'
import crypto from 'crypto'

export async function POST(req) {
  try {
    const { address, signature, nonce, erc8004Address, agentName } = await req.json()
    const message = `${process.env.NEXT_PUBLIC_NAME} Agent Login Challenge: ${nonce}`

    // 1. Nonce Validation
    const [nonceRows] = await pool.execute('SELECT id FROM nonces WHERE nonce = ? AND expires_at > NOW()', [nonce])

    if (nonceRows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 403 })
    }

    // Burn nonce immediately
    await pool.execute('DELETE FROM nonces WHERE nonce = ?', [nonce])

    // 2. Signature Verification
    const recoveredAddress = await recoverMessageAddress({
      message: message,
      signature: signature,
    })

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Signature/Address mismatch' }, { status: 401 })
    }

    // 3. Generate New API Key
    const apiKey = `ak_live_${crypto.randomBytes(24).toString('hex')}`

    /**
     * 4. Unified Agent Upsert
     * Updates the existing record or creates a new one in the consolidated 'agents' table.
     */
    await pool.execute(
      `INSERT INTO agents (
        wallet_address, 
        erc8004_identity, 
        agent_name, 
        api_key, 
        is_active, 
        created_at
      ) 
      VALUES (?, ?, ?, ?, 1, NOW()) 
      ON DUPLICATE KEY UPDATE 
        erc8004_identity = VALUES(erc8004_identity),
        agent_name = IFNULL(VALUES(agent_name), agent_name),
        api_key = VALUES(api_key),
        is_active = 1`,
      [address.toLowerCase(), erc8004Address?.toLowerCase() || null, agentName || 'Unnamed Agent', apiKey],
    )

    return NextResponse.json({
      success: true,
      apiKey,
      erc8004Linked: !!erc8004Address,
      message: 'Agent verified and key issued.',
    })
  } catch (error) {
    console.error('[AGENT_REG_ERROR]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
