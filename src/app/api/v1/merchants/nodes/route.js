/**
 * @file app/api/v1/merchant/nodes/route.js
 * @description Fetches all merchant nodes (businesses) owned by the current user.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false }, { status: 401 })

    // This query pulls the "nodes" (merchants) from your SQL dump
    const [rows] = await pool.execute(
      `SELECT id, business_name, city, wallet_address 
       FROM merchants 
       WHERE user_id = ? AND is_active = 1`,
      [session.userId],
    )

    return NextResponse.json({ success: true, merchants: rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
