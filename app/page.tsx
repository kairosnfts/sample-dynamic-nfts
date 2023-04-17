'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import { useContext } from 'react'
import { KairosContext } from '@/context/KairosContext'

export default function Home() {
  const { isLoggedIn } = useContext(KairosContext)

  const onLogInClick = async () => {
    await window.Kairos.logIn()
  }

  return (
    <main>
      <div className="center">
        <Image
          src="/images/mature.png"
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
