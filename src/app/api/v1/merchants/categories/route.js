/**
 * @file app/api/v1/merchant/categories/route.js
 * @description Enhanced CRUD for categories including Edit and Delete.
 */

import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch categories belonging to this merchant
    // Note: If categories are global in your schema, remove the merchant_id filter
    const [rows] = await pool.execute('SELECT * FROM categories WHERE merchant_id = ? OR merchant_id IS NULL ORDER BY name ASC', [session.userId])

    return NextResponse.json({ success: true, categories: rows })
  } catch (error) {
    console.error('[CATEGORIES_GET_ERROR]:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, description, icon } = await request.json()

    const [result] = await pool.execute('INSERT INTO categories (name, description, icon, merchant_id) VALUES (?, ?, ?, ?)', [name, description, icon || 'tag', session.userId])

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error('[CATEGORIES_POST_ERROR]:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

/**
 * PUT: Update an existing category
 */
export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id, name, description } = await request.json()

    // Ensure the category belongs to the logged-in merchant
    const [result] = await pool.execute('UPDATE categories SET name = ?, description = ? WHERE id = ? AND merchant_id = ?', [name, description, id, session.userId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Category not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Category updated' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * DELETE: Remove a category
 */
export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const [result] = await pool.execute('DELETE FROM categories WHERE id = ? AND merchant_id = ?', [id, session.userId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Delete failed: Not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
