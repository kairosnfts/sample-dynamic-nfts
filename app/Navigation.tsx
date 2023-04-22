'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import styles from './Navigation.module.css'
import { useContext } from 'react'
import { Kairos, KairosContext } from '@kairosnfts/dapp'

export const getPubkeyAbbr = (pubkey: string, isLong = false) => {
  if (!pubkey) return '??'
  if (pubkey.length < 10) return pubkey
  return (
    (isLong ? pubkey.slice(0, 8) : pubkey.slice(0, 4)) +
    ' ⋯ ' +
    (isLong ? pubkey.slice(-8) : pubkey.slice(-4))
  )
}

export const getEmailAbbr = (email: string) => {
  if (!email) return '??'
  const emailBeforeAt = email?.split('@')[0]
  const emailAfterAt = email?.split('@')[1]
  return emailBeforeAt.slice(0, 4) + ' ⋯ @' + emailAfterAt
}

export default function Navigation() {
  const pathname = usePathname()
  const showBack = pathname !== '/'
  const { currentUser } = useContext(KairosContext)

  const handleLogOut = async () => {
    await Kairos.logOut()
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navItem}>
        {showBack && (
          <Link href="/" className="noStyle">
            ↩ Back
          </Link>
        )}
      </div>

      <div className={styles.centerNavItem}>
        {currentUser && (
          <Link href="/" className={styles.logoutButton} onClick={handleLogOut}>
            <p>{getPubkeyAbbr(currentUser?.wallet.pubkey)}</p>
            <p>{getEmailAbbr(currentUser?.email)}</p>
          </Link>
        )}
      </div>

      <div className={styles.navItem}>
        <Link
          href="https://kairos.art"
          className={`${styles.poweredBy} noStyle`}
          target="_blank"
        >
          Powered by
          <Image
            src="/images/kairosLogo.svg"
            alt="Kairos Logo"
            width={100}
            height={17}
          />
        </Link>
      </div>
    </nav>
  )
}
