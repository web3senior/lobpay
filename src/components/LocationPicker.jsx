'use client'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function LocationPicker({ lat, lng, onChange }) {
  const position = lat && lng ? [parseFloat(lat), parseFloat(lng)] : [40.7128, -74.006]

  function MapEvents() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat.toFixed(8), e.latlng.lng.toFixed(8))
      },
    })
    return null
  }

  return (
    <MapContainer center={position} zoom={13} style={{ height: '200px', width: '100%', borderRadius: '12px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      {lat && lng && <Marker position={position} icon={icon} />}
    </MapContainer>
  )
}
