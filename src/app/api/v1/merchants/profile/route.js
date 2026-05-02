/**
 * @file app/api/v1/merchant/details/route.js
 * @description Unified API for Merchant Node management.
 * Correctly handles Coordinates, Contact Info, and Visibility status.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

/* GET: Fetches data for the dashboard */
export async function GET() {
  try {
    const [merchants] = await pool.execute(`SELECT * FROM merchants ORDER BY created_at DESC`)
    const [types] = await pool.execute(`SELECT id, name FROM merchant_types`)
    const [countries] = await pool.execute(`SELECT id, name, iso_code FROM countries`)
    return NextResponse.json({ success: true, merchants, types, countries })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

/* POST: Creates a new merchant entry */
export async function POST(request) {
  try {
    const data = await request.json()
    const [result] = await pool.execute(
      `INSERT INTO merchants (
        business_name, contact_name, contact_email, logo_url, 
        business_type_id, country_id, city, physical_address, 
        destination_address, latitude, longitude, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        data.business_name,
        data.contact_name || null,
        data.contact_email || null,
        data.logo_url || null,
        data.business_type_id || null,
        data.country_id || null,
        data.city || null,
        data.physical_address || null,
        data.destination_address || null,
        data.latitude || null,
        data.longitude || null,
      ],
    )
    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error('[POST_ERROR]', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

/* PUT: Updates existing merchant entry */
export async function PUT(request) {
  try {
    const data = await request.json()
    await pool.execute(
      `UPDATE merchants SET 
        business_name = ?, contact_name = ?, contact_email = ?, logo_url = ?,
        business_type_id = ?, country_id = ?, city = ?, physical_address = ?,
        destination_address = ?, latitude = ?, longitude = ?
       WHERE id = ?`,
      [
        data.business_name,
        data.contact_name || null,
        data.contact_email || null,
        data.logo_url || null,
        data.business_type_id || null,
        data.country_id || null,
        data.city || null,
        data.physical_address || null,
        data.destination_address || null,
        data.latitude || null,
        data.longitude || null,
        data.id,
      ],
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PUT_ERROR]', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

/* PATCH: Toggles hidden/online status */
export async function PATCH(request) {
  try {
    const { id, is_active } = await request.json()
    await pool.execute(`UPDATE merchants SET is_active = ? WHERE id = ?`, [is_active, id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
