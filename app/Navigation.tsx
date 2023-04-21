'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()
  const showBack = pathname !== '/'

  return (
    <nav className={styles.nav}>
      <div className={styles.navItem}>
        {showBack && (
          <Link href="/" className="noStyle">
            ↩ Back
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
