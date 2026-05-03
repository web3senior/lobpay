'use client'

/**
 * @file app/merchants/[id]/page.jsx
 * @description Robust Merchant Profile with deep safety checks for DB data.
 */

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Grid, Bookmark, MapPin,  Store, CheckCircle2, MoreHorizontal, Package, Tag, Filter, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import styles from './MerchantProfile.module.scss'
import { Loader2 } from 'lucide-react'
import MerchantLogo from '@/components/MerchantLogo'

// Dynamically import map to prevent SSR issues
const Map = dynamic(() => import('../_components/ProfileMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>INITIALIZING_SAT_LINK...</div>,
})

export default function MerchantProfile() {
  const { id } = useParams()

  // Initialize state with the expected structure to prevent 'undefined' errors
  const [data, setData] = useState({
    profile: null,
    catalog: [],
    filterOptions: { categories: [] },
  })
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/v1/merchants/${id}`)
        const result = await res.json()
        console.log(result)

        if (result.success) {
          // Merge result with default structure to ensure categories exists
          setData({
            profile: result.profile || null,
            catalog: result.catalog || [],
            filterOptions: {
              categories: result.filterOptions?.categories || [],
            },
          })
        }
      } catch (err) {
        console.error('CRITICAL_FETCH_ERROR:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  /**
   * Filtered Catalog Memo
   * Uses optional chaining to prevent crashes during state transitions.
   */
  const filteredCatalog = useMemo(() => {
    const catalog = data?.catalog || []
    return catalog.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category_id === parseInt(activeCategory)
      const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [data, activeCategory, searchQuery])

  if (loading) return <div className={styles.status}>CONNECTING_TO_NODES...</div>
  if (!data.profile) return <div className={styles.status}>MERCHANT_NOT_FOUND</div>

  const { profile, filterOptions } = data
  const position = [parseFloat(profile.latitude) || 0, parseFloat(profile.longitude) || 0]

  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <header className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <MerchantLogo
              rootHash={profile.logo_url}
              className="w-12 h-12 rounded-full border"
            />
          </div>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.topRow}>
            <h1 className={styles.username}>
              {profile.business_name?.toLowerCase().replace(/\s+/g, '_') || 'unknown_node'}
              <CheckCircle2 size={18} className={styles.verifiedIcon} />
            </h1>
            <button className={styles.actionBtn}>Connect Agent</button>
            <MoreHorizontal size={20} className={styles.moreIcon} />
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <b>{data.catalog?.length || 0}</b> provisions
            </div>
            <div className={styles.statItem}>
              <b>{profile.request_count || 0}</b> requests
            </div>
            <div className={styles.statItem}>
              <b>100%</b> uptime
            </div>
          </div>

          <div className={styles.bioSection}>
            <span className={styles.fullName}>{profile.business_name}</span>
            <span className={styles.category}>
              <Package size={12} /> {profile.business_type || 'Merchant'}
            </span>
            <p className={styles.description}>{profile.description || 'No description available.'}</p>
            <div className={styles.locationTag}>
              <MapPin size={12} /> {profile.city || 'Remote'}
            </div>
          </div>
        </div>
      </header>

      {/* Filter Navigation */}
      <nav className={styles.filterBar}>
        <div className={styles.filterHeader}>
          <Filter size={14} /> <span>FILTER_BY_CATEGORY</span>
        </div>
        <div className={styles.chipContainer}>
          <button
            className={activeCategory === 'all' ? styles.activeChip : styles.chip}
            onClick={() => setActiveCategory('all')}
          >
            All Provisions
          </button>

          {/* CRASH-PROOF MAP: categories is guaranteed to be an array by the useState initialization */}
          {filterOptions.categories.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory == cat.id ? styles.activeChip : styles.chip}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Map Section */}
      <section className={styles.mapWrapper}>
        <div className={styles.leafletContainer}>
          <Map position={position} businessName={profile.business_name} />
        </div>
      </section>

      {/* Product Grid */}
      <main className={styles.grid}>
        {filteredCatalog.length > 0 ? (
          filteredCatalog.map((item) => (
            <article key={item.id} className={styles.tile}>
              <div className={styles.tileImage}>
                {item.image_url ? (
                   <MerchantLogo rootHash={item.image_url} />
              
                ) : (
                  <div className={styles.tilePlaceholder}>
                    <span>NO_VISUAL</span>
                  </div>
                )}
                <div className={styles.tileOverlay}>
                  <span className={styles.tilePrice}>{parseFloat(item.price).toFixed(2)} USDC</span>
                </div>
              </div>
              <div className={styles.tileMeta}>
                <span className={styles.tag}>
                  <Tag size={10} /> {item.category_name || 'General'}
                </span>
                <h4>{item.name}</h4>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.noResults}>NO_MATCHING_PROVISIONS</div>
        )}
      </main>
    </div>
  )
}
