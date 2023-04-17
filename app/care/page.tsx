import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import CareButton from './CareButton'

export default function Care() {
  return (
    <main>
      <header>
        <Link href="/">↩ Back</Link>
      </header>

      <div className={styles.center}>
        {/* TODO: Replace with NFT uri */}
        <Image
          src="/images/seedling.png"
          alt="Your bonsai tree"
          width={512}
          height={512}
          priority
        />
      </div>

      <CareButton />
    </main>
  )
}
