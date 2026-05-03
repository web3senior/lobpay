'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { MessageSquareMore, Radio, Settings, Users } from 'lucide-react'

import ClientLayout from '@/components/ClientLayout'
import clsx from 'clsx'
import WagmiContext from '@/contexts/WagmiContext'
import { ConnectWallet } from '@/components/ConnectWallet'
import Reputation from '@/components/Reputation'
import MapComponent from '@/components/Map'
import TradeStream from '@/components/TradeStream'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import AgentFeedback from '@/components/AgentFeedback'
import Steps from '@/components/Steps'
import WhyUs from '@/components/WhyUs'
import Join from '@/components/Join'
import MerchantLedger from '@/components/MerchantCarousel'
import MerchantCarousel from '@/components/MerchantCarousel'

export default function Page({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')

  useEffect(() => {
    // Hide splash screen once the app is mounted
    // A 1000ms-2000ms delay is common to avoid "flicker"
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${styles.page}`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Hero />
      <Steps />
      <div className={clsx(styles.page__container, `__container`)} data-width={`xxlarge`}>
        <section className={`${styles.page__heading} flex flex-column align-items-center pt-50`}>
          <h1>See It In Action</h1>
          <p>Real-time visibility into every AI-powered transaction.</p>
        </section>

        <div className={`${styles.page__grid} flex flex-wrap gap-1`} style={{ '--data-width': `500px` }}>
          <div className="flex-1">
            <MapComponent />
          </div>
          <div className="flex-1">
            <TradeStream />
          </div>

          <div className={`flex-1 grid grid--fit gap-1`} style={{ '--data-width': `350px` }}>
            <div className="flex-1 flex flex-column">
              <Reputation />
            </div>
            <div className="flex-1 flex flex-column">
              <AgentFeedback />
            </div>
          </div>
        </div>

        <MerchantCarousel />

        <WhyUs />
        <Join />
        <footer></footer>
      </div>
      {/* {activeTab === 'chat' && <Chat />}
      {activeTab === 'communities' && <NoData name={`Communities`} />}
      {activeTab === 'channels' && <NoData name={`Channels`} />}
      {activeTab === 'settings' && <NoData name={`Settings`} />} */}
    </div>
  )
}
