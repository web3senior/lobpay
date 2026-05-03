/**
 * @file lib/auth.js
 * @description Centralized authentication utility for verifying merchant sessions and agent API keys.
 */

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import pool from '@/lib/db' // Added the database pool import

/**
 * Verifies the 'merchant_session' cookie and returns the payload.
 * @returns {Object|null} Decoded JWT payload { address, userId } or null.
 */
export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('merchant_session')?.value

    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    return payload
  } catch (error) {
    return null
  }
}

/**
 * Validates if the authenticated user owns the resource they are trying to modify.
 */
export async function isOwner(targetAddress) {
  const session = await getSession()
  if (!session || !targetAddress) return false

  return session.address.toLowerCase() === targetAddress.toLowerCase()
}

/**
 * Verifies agent requests using the consolidated agents table.
 * @param {string} apiKey - The API key sent by the agent.
 */
export async function verifyAgentKey(apiKey) {
  try {
    /**
     * Query the consolidated agents table directly.
     * We check if the key exists and if the agent is still active.
     */
    const [rows] = await pool.execute(
      `SELECT id, agent_name, wallet_address, erc8004_identity 
       FROM agents 
       WHERE api_key = ? AND is_active = 1`,
      [apiKey],
    )

    if (rows.length === 0) return null

    /**
     * Update request telemetry directly on the agent record.
     */
    await pool.execute(
      `UPDATE agents 
       SET request_count = request_count + 1, 
           last_request_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [rows[0].id],
    )

    return rows[0]
  } catch (error) {
    console.error('Agent Auth Error:', error)
    return null
  }
}
