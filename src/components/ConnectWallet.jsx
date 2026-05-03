'use client'

/**
 * @file components/ConnectWallet.jsx
 * @description Complete Wallet connection with SIWE, Profile fetching, and navigation to Merchant Dashboard.
 * Adheres to established conventions and uses refactored API paths.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useClientMounted } from '@/hooks/useClientMount'
import { config } from '@/config/wagmi'
import { useAccount, useDisconnect, useConnect, useSwitchChain, useSignMessage } from 'wagmi'
import { getActiveChain } from '@/lib/communication'
import Shimmer from '@/components/ui/Shimmer'
import styles from './ConnectWallet.module.scss'
import clsx from 'clsx'

export const ConnectWallet = () => {
  const [showModal, setShowModal] = useState(false)
  const [activeChain] = useState(getActiveChain())
  const mounted = useClientMounted()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const networkDialogRef = useRef(null)

  /**
   * Logs the user out: disconnects wallet and clears HttpOnly session cookie.
   */
  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      disconnect()
      await fetch('/api/v1/merchants/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const openNetworkModal = () => {
    if (networkDialogRef.current) {
      networkDialogRef.current.showModal()
    }
  }

  if (!mounted) return null

  return (
    <div className={clsx('flex flex-row align-items-center gap-050')}>
      {/* {activeChain[0] && (
        <div className={styles.networks}>
          <button className={styles.btnNetwork} onClick={openNetworkModal} title={activeChain[0].name}>
            <span className="rounded" dangerouslySetInnerHTML={{ __html: activeChain[0].icon }} />
          </button>
      <DefaultNetwork dialogRef={networkDialogRef} currentNetwork={activeChain[0].id} /> 
        </div>
      )} */}

      {isConnected ? (
        <div className="flex align-items-center gap-050">
          {/* Link profile to the merchant dashboard */}
          <Link href="/merchant" className={styles.profileLink}>
            <Profile addr={address} />
          </Link>

          <button className={styles.btnDisconnect} onClick={handleLogout} title="Disconnect">
            <DisconnectIcon />
          </button>
        </div>
      ) : (
        <button className={clsx(styles.btnConnect, 'flex align-items-center gap-025')} onClick={() => setShowModal(true)}>
          Connect
        </button>
      )}

      {showModal && <WalletConnectModal setShowModal={setShowModal} />}
    </div>
  )
}

/**
 * Profile Component: Fetches user details from the refactored auth/profile API.
 * Correctly handles Twitter URLs vs IPFS CIDs.
 */
const Profile = ({ addr }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!addr) return

    const fetchProfile = async () => {
      try {
        // Fetch from refactored auth path
        const res = await fetch(`/api/v1/merchants/profile?address=${addr}`)
        const profile = await res.json()

        if (profile?.success) {
          // Fallback if profile_image is null (using your provided CID)
          const rawImg = profile.profile_image || `bafkreiatl2iuudjiq354ic567bxd7jzhrixf5fh5e6x6uhdvl7xfrwxwzm`

          // Logic: Twitter URLs start with http, IPFS CIDs need a gateway
          const finalImg = rawImg.startsWith('http') ? rawImg : `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${rawImg}`

          setData({
            ...profile,
            profile_image: finalImg,
          })
        }
      } catch (err) {
        console.error('Profile fetch failed:', err)
      }
    }

    fetchProfile()
  }, [addr])

  if (!data) return <Shimmer style={{ width: `32px`, height: `32px`, borderRadius: `999px` }} />

  return (
    <figure className={styles.pfp} title={data.name || addr}>
      <img alt={data.name || `PFP`} src={data.profile_image} className="rounded" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
    </figure>
  )
}

/**
 * Native Dialog for Network Switching
 */
function DefaultNetwork({ currentNetwork, dialogRef }) {
  const { isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  const handleSwitchChain = (chain) => {
    if (isConnected) {
      switchChain({ chainId: chain.id })
    }
    localStorage.setItem(`${process.env.NEXT_PUBLIC_LOCALSTORAGE_PREFIX}active-chain`, chain.id)
    dialogRef.current?.close()
  }

  return (
    <dialog ref={dialogRef} className={styles.networkDialog}>
      <div className={styles.dialogInner}>
        <h2>Select Your Network</h2>
        <div className={styles.networksGrid}>
          {config.chains.map((chain) => (
            <button key={chain.id} onClick={() => handleSwitchChain(chain)} data-current={chain.id === currentNetwork}>
              <div className="rounded" dangerouslySetInnerHTML={{ __html: chain.icon }} />
              <span>{chain.name}</span>
            </button>
          ))}
        </div>
        <button className={styles.closeBtn} onClick={() => dialogRef.current?.close()}>
          ✕
        </button>
      </div>
    </dialog>
  )
}

/**
 * Modal for Selecting Wallet Connector
 */
export function WalletConnectModal({ setShowModal }) {
  return (
    <div className={styles.walletConnectOverlay} onClick={() => setShowModal(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Select Wallet</h3>
        <div className="flex flex-column gap-050 w-full">
          <WalletOptions onSuccess={() => setShowModal(false)} />
        </div>
        <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
          ✕
        </button>
      </div>
    </div>
  )
}

/**
 * Handles the SIWE login and automatic dashboard redirection
 */
export function WalletOptions({ onSuccess }) {
  const { connectors, connectAsync } = useConnect()
  const { signMessageAsync } = useSignMessage()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (connector) => {
    try {
      setLoading(true)
      const { accounts } = await connectAsync({ connector })
      const address = accounts[0]

      // 1. Get SIWE Nonce
      const nonceRes = await fetch('/api/v1/merchants/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address }),
      })
      const { nonce } = await nonceRes.json()

      // 2. Sign SIWE Message
      const message = `Sign this message to verify ownership of this wallet for ${process.env.NEXT_PUBLIC_NAME} Merchant Portal.\nNonce: ${nonce}`
      const signature = await signMessageAsync({ message })

      // 3. Verify on Server
      const verifyRes = await fetch('/api/v1/merchants/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, nonce }),
      })

      if (verifyRes.ok) {
        onSuccess?.()
        // Redirect to merchant area
        router.push('/merchant')
      }
    } catch (err) {
      console.error('Auth flow failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return connectors.map((connector) => (
    <button className={styles.wallet} key={connector.uid} onClick={() => handleLogin(connector)} disabled={loading}>
      {connector.name}
      {loading && <span className={styles.loader} />}
    </button>
  ))
}

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
    <path d="M224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h510.76q27.62 0 46.12 18.5Q800-763 800-735.38V-680H544.62q-47.93 0-76.27 28.35Q440-623.31 440-575.38v190.76q0 47.93 28.35 76.27Q496.69-280 544.62-280H800v55.38q0 27.62-18.5 46.12Q763-160 735.38-160H224.62Z" />
  </svg>
)

const DisconnectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-56-58 102-102H360v-80h326L584-622l56-58 200 200-200 200Z" />
  </svg>
)
