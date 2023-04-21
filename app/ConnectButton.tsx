'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { KairosContext } from '@kairosnfts/dapp/dist/react'
import styles from './ConnectButton.module.css'
import { Kairos } from '@kairosnfts/dapp'

export default function Home() {
  const { isLoggedIn, isLoginLoading } = useContext(KairosContext)

  const onLogInClick = async () => {
    await Kairos.logIn()
  }

  if (isLoginLoading) return <div className={styles.loading}>Loading...</div>

  return isLoggedIn ? (
    <Link href="/shelf" className="button">
      Nurture
    </Link>
  ) : (
    <Link href="/" className="button" onClick={onLogInClick}>
      Connect
    </Link>
  )
}
