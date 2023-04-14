import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Care() {
  return (
    <main>
      <header>
        <Link href="/">{`↩ Back`}</Link>
      </header>

      <div className={styles.center}>
        {/* TODO: Replace with NFT uri */}
        <Image
          src="/images/dirt-mound.png"
          alt="Your bonsai tree"
          width={512}
          height={512}
          priority
        />
      </div>

      <div className={styles.grid}>
        <Link href="" className="button">
          Water Your Bonsai
        </Link>
      </div>
    </main>
  )
}
