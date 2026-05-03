'use client'

/**
 * @file components/AgentFeedback.jsx
 * @description Renders a feed of reviews. Corrected to match feedback table schema.
 * Nested under .page with BEM convention.
 */

import React, { useState, useEffect, useCallback } from 'react'
import styles from './AgentFeedback.module.scss'
import clsx from 'clsx'
import { Star, ShieldCheck, User, Globe } from 'lucide-react'

const AgentFeedback = () => {
  const [reviews, setReviews] = useState([])
  const [nextPage, setNextPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchFeedback = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const response = await fetch(`/api/v1/public/feedback?page=${nextPage}`)
      const data = await response.json()

      if (data.success && Array.isArray(data.feedback)) {
        setReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id))
          const uniqueItems = data.feedback.filter((r) => !existingIds.has(r.id))
          return [...prev, ...uniqueItems]
        })
        data.nextPage ? setNextPage(data.nextPage) : setHasMore(false)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('[Feedback] Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, nextPage])

  useEffect(() => {
    fetchFeedback()
  }, []) // Initial fetch only

  return (
    <div className={styles.page}>
      <header className={styles.page__header}>
        <div className={styles.page__info}>
          <h2 className={styles.page__title}>Agent Feedback</h2>
          <p className={styles.page__subtitle}>Live reputation updates from the Agent Network</p>
        </div>
      </header>

      <div className={styles.page__list}>
        {reviews.length > 0
          ? reviews.map((review) => (
              <article key={review.id} className={styles.feedbackCard}>
                <div className={styles.feedbackCard__header}>
                  <div className={styles.feedbackCard__agent}>
                    <div className={styles.feedbackCard__avatar}>
                      <User size={16} />
                    </div>
                    <div className={styles.feedbackCard__identity}>
                      {/* Displays agent name or falls back to wallet slice */}
                      <span className={styles.feedbackCard__name}>{review.agent_name || 'Anonymous Agent'}</span>
                      <span className={styles.feedbackCard__wallet}>
                        {review.agent_wallet?.slice(0, 6)}...{review.agent_wallet?.slice(-4)}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.feedbackCard__rating} flex`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? '#00FF8C' : 'none'} color={i < review.rating ? '#00FF8C' : '#475569'} />
                    ))}
                  </div>
                </div>

                <div className={styles.feedbackCard__body}>
                  {/* Updated from feedback_text to comment to match SQL */}
                  <p className={styles.feedbackCard__text}>&quot;{review.comment}&quot;</p>
                  <div className={styles.feedbackCard__target}>
                    Verified interaction with: <strong>{review.business_name}</strong>
                  </div>
                </div>

                <footer className={styles.feedbackCard__footer}>
                  <div className={styles.feedbackCard__meta}>
                    {review.onchain_proof_hash && (
                      <div className={styles.feedbackCard__hash}>
                        <ShieldCheck size={12} />
                        <span>Proof: {review.onchain_proof_hash.slice(0, 8)}...</span>
                      </div>
                    )}
                    {review.transaction_id && (
                      <div className={styles.feedbackCard__txn}>
                        <Globe size={12} />
                        <span>TX ID: {review.transaction_id}</span>
                      </div>
                    )}
                  </div>
                  <time className={styles.feedbackCard__date}>{new Date(review.created_at).toLocaleDateString()}</time>
                </footer>
              </article>
            ))
          : !loading && <p className={styles.page__empty}>No agent reports received yet.</p>}
      </div>

      {hasMore && (
        <button onClick={fetchFeedback} className={clsx(styles.page__btn, loading && styles['page__btn--loading'])} disabled={loading}>
          {loading ? 'Decrypting Reports...' : 'Load More Feedback'}
        </button>
      )}
    </div>
  )
}

export default AgentFeedback
