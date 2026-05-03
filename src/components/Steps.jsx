'use client'

/**
 * @file components/Steps.jsx
 * @description Renders a 3-step onboarding guide for merchants.
 * Follows BEM naming convention nested under the .page block.
 */

import React from 'react'
import styles from './Steps.module.scss'
import { Wallet, RefreshCw, Zap } from 'lucide-react'
import clsx from 'clsx'

const Steps = () => {
  const stepData = [
    {
      id: 1,
      title: 'Connect Wallet',
      description: 'Link your crypto wallet to establish your on-chain identity and reputation.',
      icon: <Wallet size={24} strokeWidth={1.2} />,
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
    <div className={styles.page}>
      <div className={clsx(styles.page__container, `__container`)} data-width={`xlarge`}>
        <div className={styles.page__stepsHeader}>
          <h2 className={styles.page__stepsTitle}>Start Selling in 3 Steps</h2>
          <p className={styles.page__stepsSubtitle}>Get your shop connected to the AI economy in minutes, not months.</p>
        </div>

        <div className={styles.page__stepsGrid}>
          {stepData.map((step) => (
            <div key={step.id} className={styles.stepCard}>
              <div className={styles.stepCard__number}>{step.id}</div>

              <div className={styles.stepCard__iconWrapper}>{step.icon}</div>

              <h3 className={styles.stepCard__title}>{step.title}</h3>
              <p className={styles.stepCard__description}>{step.description}</p>

              {/* Visual connector for the "Gate" aesthetic */}
              <div className={styles.stepCard__connector} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Steps
