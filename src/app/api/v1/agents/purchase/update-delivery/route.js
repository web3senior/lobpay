/**
 * @file app/api/v1/agents/purchase/update-delivery/route.js
 * @description Allows agents to update delivery metadata for existing transactions.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PATCH(req) {
  const connection = await pool.getConnection()
  try {
    const body = await req.json()
    const { transaction_id, delivery_details } = body
    
    /* Validate input */
    if (!transaction_id || !delivery_details) {
      return NextResponse.json({ error: 'TRANSACTION_ID_AND_DETAILS_REQUIRED' }, { status: 400 })
    }

    const { 
      delivery_address, 
      customer_phone, 
      delivery_notes 
    } = delivery_details

    /* Identify Agent via Authorization Header */
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null

    /* 1. Verify the transaction belongs to this specific agent */
    const [authCheck] = await connection.query(
      `SELECT t.id FROM transactions t
       JOIN agents a ON t.agent_id = a.id
       WHERE t.id = ? AND a.api_key = ? LIMIT 1`,
      [transaction_id, apiKey]
    )

    if (authCheck.length === 0) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED_OR_NOT_FOUND', 
        message: 'You can only update delivery details for your own transactions.' 
      }, { status: 403 })
    }

    /* 2. Update the delivery metadata */
    await connection.query(
      `UPDATE transactions 
       SET 
        delivery_address = COALESCE(?, delivery_address),
        customer_phone = COALESCE(?, customer_phone),
        delivery_notes = COALESCE(?, delivery_notes)
       WHERE id = ?`,
      [
        delivery_address || null, 
        customer_phone || null, 
        delivery_notes || null, 
        transaction_id
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'DELIVERY_DETAILS_SYNCHRONIZED',
      updated_fields: {
        delivery_address: !!delivery_address,
        customer_phone: !!customer_phone,
        delivery_notes: !!delivery_notes
      }
    })

  } catch (error) {
    console.error('[LobPay Update Error]:', error)
    return NextResponse.json({ error: 'INTERNAL_DATABASE_FAULT' }, { status: 500 })
  } finally {
    connection.release()
  }
}