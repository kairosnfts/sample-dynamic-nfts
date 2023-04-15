'use client'

import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Link from 'next/link'
import { MouseEventHandler, useContext } from 'react'
import { KairosContext } from '@/context/KairosContext'

export default function Home() {
  const { isLoggedIn } = useContext(KairosContext)

  const onLogInClick = async () => {
    await window.Kairos.logIn()
  }

  return (
    <main>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/images/bonsai.png"
          alt="Bonsai tree"
          width={512}
          height={512}
          priority
        />
      </div>

      <div className={styles.buttonCont}>
        {!isLoggedIn && (
          <Link href="/" className="button" onClick={onLogInClick}>
            Log in
          </Link>
        )}
        {isLoggedIn && (
          <Link href="/care" className="button">
            Tend to Your Bonsai
          </Link>
        )}

        <Link href="/plant" className="button alt">
          Purchase Seed
        </Link>
      </div>
    </main>
  )
}
