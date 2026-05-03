'use client'

/**
 * @file app/(merchant)/merchant/page.jsx
 * @description Updated Dashboard to reflect USDC revenue and real-time stats.
 */

import React, { useEffect, useState } from 'react'
import styles from './Page.module.scss'
import Shimmer from '@/components/ui/Shimmer'

export default function MerchantDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /**
     * Fetches consolidated stats including total business nodes,
     * revenue, and product counts from the backend.
     */
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/v1/merchants/stats')
        const json = await res.json()
        if (json.success) setData(json.stats)
      } catch (err) {
        console.error('Stats fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Currency formatter for USDC
  const formatUSDC = (val) => {
    return (
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      })
        .format(val || 0)
        .replace('$', '$ ') + ' USDC'
    )
  }

  const statsConfig = [
    {
      label: 'Total Revenue',
      // Changed from ETH to USDC formatting
      value: formatUSDC(data?.revenue),
      color: '#ec4848ff',
    },
    { label: 'Total Sales', value: data?.salesCount || 0, color: '#ec4848ff' },
    { label: 'Businesses', value: data?.businessCount || 0, color: '#ec4848ff' },
    { label: 'Active Products', value: data?.products || 0, color: '#ec4848ff' },
    { label: 'Avg Rating', value: `${data?.rating || 0} / 5`, color: '#ec4848ff' },
  ]

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Real-time performance across your merchant nodes.</p>
      </header>

      <section className={styles.statsGrid}>
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className={styles.statCard}>
                <Shimmer style={{ width: '60%', height: '14px', marginBottom: '10px' }} />
                <Shimmer style={{ width: '40%', height: '24px' }} />
              </div>
            ))
          : statsConfig.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statCard__label}>{stat.label}</span>
                <span className={styles.statCard__value} style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            ))}
      </section>

      <section className={styles.recentActivity}>
        <h2>Recent Transactions</h2>
        <p className="text-small text-muted">A live stream of agent interactions will appear here.</p>
        {/* You can now map through a data.recentTransactions array here if added to the API */}
      </section>
    </div>
  )
}
