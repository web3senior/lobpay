/**
 * @file app/api/v1/auth/merchant/nonce/route.js
 * @description Generates a cryptographic nonce for Merchant login.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import crypto from 'crypto'

export async function POST(request) {
  try {
    // Cryptographically secure hex string
    const nonce = crypto.randomBytes(16).toString('hex')
    const ip_address = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1'

    // Expiration: 5 minutes is standard for SIWE
    const expires_at = new Date(Date.now() + 5 * 60 * 1000)

    /**
     * Use ON DUPLICATE KEY UPDATE.
     * This prevents errors if a merchant requests a second nonce before the first one expires.
     */
    await pool.execute(
      `INSERT INTO nonces (nonce, ip_address, entity_type, expires_at) 
       VALUES (?, ?, 'agent', ?)
       ON DUPLICATE KEY UPDATE 
       nonce = VALUES(nonce), 
       ip_address = VALUES(ip_address), 
       expires_at = VALUES(expires_at)`,
      [nonce, ip_address, expires_at],
    )

    return NextResponse.json({
      success: true,
      nonce,
      message: `${process.env.NEXT_PUBLIC_NAME} Agent Login Challenge: ${nonce}`,
    })
  } catch (error) {
    console.error('[AUTH_NONCE_ERROR]:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate challenge' }, { status: 500 })
  }
}
