import styles from './Header.module.scss'
import clsx from 'clsx'
import { MessageSquareMore, Radio, Settings, Users } from 'lucide-react'
import WagmiContext from '@/contexts/WagmiContext'
import { ConnectWallet } from './ConnectWallet'

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className={clsx(styles.header, `flex flex-row align-items-center justify-content-between`)}>
      <ul className={clsx(styles['nav__list'], `flex flex-row align-items-center justify-content-between gap-1`)}>
        <li className={`flex align-items-center gap-050`}>
          <h3>{process.env.NEXT_PUBLIC_NAME}</h3>
          <small>BETA</small>
        </li>
        {/* <li title={`Communities`}>
          <button onClick={() => setActiveTab(`communities`)} className={clsx('rounded-full', styles['nav__item'], styles['nav__item--disabled'])}>
            <Users width={21} height={21} strokeWidth={1.75} />
          </button>
        </li>
        <li title={`Channels`}>
          <button onClick={() => setActiveTab(`channels`)} className={clsx('rounded-full', styles['nav__item'], styles['nav__item--disabled'])}>
            <Radio width={21} height={21} strokeWidth={1.75} />
          </button>
        </li> */}
      </ul>

      <ul className={clsx(styles['nav__list'], `flex flex-row gap-4`)}>
        {/* <li>
          <button onClick={() => setActiveTab(`settings`)} className={clsx('rounded-full', styles['nav__item'], activeTab === 'settings' && styles['nav__item--active'])}>
            <Settings width={21} height={21} strokeWidth={1.75} />
          </button>
        </li> */}
        <li>
          <WagmiContext>
            <ConnectWallet />
          </WagmiContext>
        </li>
      </ul>
    </header>
  )
}
