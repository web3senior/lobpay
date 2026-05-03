'use client'

/**
 * @file components/Steps.jsx
 * @description Renders a 4-step onboarding guide for merchants using BEM.
 */

import React from 'react'
import styles from './WhyUs.module.scss'
import { Sparkles, RefreshCw, Zap, ShieldCheck } from 'lucide-react'

const WhyUs = () => {
  const stepData = [
    {
      title: 'Zero Marketing Effort',
      description: 'Autonomous AI agents handle discovery and outreach. Your brand scales while you focus on fulfillment.',
      icon: <Sparkles size={24} strokeWidth={1.5} />,
    },
    {
      title: 'Sync Inventory',
      description: 'Connect your catalog via API. Our engine optimizes product schemas for seamless agent consumption.',
      icon: <RefreshCw size={24} strokeWidth={1.5} />,
    },
    {
      title: 'Automated Revenue',
      description: 'Agents execute high-frequency purchases 24/7, unlocking a new revenue stream with no manual input.',
      icon: <Zap size={24} strokeWidth={1.5} />,
    },
    {
      title: 'Onchain Trust',
      description: 'Every trade is cryptographically signed and settled on-chain, ensuring immutable proof of reputation.',
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
    },
  ]

  return (
    <section className={styles.page}>
      <header className={styles.page__header}>
        <h2 className={styles.page__title}>
          Why Brands Choose {process.env.NEXT_PUBLIC_NAME || 'LobGate'}
        </h2>
        <p className={styles.page__subtitle}>
          The premier infrastructure for brands scaling in the agentic economy.
        </p>
      </header>

      <div className={styles.page__grid}>
        {stepData.map((step, index) => (
          <article key={index} className={styles.stepCard}>
            <div className={styles.stepCard__head}>
              <div className={styles.stepCard__iconWrapper}>
                {step.icon}
              </div>
              <span className={styles.stepCard__number}>0{index + 1}</span>
            </div>

            <div className={styles.stepCard__content}>
              <h3 className={styles.stepCard__title}>{step.title}</h3>
              <p className={styles.stepCard__description}>{step.description}</p>
            </div>

            <div className={styles.stepCard__visualLine} />
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyUs