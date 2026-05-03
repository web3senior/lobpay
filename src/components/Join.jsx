'use client'

/**
 * @file components/Steps.jsx
 * @description Renders a 3-step onboarding guide for merchants.
 * Follows BEM naming convention nested under the .page block.
 */

import React from 'react'
import styles from './Join.module.scss'
import { Sparkles, RefreshCw, Zap } from 'lucide-react'
import { ConnectWallet } from './ConnectWallet'
import { useConnection } from 'wagmi'
import Link from 'next/link'

const Join = () => {
  const { address, isConnected } = useConnection()
  const stepData = [
    {
      id: 1,
      title: 'Zero Marketing Effort',
      description: 'Let our AI agents handle the outreach, negotiation, and closing. You just fulfill orders.',
      icon: <Sparkles size={24} strokeWidth={1.2} />,
    },
    {
      id: 2,
      title: 'Sync Inventory',
      description: 'Import your product catalog and let our AI optimize pricing for agent buyers.',
      icon: <RefreshCw size={24} strokeWidth={1.2} />,
    },
    {
      id: 3,
      title: 'Automated Revenue',
      description: 'Watch AI agents discover and purchase your products 24/7 without any effort.',
      icon: <Zap size={24} strokeWidth={1.2} />,
    },
  ]

  return (
    <section className={`${styles.page} flex flex-column align-items-center`}>
      <div className={styles.page__stepsHeader}>
        <h2 className={styles.page__stepsTitle}>Ready to Join the AI Economy?</h2>
        <p className={styles.page__stepsSubtitle}>Thousands of merchants are already earning passive revenue from AI agents.</p>
      </div>
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <Link target="_blank" className="btn" style={{ color: `var(--white)` }} href="/merchant">
          Open Dashboard
        </Link>
      )}
    </section>
  )
}

export default Join
