'use client'

/**
 * @file components/dashboard/Header.jsx
 * @description Merchant dashboard header with WalletConnect + SIWE logic.
 */

import React, { useState } from 'react'
import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { Bell, Search, ChevronDown, Wallet } from 'lucide-react'
import styles from './Header.module.scss'

const Header = () => {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()
  const [isVerifying, setIsVerifying] = useState(false)

  /**
   * Signature Request Flow (SIWE)
   */
  const handleLogin = async () => {
    try {
      setIsVerifying(true)

      // 1. Get Nonce from API
      const nonceRes = await fetch('/api/v1/auth/nonce', {
        method: 'POST',
        body: JSON.stringify({ address }),
      })
      const { nonce } = await nonceRes.json()

      // 2. Sign the message
      const message = `Sign this message to login to LobGate: ${nonce}`
      const signature = await signMessageAsync({ message })

      // 3. Verify on backend and set HttpOnly Cookie
      const verifyRes = await fetch('/api/v1/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, nonce }),
      })

      if (verifyRes.ok) {
        window.location.reload() // Refresh to trigger middleware check
      }
    } catch (err) {
      console.error('SIWE Failed:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.header__search}>
        <Search size={18} />
        <input type="text" placeholder="Search transactions, products..." />
      </div>

      <div className={styles.header__actions}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.iconBtn__dot} />
        </button>

        <div className={styles.divider} />

        {isConnected ? (
          <div className={styles.profile}>
            <div className={styles.profile__info}>
              <span className={styles.profile__name}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <span className={styles.profile__status}>Node Active</span>
            </div>
            <button className={styles.profile__avatar} onClick={() => disconnect()}>
              <Wallet size={18} />
            </button>
          </div>
        ) : (
          <button className={styles.connectBtn} onClick={handleLogin} disabled={isVerifying}>
            {isVerifying ? 'Authenticating...' : 'Sign In with Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
