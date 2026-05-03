'use client'

/**
 * @file components/dashboard/Sidebar.jsx
 * @description Persistent navigation for the Merchant Portal with logout and Business profile links.
 */

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDisconnect } from 'wagmi'
import styles from './Sidebar.module.scss'
import clsx from 'clsx'
import { LayoutDashboard, Package, Layers, History, Settings, LogOut, Store } from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()
  const { disconnect } = useDisconnect()

  /**
   * Handles the logout process:
   * 1. Disconnects the wallet from the frontend.
   * 2. Clears the HttpOnly merchant_session cookie via the API.
   * 3. Redirects to the landing page.
   */
  const handleLogout = async () => {
    try {
      // Disconnect from Wagmi
      disconnect()

      // Clear server-side session using the refactored auth path
      await fetch('/api/v1/merchant/auth/logout', { method: 'POST' })

      // Refresh and redirect
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const navItems = [
    { label: 'Overview', href: '/merchant', icon: <LayoutDashboard size={20} /> },
    { label: 'My Business', href: '/merchant/profile', icon: <Store size={20} /> },
    { label: 'Products', href: '/merchant/products', icon: <Package size={20} /> },
    { label: 'Categories', href: '/merchant/categories', icon: <Layers size={20} /> },
    { label: 'Transactions', href: '/merchant/transactions', icon: <History size={20} /> },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__brand}>
        <div className={styles.sidebar__logo}>{process.env.NEXT_PUBLIC_NAME}</div>
        <span className={styles.sidebar__tag}>MERCHANT</span>
      </div>

      <nav className={styles.sidebar__nav}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={clsx(styles.navLink, pathname === item.href && styles['navLink--active'])}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.sidebar__footer}>
        <Link href="/merchant/settings" className={clsx(styles.navLink, pathname === '/merchant/settings' && styles['navLink--active'])}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
