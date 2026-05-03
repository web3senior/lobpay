/**
 * @file app/(merchant)/merchant/layout.jsx
 * @description The shared layout for the Merchant Dashboard.
 */

import Sidebar from '@/components/merchant/Sidebar'
import Header from '@/components/merchant/Header'
import styles from './Layout.module.scss'

export default function MerchantLayout({ children }) {
  return (
    <div className={styles.container}>
      {/* Sidebar handles navigation between Products, Categories, and Orders */}
      <Sidebar className={styles.sidebar} />

      <div className={styles.wrapper}>
        <Header className={styles.header} />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  )
}
