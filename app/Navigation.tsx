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
            <Image
              src="/images/back-arrow.svg"
              alt=""
              width="10"
              height="10"
              priority
            />{' '}
            Back
          </Link>
        )}
      </div>

      <div className={styles.centerNavItem}>
        {currentUser && (
          <Link
            href="/"
            className={`${styles.logoutButton} noStyle`}
            onClick={handleLogOut}
            title="Click to logout"
          >
            <span>{getEmailAbbr(currentUser?.email)}</span>
            <code>{getPubkeyAbbr(currentUser?.wallet.pubkey)}</code>
          </Link>
        )}
      </div>

      <div className={styles.navItem}>
        <Link
          href="https://kairos.art"
          className={`${styles.poweredBy} noStyle`}
          target="_blank"
        >
          <span>Powered by</span>
          <Image
            src="/images/kairosLogo.svg"
            alt="Kairos Logo"
            width={100}
            height={17}
            priority
          />
        </Link>
      </div>
    </nav>
  )
}
