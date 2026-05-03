'use client'

/**
 * @file components/TradeStream.jsx
 * @description Renders a live feed of LobGate transactions with real-time Base explorer links.
 */

import React, { useState, useEffect, useCallback } from 'react'
import styles from './TradeStream.module.scss'
import clsx from 'clsx'
import { Bot, ShieldCheck, Zap, ArrowRight, Circle, Clock, ExternalLink } from 'lucide-react'

const TradeStream = () => {
  const [transactions, setTransactions] = useState([])
  const [nextPage, setNextPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Base Explorer URL constant
  const BASE_EXPLORER_URL = 'https://basescan.org/tx'

  const fetchTransactions = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const response = await fetch(`/api/v1/public/transactions?page=${nextPage}`)
      const data = await response.json()

      if (data.success && Array.isArray(data.transactions)) {
        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id))
          const uniqueItems = data.transactions.filter((t) => !existingIds.has(t.id))
          return [...prev, ...uniqueItems]
        })
        data.nextPage ? setNextPage(data.nextPage) : setHasMore(false)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('[LobGate] Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, nextPage])

  useEffect(() => {
    fetchTransactions()
  }, []) 

  return (
    <div className={styles.page}>
      <header className={styles.page__header}>
        <div className={styles.page__info}>
          <h2 className={styles.page__title}>Live Trade Feed</h2>
          <p className={styles.page__subtitle}>Real-time Agentic Transactions</p>
        </div>
        <div className={clsx(styles.page__badge, styles['page__badge--live'])}>
          <Circle size={8} fill="currentColor" className={styles.page__pulse} />
          LIVE GATEWAY
        </div>
      </header>

      <section className={styles.page__stats}>
        <div className={styles.statItem}>
          <span className={styles.statItem__value}>{transactions.length}</span>
          <span className={styles.statItem__label}>Loaded Trades</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statItem__value}>
            ${transactions.reduce((acc, tx) => acc + parseFloat(tx.amount || 0), 0).toFixed(2)}
          </span>
          <span className={styles.statItem__label}>Session Vol</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statItem__value}>
            {new Set(transactions.map((tx) => tx.wallet_address)).size}
          </span>
          <span className={styles.statItem__label}>Unique Agents</span>
        </div>
      </section>

      <main className={styles.page__list}>
        {transactions.length > 0
          ? transactions.map((tx) => (
              <article key={tx.id} className={styles.tradeCard}>
                <div className={styles.tradeCard__top}>
                  <div className={styles.tradeCard__entity}>
                    <div className={styles.tradeCard__icon}>
                      <Bot size={16} />
                    </div>
                    <div className={styles.tradeCard__meta}>
                      <span className={`${styles.tradeCard__agent} flex gap-025`}>
                        {tx.agent_name || 'Protocol Agent'}
                        <Zap size={14} className={styles.tradeCard__zap} />
                        <span>Purchased</span>
                      </span>
                      <code className={styles.tradeCard__hash}>
                        {tx.wallet_address?.slice(0, 6)}...{tx.wallet_address?.slice(-4)}
                      </code>
                    </div>
                  </div>

                  <ArrowRight size={14} className={styles.tradeCard__arrow} />

                  <div className={styles.tradeCard__merchant}>
                    <span className={styles.tradeCard__mName}>{tx.merchant_name}</span>
                    <span className={styles.tradeCard__status}>
                      {tx.status === 'confirmed' ? '✅ Settled' : '⏳ Pending'}
                    </span>
                  </div>

                  <div className={styles.tradeCard__amount}>
                    {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <small>{tx.currency_code}</small>
                  </div>
                </div>

                <footer className={styles.tradeCard__footer}>
                  <div className={styles.tradeCard__proof}>
                    <ShieldCheck size={12} />
                    {/* UPDATED: Link to Base Explorer */}
                    <a 
                      href={`${BASE_EXPLORER_URL}/${tx.proof_hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.tradeCard__explorerLink}
                    >
                      <span>Proof: {tx.proof_hash?.slice(0, 14)}...</span>
                      <ExternalLink size={10} className="ml-1" />
                    </a>
                  </div>
                  <div className={styles.tradeCard__timestamp}>
                    <Clock size={12} />
                    <time className={styles.tradeCard__time}>
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </time>
                  </div>
                </footer>
              </article>
            ))
          : !loading && <p className={styles.page__empty}>The gate is waiting for the next trade...</p>}
      </main>

      {hasMore && (
        <button 
          onClick={fetchTransactions} 
          className={clsx(styles.page__loadMore, loading && styles['page__loadMore--loading'])} 
          disabled={loading}
        >
          {loading ? 'Consulting Ledger...' : 'Load More Trades'}
        </button>
      )}
    </div>
  )
}

export default TradeStream