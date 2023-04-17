'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import styles from './Navigation.module.css'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const showBack = pathname !== '/'

  return (
    <nav className={styles.nav}>
      <div className={styles.navItem}>
        {showBack && (
          <button onClick={() => router.back()} className="noStyle">
            ↩ Back
          </button>
        )}
      </div>

      <div className={styles.navItem}>
        <Link
          href="https://kairos.art"
          className={styles.poweredBy}
          target="_blank"
        >
          Powered by
          <Image
            src="/images/kairosLogo.svg"
            alt="Kairos Logo"
            width={144}
            height={24}
          />
        </Link>
      </div>
    </nav>
  )
}
