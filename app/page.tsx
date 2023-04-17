import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import ConnectButton from './ConnectButton'

export default function Home() {
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
        <ConnectButton />

        <Link href="/plant" className="button alt">
          Purchase Seed
        </Link>
      </div>
    </main>
  )
}
