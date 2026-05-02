/**
 * @file app/api/v1/merchant/transactions/[id]/route.js
 * @description Handles status updates for a specific transaction ID.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

/**
 * Handle PATCH requests to update transaction status.
 */
export async function PATCH(req, { params }) {
  try {
    // In Next.js 15, params is a Promise and must be awaited
    const { id } = await params

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { delivery_status } = await req.json()

    // Verify status matches your SQL ENUM
    const validStatuses = ['preparing', 'shipped', 'delivered', 'picked_up']
    if (!validStatuses.includes(delivery_status)) {
      return NextResponse.json({ error: 'Invalid delivery status' }, { status: 400 })
    }

    /**
     * Security: JOIN with merchants to ensure the transaction belongs
     * to the user currently logged in.
     */
    const [result] = await pool.execute(
      `UPDATE transactions t
       JOIN merchants m ON t.merchant_id = m.id
       SET t.delivery_status = ?
       WHERE t.id = ? AND m.user_id = ?`,
      [delivery_status, id, session.userId],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Transaction not found or access denied' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${delivery_status}`,
    })
  } catch (error) {
    console.error('Update Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Optional: Handle OPTIONS to avoid CORS issues if called from different subdomains
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
