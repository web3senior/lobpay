'use client'

/**
 * @file components/Map.jsx
 * @description Integrated Map with X402 payment protocol support tags.
 */

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './Map.module.scss'
import L from 'leaflet'
import { Loader2 } from 'lucide-react'

/* Helper to ensure the map container resizes when the layout shifts */
const MapResizeObserver = () => {
  const map = useMap()
  useEffect(() => {
    if (!map) return
    const observer = new ResizeObserver(() => {
      setTimeout(() => {
        try { if (map && map.getContainer()) map.invalidateSize() } catch (e) {}
      }, 200)
    })
    const container = map.getContainer()
    if (container) observer.observe(container)
    return () => observer.disconnect()
  }, [map])
  return null
}

const customIcon = new L.Icon({
  iconUrl: '/marker.png',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -45],
})

const MerchantMap = () => {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const defaultPosition = [40.7552, -73.9011]

  useEffect(() => {
    setIsClient(true)
    const fetchMapData = async () => {
      try {
        const res = await fetch('/api/v1/public/rankings?limit=50')
        const result = await res.json()
        
        if (result.success && Array.isArray(result.data)) {
          /* Validate coordinates to prevent Leaflet render errors */
          const validCoords = result.data.filter(m => m.latitude && m.longitude)
          setMerchants(validCoords)
        }
      } catch (err) {
        console.error('[SYSTEM_ERROR]: Map synchronization failed.')
      } finally {
        setLoading(false)
      }
    }
    fetchMapData()
  }, [])

  if (!isClient) return null

  return (
    <div className={styles.page}>
      <main className={styles.page__mapContainer}>
        {loading && (
          <div className={styles.page__loader}>
            <Loader2 className="animate-spin" size={32} />
            <span>SYNCING_GEO_LEDGER...</span>
          </div>
        )}

        <MapContainer 
          center={defaultPosition} 
          zoom={10} 
          scrollWheelZoom={false} 
          className={styles.page__leaflet}
        >
          <MapResizeObserver />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {merchants.map((m) => (
            <Marker 
              key={m.id} 
              position={[parseFloat(m.latitude), parseFloat(m.longitude)]} 
              icon={customIcon}
            >
              <Popup>
                <div className={styles.merchantPopup}>
                  <div className={styles.merchantPopup__header}>
                    <strong className={styles.merchantPopup__name}>{m.business_name}</strong>
                    {/* RESTORED: X402 Support Tag */}
                    <span className={styles.x402Tag}>X402_ENABLED</span>
                  </div>
                  
                  <span className={styles.merchantPopup__type}>{m.business_type || 'AGENT_UNIT'}</span>
                  
                  <div className={styles.merchantPopup__stats}>
                    <small>REP: {Number(m.avg_rating || 0).toFixed(1)}</small>
                    <small>TX: {m.total_tx || 0}</small>
                  </div>
                  
                  <a target='_blank' href={`/merchants/${m.id}`} className={styles.popupLink}>
                    ACCESS_PROFILE
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  )
}

export default MerchantMap