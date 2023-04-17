import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Plant() {
  return (
    <main>
      <header>
        <Link href="/">↩ Back</Link>
      </header>

      <div className={styles.center}>
        <Image
          src="/images/seed-packet.png"
          alt="Packet of seeds"
          width={512}
          height={512}
          priority
        />
      </div>

      <div className={styles.grid}>
        <Link href="" className="button">
          Buy and Plant
        </Link>
      </div>
    </main>
  )
}
