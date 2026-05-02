/**
 * @file api/v1/merchants/details/route.js
 * @description Secure endpoint for managing merchant profile configurations.
 */

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

/**
 * GET: Retrieves the current user's merchant nodes and metadata for the form.
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // 1. Fetch the user's specific merchants
    const [merchants] = await pool.execute(
      `SELECT * FROM merchants WHERE user_id = ? ORDER BY created_at DESC`,
      [session.userId]
    );

    // 2. Fetch business types for the dropdown selection
    const [types] = await pool.execute(`SELECT id, name FROM merchant_types ORDER BY name ASC`);

    // 3. Fetch countries for the dropdown selection
    const [countries] = await pool.execute(`SELECT id, name, iso_code FROM countries ORDER BY name ASC`);

    return NextResponse.json({
      success: true,
      merchants,      // Frontend expects this for the grid
      types,          // Frontend expects this for categories dropdown
      countries       // Frontend expects this for logistics dropdown
    });
  } catch (error) {
    console.error('[MERCHANT_DETAILS_GET_ERROR]:', error.message);
    return NextResponse.json({ success: false, error: 'DATABASE_QUERY_FAILED' }, { status: 500 });
  }
}

/**
 * POST: Register a new merchant node.
 */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();

    const [result] = await pool.execute(
      `INSERT INTO merchants (
        user_id, business_name, contact_name, contact_email, 
        logo_url, business_type_id, country_id, city, 
        physical_address, wallet_address, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.userId,
        body.business_name,
        body.contact_name,
        body.contact_email,
        body.logo_url,
        body.business_type_id,
        body.country_id,
        body.city,
        body.physical_address,
        body.wallet_address,
        body.latitude,
        body.longitude
      ]
    );

    return NextResponse.json({ success: true, insertId: result.insertId });
  } catch (error) {
    console.error('[MERCHANT_POST_ERROR]:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * PUT: Update an existing merchant node.
 */
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();

    // Verification: Ensure the merchant being updated belongs to the logged-in user
    const [check] = await pool.execute(
      `SELECT id FROM merchants WHERE id = ? AND user_id = ?`,
      [body.id, session.userId]
    );

    if (check.length === 0) {
      return NextResponse.json({ success: false, message: 'FORBIDDEN' }, { status: 403 });
    }

    await pool.execute(
      `UPDATE merchants SET 
        business_name = ?, contact_name = ?, contact_email = ?, 
        logo_url = ?, business_type_id = ?, country_id = ?, 
        city = ?, physical_address = ?, wallet_address = ?, 
        latitude = ?, longitude = ?
       WHERE id = ?`,
      [
        body.business_name, body.contact_name, body.contact_email,
        body.logo_url, body.business_type_id, body.country_id,
        body.city, body.physical_address, body.wallet_address,
        body.latitude, body.longitude, body.id
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[MERCHANT_PUT_ERROR]:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Toggle visibility (is_active)
 */
export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ success: false }, { status: 401 });

    const { id, is_active } = await request.json();

    await pool.execute(
      `UPDATE merchants SET is_active = ? WHERE id = ? AND user_id = ?`,
      [is_active, id, session.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}