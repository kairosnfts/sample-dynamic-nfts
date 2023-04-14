import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
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
        {/* TODO: if not logged in, show connect button */}
        <Link href="/care" className="button">
          Tend to Your Bonsai
        </Link>

        <Link href="/plant" className="button alt">
          Purchase Seed
        </Link>
      </div>
    </main>
  )
}
