/**
 * @file app/api/v1/agents/purchase/route.js
 * @description Finalizes purchase by recording transaction, line items, and delivery metadata.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req) {
  const connection = await pool.getConnection()
  try {
    const body = await req.json()
    
    /* Extract items and new delivery metadata */
    const { items, delivery_details } = body
    const { 
      delivery_address, 
      customer_phone, 
      delivery_notes 
    } = delivery_details || {}

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'ITEM_ARRAY_EMPTY' }, { status: 400 })
    }

    const firstProductId = items[0].product_id

    /* Decode the x402 Header for payment verification */
    const x402Header = req.headers.get('x402-payment-response') || req.headers.get('payment-response')
    let cleanTxHash = null
    if (x402Header) {
      try {
        const decoded = Buffer.from(x402Header, 'base64').toString('utf-8')
        cleanTxHash = JSON.parse(decoded).transaction || null
      } catch (e) {
        cleanTxHash = x402Header
      }
    }

    /* Identify Agent via Authorization Header */
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null

    /* Resolve Agent and Merchant in a single pre-check JOIN */
    const [preCheck] = await connection.query(
      `SELECT a.id as agent_id, p.merchant_id 
       FROM agents a
       INNER JOIN products p ON p.id = ?
       WHERE a.api_key = ? LIMIT 1`,
      [firstProductId, apiKey],
    )

    if (preCheck.length === 0) {
      return NextResponse.json({ error: 'VALID_AGENT_OR_PRODUCT_NOT_FOUND' }, { status: 404 })
    }

    const { agent_id, merchant_id } = preCheck[0]

    /* Begin Atomic Database Transaction */
    await connection.beginTransaction()

    /* Insert Parent Transaction with delivery details and initial 0 amount */
    const [txResult] = await connection.query(
      `INSERT INTO transactions (
        merchant_id, 
        agent_id, 
        amount, 
        transaction_hash, 
        status, 
        delivery_address, 
        customer_phone, 
        delivery_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        merchant_id, 
        agent_id, 
        0, 
        cleanTxHash, 
        'confirmed', 
        delivery_address || null, 
        customer_phone || null, 
        delivery_notes || null
      ],
    )
    const transaction_id = txResult.insertId

    let totalAmount = 0

    /* Insert Line Items and calculate finalized total */
    for (const item of items) {
      const [prod] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id])
      if (prod.length > 0) {
        const price = parseFloat(prod[0].price)
        const quantity = parseInt(item.quantity)
        totalAmount += price * quantity

        await connection.query(
          `INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_purchase) 
           VALUES (?, ?, ?, ?)`,
          [transaction_id, item.product_id, quantity, price],
        )
      }
    }

    /* Update the parent transaction with the finalized total amount */
    await connection.query('UPDATE transactions SET amount = ? WHERE id = ?', [totalAmount, transaction_id])

    await connection.commit()

    return NextResponse.json({
      success: true,
      transaction_id,
      recorded_hash: cleanTxHash,
      total_amount: totalAmount.toFixed(2),
      message: 'LOBPAY_TRANSACTION_SECURED',
    })
  } catch (error) {
    if (connection) await connection.rollback()
    console.error('[LobPay Purchase Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    connection.release()
  }
}