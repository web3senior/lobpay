'use client'

/**
 * @file app/(merchant)/merchant/page.jsx
 * @description Full Merchant Dashboard with restored metrics and Revenue Liquidation.
 */

import React, { useEffect, useState } from 'react'
import styles from './Page.module.scss'
import swapperStyles from './RevenueSwapper.module.scss'
import Shimmer from '@/components/ui/Shimmer'
import { useUniswapSwap } from '@/hooks/useUniswapSwap'
import { parseUnits } from 'viem'

/**
 * Top 10 liquidation targets for the Imperial Marketplace.
 */
const TOP_TOKENS = [
  { symbol: 'ETH', address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
  { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
  { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
  { symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' },
  { symbol: 'ARB', address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1' },
  { symbol: 'OP', address: '0x4200000000000000000000000000000000000042' },
  { symbol: 'PEPE', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' },
  { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
  { symbol: 'SOL', address: '0xD31695Ad3C458D36517922C2198169b122A6737D' },
]

// const TOP_TOKENS = [
//  {symbol:"ETH test", address:"0x66a9893cc07d91d95644aedd05d03f95e1dba8af"},
//   {symbol:"OP Mainnet test", address:"0x851116d9223fabed8e56c0e6b8ad0c31d98b3507"},
//  {symbol:"BNB Smart Chain test", address:"0x1906c1d672b88cd1b9ac7593301ca990f94eae07"},
//  {symbol:"Unichain test", address:"0xef740bf23acae26f6492b10de645d6b98dc8eaf3"},
//  {symbol:"Polygon test", address:"0x1095692a6237d83c6a72f3f5efedb9a670c49223"},
//  {symbol:"Monad test", address:"0x0d97dc33264bfc1c226207428a79b26757fb9dc3"},
//  {symbol:"X Layer test", address:"0x5507749f2c558bb3e162c6e90c314c092e7372ff"},
//  {symbol:"zkSync test", address:"0x28731BCC616B5f51dD52CF2e4dF0E78dD1136C06"},
//  {symbol:"World Chain test", address:"0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743"},
//  {symbol:"Soneium test", address:"0x0e2850543f69f678257266e0907ff9a58b3f13de"},
//  {symbol:"Base test", address:"0x6ff5693b99212da76ad316178a184ab56d299b43"},
//  {symbol:"Arbitrum test", address:"0xa51afafe0263b40edaef0df8781ea9aa03e381a3"},
//  {symbol:"Celo test", address:"0xcb695bc5D3Aa22cAD1E6DF07801b061a05A0233A"},
//  {symbol:"Avalanche test", address:"0x94b75331ae8d42c1b61065089b7d48fe14aa73b7"},
// 	{symbol:"Linea test", address:"0x661e93cca42afacb172121ef892830ca3b70f08d"},
// ]

const USDC_MAINNET = `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` //mainnet: ''

export const RevenueSwapper = ({ revenue }) => {
  const { handleSwap } = useUniswapSwap()
  const [loading, setLoading] = useState(false)
  const [selectedToken, setSelectedToken] = useState(TOP_TOKENS[0])

  const executeLiquidation = async () => {
    if (!revenue || revenue <= 0) return alert('No revenue available to swap.')
    setLoading(true)
    try {
      const rawAmount = parseUnits(revenue.toString(), 6).toString()
      await handleSwap(USDC_MAINNET, selectedToken.address, rawAmount, 1)
      alert(`Liquidation successful: Revenue moved to ${selectedToken.symbol}`)
    } catch (err) {
      console.error('Liquidation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={swapperStyles.swapperContainer}>
      <div className={swapperStyles.flexWrapper}>
        <div className={swapperStyles.titleStack}>
          <h3 className={swapperStyles.label}>Revenue Liquidation</h3>
          <small className={swapperStyles.revenueAmount}>Available: ${revenue || '0.00'} USDC</small>
        </div>
        <div className={swapperStyles.actionGroup}>
          <select 
            className={swapperStyles.select}
            value={selectedToken.symbol}
            onChange={(e) => setSelectedToken(TOP_TOKENS.find(t => t.symbol === e.target.value))}
          >
            {TOP_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>Swap to {t.symbol}</option>)}
          </select>
          <button onClick={executeLiquidation} disabled={loading || !revenue} className={swapperStyles.liquidateButton}>
            {loading ? 'PROCESSING...' : 'LIQUIDATE'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MerchantDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  // Restored all metrics from your original configuration
  const statsConfig = [
    { 
      label: 'Total Revenue', 
      value: `$ ${data?.revenue || 0} USDC`, 
      color: '#00ffcc' 
    },
    { label: 'Total Sales', value: data?.salesCount || 0, color: '#ec4848' },
    { label: 'Businesses', value: data?.businessCount || 0, color: '#ec4848' },
    { label: 'Active Products', value: data?.products || 0, color: '#ec4848' },
    { label: 'Avg Rating', value: `${data?.rating || 0} / 5`, color: '#ec4848' },
  ]

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Real-time performance across your merchant nodes.</p>
      </header>

      <RevenueSwapper revenue={data?.revenue} />

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
      </section>
    </div>
  )
}