/**
 * @file api/v1/public/types/route.js
 * @description Fetches the full production list of 30 merchant types.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const [types] = await pool.execute(
      `SELECT id, name, description FROM merchant_types ORDER BY id ASC`
    )

    return NextResponse.json({
      success: true,
      data: types,
      meta: {
        count: types.length,
        last_updated: '2026-02-26'
      }
    })
  } catch (error) {
    console.error('[TYPES_API_ERROR]:', error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch production types' },
      { status: 500 }
    )
  }
}