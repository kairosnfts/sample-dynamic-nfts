'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { KairosContext } from '@/context/KairosContext'

export default function Home() {
  const { isLoggedIn } = useContext(KairosContext)

  const onLogInClick = async () => {
    await window.Kairos.logIn()
  }

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
