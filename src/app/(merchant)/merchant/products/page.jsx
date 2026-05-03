'use client'

/**
 * @file app/merchant/products/page.jsx
 * @description Merchant Dashboard with IPFS image upload integration.
 */

import { useState, useEffect, useCallback } from 'react'
import styles from './Products.module.scss'
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  X,
  Save,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Tag,
  Upload,
} from 'lucide-react'
import MerchantLogo from '@/components/MerchantLogo'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [merchants, setMerchants] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        categoryId: selectedCategory,
      })

      const [pRes, mRes, cRes] = await Promise.all([
        fetch(`/api/v1/merchants/products?${params.toString()}`),
        fetch('/api/v1/merchants/details'),
        fetch('/api/v1/merchants/categories'),
      ])

      const pData = await pRes.json()
      const mData = await mRes.json()
      const cData = await cRes.json()

      if (pData.success) {
        setProducts(pData.products || [])
        setTotalPages(pData.pagination?.totalPages || 1)
      }
      if (mData.success) setMerchants(mData.merchants || [])
      if (cData.success) setCategories(cData.categories || [])
    } catch (err) {
      console.error('[CLIENT_REFRESH_ERROR]:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedCategory])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshData()
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, currentPage, selectedCategory, refreshData])

  /**
   * HANDLER: Handle IPFS Image Upload
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/v1/0g/', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.rootHash) {
        setImageUrl(data.rootHash)
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('IPFS_UPLOAD_ERR:', err)
      alert('Network error during IPFS upload')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)

    payload.price = parseFloat(payload.price)
    payload.stock_quantity = parseInt(payload.stock_quantity)
    payload.category_id = payload.category_id ? parseInt(payload.category_id) : null
    // Use the IPFS URL from state
    payload.image_url = imageUrl

    if (!editingProduct && merchants.length > 0) {
      payload.merchant_id = merchants[0].id
    }

    const url = editingProduct ? `/api/v1/merchants/products/${editingProduct.id}` : '/api/v1/merchants/products'

    const res = await fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setIsModalOpen(false)
      setImageUrl('')
      refreshData()
    }
  }

  const openModal = (product = null) => {
    setEditingProduct(product)
    setImageUrl(product?.image_url || '')
    setIsModalOpen(true)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Catalog Management</h1>
          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <Search size={18} />
              <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className={styles.filterGroup}>
              <Filter size={18} />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => openModal()} className={styles.addBtn}>
            <Plus size={18} /> New Product
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {products?.map((product) => (
          <article key={product.id} className={styles.card}>
            <div className={styles.imageSection}>
              {product.image_url ? (
                <MerchantLogo rootHash={product.image_url} />
              ) : (
                <Package size={40} />
              )}
            </div>
            <div className={styles.info}>
              <div className={styles.metaRow}>
                <span className={styles.categoryTag}>
                  <Tag size={10} /> {product.category_name || 'Uncategorized'}
                </span>
              </div>
              <h3>{product.name}</h3>
              <p className={styles.descriptionSnippet}>{product.description}</p>
              <p className={styles.price}>{Number(product.price).toFixed(2)} USDC</p>
              <div className={styles.stockBadge}>Stock: {product.stock_quantity}</div>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => openModal(product)}>
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDelete(product.id)} className={styles.delete}>
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'EDIT_ITEM' : 'NEW_ITEM'}</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select name="category_id" defaultValue={editingProduct?.category_id || ''} required>
                  <option value="" disabled>
                    Select Category...
                  </option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Product Name</label>
                <input name="name" defaultValue={editingProduct?.name} required />
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea name="description" defaultValue={editingProduct?.description} rows={2} />
              </div>

              {/* IPFS IMAGE UPLOAD SECTION */}
              <div className={styles.inputGroup}>
                <label>Product Image (0G)</label>
                <div className={styles.uploadRow}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <span className={styles.loader}>Uploading...</span>}
                </div>
                {imageUrl && <p className={styles.ipfsHint}>0G RootHash: ...{imageUrl.slice(-15)}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Price (USDC)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Stock</label>
                  <input name="stock_quantity" type="number" defaultValue={editingProduct?.stock_quantity} required />
                </div>
              </div>

              <div className={styles.footer}>
                <button type="submit" className={styles.saveBtn} disabled={uploading}>
                  <Save size={18} /> {uploading ? 'UPLOADING...' : 'SYNC_CATALOG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
