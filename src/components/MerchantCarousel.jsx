'use client'

/**
 * @file MerchantCarousel.jsx
 * @description LOBX-spec merchant carousel with Swiper integration and ledger-style mapping.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import styles from './MerchantCarousel.module.scss'

/* Swiper Styles */
import 'swiper/css'
import 'swiper/css/pagination'

export default function MerchantCarousel() {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await fetch('/api/v1/public/merchants/latest')
        const result = await res.json()

        /* Ledger sync: mapping standardized data object */
        if (result.success && Array.isArray(result.data)) {
          setMerchants(result.data)
        }
      } catch (err) {
        console.error('[SYSTEM_ERROR]: Ledger sync failed.')
      } finally {
        setLoading(false)
      }
    }
    fetchMerchants()
  }, [])

  if (loading) return (
    <div className={styles.loadingState}>
      <span className={styles.blink}>_</span> SCANNING_LOBX_SECTORS...
    </div>
  )

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.accent}>//</span> LOBX_FEATURED_UNITS
        </div>
        <div className={styles.headerLine}></div>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true, bulletClass: styles.bullet, bulletActiveClass: styles.bulletActive }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
        className={styles.container}
      >
        {merchants.map((m) => (
          <SwiperSlide key={m.id}>
            <div className={styles.unitCard}>
              <div className={styles.cardHeader}>
                <div className={styles.statusGroup}>
                  <div className={styles.livePulse}></div>
                  <span className={styles.txCount}>{m.total_tx || 0} TX</span>
                </div>
                <span className={styles.tag}>{m.business_type || 'GENERAL'}</span>
              </div>

              <div className={styles.cardBody}>
                <h4 className={styles.businessName}>
                  {m.business_name?.toUpperCase() || 'UNKNOWN_UNIT'}
                </h4>
                <div className={styles.location}>
                  LOC: {m.city?.toUpperCase() || 'GLOBAL'}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <code className={styles.unitId}>ID:{m.id.toString().padStart(4, '0')}</code>
                <Link target='_blank' href={`/merchants/${m.id}`} className={styles.viewLink}>
                  VIEW_PROFILE
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}