'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { KairosContext } from '@/context/KairosContext'
import styles from './ConnectButton.module.css'

export default function Home() {
  const { isLoggedIn, isLoginLoading } = useContext(KairosContext)

  const onLogInClick = async () => {
    await window.Kairos.logIn()
  }

  if (isLoginLoading) return <div className={styles.loading}>Loading...</div>

  return isLoggedIn ? (
    <Link href="/care" className="button">
      Nurture
    </Link>
  ) : (
    <Link href="/" className="button" onClick={onLogInClick}>
      Connect
    </Link>
  )
}
