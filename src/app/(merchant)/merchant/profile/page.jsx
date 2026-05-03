'use client'

/**
 * @file app/merchant/profile/page.jsx
 * @description Merchant management interface with IPFS logo upload integration.
 */

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Indexer } from '@0gfoundation/0g-ts-sdk'
import styles from './Profile.module.scss'
import {
  Plus,
  Store,
  Pencil,
  Trash2,
  Power,
  X,
  MapPin,
  Crosshair,
  Mail,
  User,
  Home,
  Loader2,
  Wallet,
  AlertCircle,
  Camera,
  Check,
  UploadCloud,
} from 'lucide-react'
import { Loader2Icon } from 'lucide-react'
import MerchantLogo from '@/components/MerchantLogo'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi'
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className={styles.mapPlaceholder}>Initializing Map Engine...</div>,
})

export default function MerchantProfilePage() {
  const [merchants, setMerchants] = useState([])
  const [countries, setCountries] = useState([])
  const [merchantTypes, setMerchantTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef(null)

  const initialFormState = {
    business_name: '',
    contact_name: '',
    contact_email: '',
    logo_url: '',
    business_type_id: '',
    country_id: '',
    city: '',
    physical_address: '',
    wallet_address: '',
    latitude: '',
    longitude: '',
    description: '',
  }

  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/merchants/details')
      const result = await res.json()
      if (result.success) {
        setMerchants(result.merchants || [])
        setMerchantTypes(result.types || [])
        setCountries(result.countries || [])
      }
    } catch (err) {
      console.error('FETCH_ERROR:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles uploading the logo to IPFS.
   * This assumes you have an API route at /api/v1/ipfs/upload to handle the server-side pinning.
   */
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    const data = new FormData()
    data.append('file', file)

    try {
      // Replace this URL with your actual IPFS upload endpoint
      const res = await fetch('/api/v1/0g/', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (result.rootHash) {
        // result.cid or result.url should be the IPFS hash/gateway link
        setFormData((prev) => ({ ...prev, logo_url: result.rootHash }))
      } else {
        alert('IPFS Upload Failed: ' + result.error)
      }
    } catch (err) {
      console.error('IPFS_UPLOAD_ERROR:', err)
      alert('Error connecting to IPFS pinning service.')
    } finally {
      setIsUploading(false)
    }
  }

  const openEdit = (m) => {
    setEditingMerchant(m)
    setFormData({
      business_name: m.business_name || '',
      contact_name: m.contact_name || '',
      contact_email: m.contact_email || '',
      logo_url: m.logo_url || '',
      business_type_id: m.business_type_id || '',
      country_id: m.country_id || '',
      city: m.city || '',
      physical_address: m.physical_address || '',
      wallet_address: m.wallet_address || '',
      latitude: m.latitude || '',
      longitude: m.longitude || '',
      description: m.description || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingMerchant ? 'PUT' : 'POST'

    try {
      const res = await fetch('/api/v1/merchants/details', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingMerchant?.id }),
      })

      const result = await res.json()
      if (result.success) {
        setIsModalOpen(false)
        setEditingMerchant(null)
        setFormData(initialFormState)
        fetchData()
      }
    } catch (err) {
      console.error('SUBMIT_ERROR:', err)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/v1/merchants/details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: currentStatus ? 0 : 1 }),
      })
      if (res.ok) fetchData()
    } catch (err) {
      console.error('TOGGLE_ERROR:', err)
    }
  }

  if (loading)
    return (
      <div className={styles.loading}>
        <Loader2 className="animate-spin" /> SYNCHRONIZING_NODES...
      </div>
    )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Merchant Nodes</h1>
          <p>Manage your decentralized business identity.</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingMerchant(null)
            setFormData(initialFormState)
            setIsModalOpen(true)
          }}
        >
          <Plus size={20} />
          <span>Register New Node</span>
        </button>
      </header>

      {merchants.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle size={48} />
          <p>No nodes found for this user.</p>
        </div>
      ) : (
        <div className={styles.merchantGrid}>
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              className={`${styles.card} ${!merchant.is_active ? styles.inactive : ''}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <MerchantLogo
                    rootHash={merchant.logo_url}
                    className="w-12 h-12 rounded-full border"
                  />
                </div>
                <div className={styles.statusBadge}>
                  {merchant.is_active ? 'Online' : 'Offline'}
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3>{merchant.business_name}</h3>
                <div className={styles.infoRow}>
                  <User size={14} /> <span>{merchant.contact_name}</span>
                </div>
                <div className={styles.infoRow}>
                  <MapPin size={14} />
                  <span>
                    {merchant.city},{' '}
                    {countries.find((c) => c.id === merchant.country_id)?.iso_code || '??'}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => openEdit(merchant)} title="Edit Node">
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => toggleStatus(merchant.id, merchant.is_active)}
                  title="Toggle Visibility"
                >
                  <Power size={18} />
                </button>
                <button className={styles.deleteBtn} title="Remove Node">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingMerchant ? 'Edit Configuration' : 'Node Registration'}</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              {/* BRANDING SECTION WITH IPFS UPLOAD */}
              <div className={styles.formSection}>
                <h4>
                  <Store size={14} /> Branding
                </h4>

                <div className={styles.logoUploadWrapper}>
                  <div className={styles.logoPreview}>
                    {formData.logo_url ? (
                      <MerchantLogo
                        rootHash={formData.logo_url}
                        className="w-12 h-12 rounded-full border"
                      />
                    ) : (
                      <Store size={40} />
                    )}
                    <button
                      type="button"
                      className={styles.uploadTrigger}
                      onClick={() => fileInputRef.current.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    hidden
                  />
                  <div className={styles.field}>
                    <label>Logo 0G Hash</label>
                    <div className={styles.inputWithIcon}>
                      <input
                        type="text"
                        placeholder="0G Hash..."
                        value={formData.logo_url}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      />
                      {formData.logo_url && <Check size={16} className={styles.successIcon} />}
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Business Name</label>
                  <input
                    required
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Business Category</label>
                  <select
                    required
                    value={formData.business_type_id}
                    onChange={(e) => setFormData({ ...formData, business_type_id: e.target.value })}
                  >
                    <option value="">Select Category...</option>
                    {merchantTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* CONTACT SECTION */}
              <div className={styles.formSection}>
                <h4>
                  <Mail size={14} /> Contact Details
                </h4>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Contact Name</label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* LOGISTICS SECTION */}
              <div className={styles.formSection}>
                <h4>
                  <Home size={14} /> Location
                </h4>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Country</label>
                    <select
                      required
                      value={formData.country_id}
                      onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                    >
                      <option value="">Select Country...</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label>City</label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Physical Address</label>
                  <input
                    type="text"
                    value={formData.physical_address}
                    onChange={(e) => setFormData({ ...formData, physical_address: e.target.value })}
                  />
                </div>
              </div>

              {/* GEOLOCATION SECTION */}
              <div className={styles.formSection}>
                <h4>
                  <Crosshair size={14} /> Coordinates
                </h4>
                <div className={styles.mapContainer}>
                  <LocationPicker
                    lat={formData.latitude}
                    lng={formData.longitude}
                    onChange={(lat, lng) =>
                      setFormData((p) => ({ ...p, latitude: lat, longitude: lng }))
                    }
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Lat</label>
                    <input readOnly type="text" value={formData.latitude} />
                  </div>
                  <div className={styles.field}>
                    <label>Lng</label>
                    <input readOnly type="text" value={formData.longitude} />
                  </div>
                </div>
              </div>

              {/* SETTLEMENT SECTION */}
              <div className={styles.formSection}>
                <h4>
                  <Wallet size={14} /> Settlement
                </h4>
                <div className={styles.field}>
                  <label>Web3 Wallet Address</label>
                  <ENSname address= {formData.wallet_address} />
                  <input
                    required
                    type="text"
                    placeholder="0x..."
                    value={formData.wallet_address}
                    onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.submitBtn} disabled={isUploading}>
                  {isUploading
                    ? 'Waiting for IPFS...'
                    : editingMerchant
                      ? 'Update Configuration'
                      : 'Register Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


export const ENSname = ({ address }) => {
  const { data, status, error } = useEnsName({
    // Always use the address passed via props or a specific hardcoded one
    address: address,
    chainId: mainnet.id, // Force mainnet lookup for ENS
  })

  // 1. Handle Loading/Pending
  if (status === 'pending') return <div>Loading ENS...</div>

  // 2. Handle Error
  if (status === 'error') return <div>Error fetching ENS</div>

  // 3. Handle Success (but no ENS found)
  if (!data) return <div>{address || 'No ENS found'}</div>

  // 4. Success
  return <div>{data}</div>
}