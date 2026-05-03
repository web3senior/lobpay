'use client'

/**
 * @file components/Reputation.jsx
 * @description Merchant leaderboard with geospatial awareness and volume tracking.
 */

import React, { useState, useEffect } from 'react'
import styles from './Reputation.module.scss'
import clsx from 'clsx'
import { Medal, Star, Store, Loader2, MapPin, TrendingUp } from 'lucide-react'
import MerchantLogo from './MerchantLogo'

const Reputation = () => {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // Example with lat/lng - in production, you'd get this from the agent/browser
        const response = await fetch('/api/v1/public/rankings?limit=5')
        const result = await response.json()

        if (result.success) {
          setMerchants(result.data)
          setMeta(result.meta)
        }
      } catch (error) {
        console.error('[Reputation] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRankings()
  }, [])

  return (
    <div className={styles.page}>
      <div className={clsx(styles.card, 'flex flex-column')}>
        <header className={styles.card__header}>
          <div className={styles.card__titleGroup}>
            <Medal className={styles.card__icon} size={20} />
            <b className={styles.card__title}>Top Reputation</b>
          </div>
          <p className={styles.card__subtitle}>
            {meta?.location_filtered ? 'Local proximity rankings' : 'Verified network trust scores'}
          </p>
        </header>

        <div className={styles.card__body}>
          <main className={styles.merchantList}>
            {!loading && merchants.length > 0 ? (
              merchants.map((merchant, index) => {
                const rank = index + 1
                return (
                  <article 
                    key={merchant.id} 
                    className={clsx(styles.merchantCard, styles[`merchantCard--rank${rank}`])}
                  >
                    <div className={styles.merchantCard__rank}>
                      {rank <= 3 ? <Medal size={16} className={styles[`icon--rank${rank}`]} /> : `#${rank}`}
                    </div>

                    <div className={styles.merchantCard__avatar}>
                      <MerchantLogo
                        rootHash={merchant.logo_url}
                        className="w-12 h-12 rounded-full border"
                      />
                    </div>

                    <div className={styles.merchantCard__info}>
                      <div className={styles.merchantCard__identity}>
                        <span className={styles.merchantCard__name}>{merchant.business_name}</span>
                        {merchant.distance_km && (
                          <span className={styles.merchantCard__distance}>
                            <MapPin size={10} /> {merchant.distance_km}km
                          </span>
                        )}
                      </div>
                      <span className={styles.merchantCard__type}>{merchant.business_type || 'General'}</span>
                    </div>

                    <div className={styles.merchantCard__stats}>
                      <div className={styles.merchantCard__rating}>
                        <Star size={14} fill="currentColor" />
                        <span className={styles.merchantCard__score}>
                          {Number(merchant.avg_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className={styles.merchantCard__volume}>
                        <TrendingUp size={12} />
                        <span>${Number(merchant.total_volume).toLocaleString()}</span>
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              !loading && <p className={styles.page__empty}>No merchants found in this area.</p>
            )}

            {loading && (
              <div className={styles.page__loader}>
                <Loader2 className="animate-spin" size={20} />
                <span>Syncing Rankings...</span>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}



export default Reputation