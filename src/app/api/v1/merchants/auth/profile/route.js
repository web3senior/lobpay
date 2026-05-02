/**
 * @file app/api/v1/auth/merchant/profile/route.js
 * @description Retrieves user profile details for the connected wallet.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  try {
    // Lookup the user by wallet address
    const [rows] = await pool.execute('SELECT wallet_address as wallet, name, profile_image as profileImage FROM users WHERE wallet_address = ?', [address.toLowerCase()])

    if (rows.length === 0) {
      // Return a basic object if user exists in wallet but not yet in our DB
      return NextResponse.json({ wallet: address.toLowerCase(), profileImage: '' })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('[PROFILE_GET_ERROR]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
