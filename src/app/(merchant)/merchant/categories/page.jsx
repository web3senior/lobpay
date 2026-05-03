'use client'

/**
 * @file app/merchant/categories/page.jsx
 * @description Category management with Create, Edit, and Delete functionality.
 */

import { useState, useEffect } from 'react'
import styles from './Page.module.scss'
import { Plus, Tag, Pencil, Trash2, X } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/merchants/categories')
      const data = await res.json()
      if (data.success) setCategories(data.categories)
    } catch (err) {
      console.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (cat) => {
    setEditingId(cat.id)
    setFormData({ name: cat.name, description: cat.description })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category? Products using this category will be unassigned.')) return

    try {
      const res = await fetch(`/api/v1/merchants/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) fetchCategories()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { id: editingId, ...formData } : formData

    try {
      const res = await fetch('/api/v1/merchants/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingId(null)
        setFormData({ name: '', description: '' })
        fetchCategories()
      }
    } catch (err) {
      console.error('Operation failed:', err)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Categories</h1>
          <p>Organize products for easier agent transactions.</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingId(null)
            setFormData({ name: '', description: '' })
            setIsModalOpen(true)
          }}
        >
          <Plus size={18} />
          Add Category
        </button>
      </header>

      <div className={styles.grid}>
        {!loading &&
          categories.map((cat) => (
            <div key={cat.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>
                  <Tag size={20} />
                </div>
                <div className="flex gap-025">
                  <button onClick={() => openEditModal(cat)} className={styles.iconBtn}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className={styles.iconBtnDelete}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <button type="submit" className={styles.submitBtn}>
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
