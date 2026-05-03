'use client'

/**
 * @file app/merchant/transactions/page.jsx
 * @description Transaction ledger with real-time delivery status updates.
 */

import { useState, useEffect } from 'react'
import styles from './Transactions.module.scss'
import { MapPin, Package, Phone, ExternalLink, Tag, AlertCircle, Loader2 } from 'lucide-react'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null) // Track which row is saving

  useEffect(() => {
    fetchLedger()
  }, [])

  const fetchLedger = async () => {
    try {
      const res = await fetch('/api/v1/merchants/transactions')
      const data = await res.json()
      if (data.success) setTransactions(data.transactions)
      else setError(data.error)
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Updates the delivery_status in the DB and UI
   */
  const handleStatusChange = async (txId, newStatus) => {
    setUpdatingId(txId)
    try {
      const res = await fetch(`/api/v1/merchants/transactions/${txId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        // Update local state so UI reflects change immediately
        setTransactions((prev) => prev.map((tx) => (tx.id === txId ? { ...tx, delivery_status: newStatus } : tx)))
      } else {
        alert('Update failed: ' + data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <div className={styles.loading}>Accessing ledger...</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Orders & Deliveries</h1>
        <p>Monitor X402 payment routing and order fulfillment.</p>
      </header>

      <div className={styles.tableWrapper}>
        {transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={40} />
            <p>No transactions found.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Items (Manifest)</th>
                <th>Delivery Address</th>
                <th>Amount</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <div className={styles.orderMain}>
                      <strong>{tx.business_name}</strong>
                      <div className={styles.hashLink}>
                        <code>{tx.transaction_hash?.slice(0, 10)}...</code>
                        <a href={`https://sepolia.basescan.org/tx/${tx.transaction_hash}`} target="_blank" rel="noreferrer">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.itemsList}>
                      {tx.items && tx.items[0].product_name !== null ? (
                        tx.items.map((item, i) => (
                          <div key={i} className={styles.itemRow}>
                            <Package size={12} />
                            <span>
                              {item.quantity}x {item.product_name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className={styles.noItems}>No items found</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {tx.delivery_address ? (
                      <div className={styles.deliveryCell}>
                        <p>
                          <MapPin size={12} /> {tx.delivery_address}
                        </p>
                        {tx.customer_phone && (
                          <small>
                            <Phone size={10} /> {tx.customer_phone}
                          </small>
                        )}
                      </div>
                    ) : (
                      <span className={styles.digitalTag}>
                        <Tag size={12} /> Service Node
                      </span>
                    )}
                  </td>
                  <td className={styles.amountText}>
                    <strong>{parseFloat(tx.amount).toFixed(2)}</strong> <span>USDC</span>
                  </td>
                  <td>
                    <div className={styles.statusPicker}>
                      {updatingId === tx.id ? (
                        <Loader2 className={styles.spinner} size={16} />
                      ) : (
                        <select value={tx.delivery_status || 'preparing'} className={`${styles.statusSelect} ${styles[tx.delivery_status || 'preparing']}`} onChange={(e) => handleStatusChange(tx.id, e.target.value)}>
                          <option value="preparing">Preparing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="picked_up">Picked Up</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
