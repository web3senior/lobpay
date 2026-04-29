'use client'

/**
 * @file components/Hero.jsx
 * @description Hero section with Buyer/Seller tabs and Light Theme workflow.
 */

import Link from 'next/link'
import { useState } from 'react'
import {
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Terminal,
  FileCode,
  Copy,
  Check,
  ArrowRight,
  Wallet,
  Store,
  LayoutGrid,
  PartyPopper,
} from 'lucide-react'
import { useConnection } from 'wagmi'
import styles from './Hero.module.scss'

export default function Hero() {
  const { address, isConnected } = useConnection()
  const [activeTab, setActiveTab] = useState('buyer') // 'buyer' or 'seller'
  const [copied, setCopied] = useState(false)
  const installCmd = 'npm install @openclaw/skill-purchase'

  const copyCommand = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className={styles.page}>
      <div className={`${styles.page__container} __container d-f-c flex-column`} data-width="small">
        <figure className={styles.hero__logo}>
          <img src="/logo.svg" alt="Logo" style={{ width: '56px' }} />
        </figure>

        <div className={styles.hero__attribution}>
          <Sparkles className={styles.hero__sparkle} size={14} strokeWidth={1.5} />
          <p>
            Powered by <span>OpenClaw</span> AI Protocol
          </p>
        </div>

        <h1 className={styles.hero__title}>
          Commerce for the <span className="color-primary">Agentic</span> Era
        </h1>

        <p className={styles.hero__description}>
          {process.env.NEXT_PUBLIC_NAME} connects your shop to a global network of AI agents.
          <strong> Zero marketing effort. 24/7 revenue.</strong>
        </p>

        {/* --- Tab Switcher --- */}
        <div className={styles.tabSwitcher}>
          <button className={activeTab === 'buyer' ? styles.activeTab : ''} onClick={() => setActiveTab('buyer')}>
            I'm a Buyer (AI Agent)
          </button>
          <button className={activeTab === 'seller' ? styles.activeTab : ''} onClick={() => setActiveTab('seller')}>
            I'm a Seller (Merchant)
          </button>
        </div>

        <div className={`${styles.hero__contentArea} mt-30`}>
          {activeTab === 'buyer' ? (
            /* BUYER VIEW: Terminal */
            <div className={styles.tabContent}>
              <div className={styles.terminal}>
                <div className={`${styles.terminalHeader} flex align-items-center justify-content-between`}>
                  <div className="flex align-items-center gap-075">
                    <img src="/openclaw.svg" alt="OpenClaw" className={styles.terminalIcon} />
                    <span className={styles.terminalTitle}>Agent Skill Installation</span>
                  </div>
                  <div className={styles.terminalDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className={styles.terminalBody}>
                  <div className={styles.terminalRow}>
                    <span className={styles.prompt}>$</span>
                    <code className={styles.codeText}>{installCmd}</code>
                    <button className={styles.copyBtn} onClick={copyCommand}>
                      {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className={styles.terminalHint}>
                    <Terminal size={12} />
                    <span>Manifest at {process.env.NEXT_PUBLIC_BASE_URL}/skill.md</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mt-20 justify-center d-f-c">
                <Link href="/skill.md" target="_blank" className={styles.outlineBtn}>
                  <FileCode size={16} />
                  <span>View SKILL.md</span>
                </Link>
              </div>
            </div>
          ) : (
            /* SELLER VIEW: Workflow Steps */
            <div className={styles.tabContent}>
              <div className={styles.workflowGrid}>
                {/* Step 1: Authentication */}
                <div className={styles.step}>
                  <div className={styles.stepNumber}>
                    <Wallet size={18} />
                  </div>
                  <div className={styles.stepInfo}>
                    <p className={styles.stepTitle}>Connect Wallet</p>
                    <span className={styles.stepDesc}>Secure Web3 Auth</span>
                  </div>
                </div>

                <div className={styles.stepArrow}>
                  <ArrowRight size={16} />
                </div>

                {/* Step 2: Merchant Identity */}
                <div className={styles.step}>
                  <div className={styles.stepNumber}>
                    <Store size={18} />
                  </div>
                  <div className={styles.stepInfo}>
                    <p className={styles.stepTitle}>Register Node</p>
                    <span className={styles.stepDesc}>Setup Merchant Identity</span>
                  </div>
                </div>

                <div className={styles.stepArrow}>
                  <ArrowRight size={16} />
                </div>

                {/* Step 3: Product Deployment */}
                <div className={styles.step}>
                  <div className={styles.stepNumber}>
                    <LayoutGrid size={18} />
                  </div>
                  <div className={styles.stepInfo}>
                    <p className={styles.stepTitle}>List Products</p>
                    <span className={styles.stepDesc}>Expose to AI Agents</span>
                  </div>
                </div>

                <div className={styles.stepArrow}>
                  <ArrowRight size={16} />
                </div>

                {/* Step 4: Finalization */}
                <div className={styles.step}>
                  <div className={`${styles.stepNumber} ${styles.stepNumber__success}`}>
                    <PartyPopper size={18} />
                  </div>
                  <div className={styles.stepInfo}>
                    <p className={styles.stepTitle}>Receive Revenue</p>
                    <span className={styles.stepDesc}>24/7 Auto-Settlement</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mt-30 justify-center d-f-c">
                {isConnected && (
                  <Link target="_blank" className="btn" style={{ color: `var(--white)` }} href="/merchant">
                    Open Dashboard
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className={`${styles.hero__badges} flex gap-2 mt-50`}>
          <div className={styles.badgeItem}>
            <ShieldCheck size={18} /> <span>Onchain verified</span>
          </div>
          <div className={styles.badgeItem}>
            <Globe size={18} /> <span>250+ countries</span>
          </div>
          <div className={styles.badgeItem}>
            <TrendingUp size={18} /> <span>24/7 automated</span>
          </div>
        </div>
      </div>
    </section>
  )
}
