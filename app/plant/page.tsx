import Image from 'next/image'
import BuyButton from './BuyButton'
import styles from './page.module.css'
import Link from 'next/link'

export default function Plant() {
  return (
    <main>
      <div className="center">
        <Image
          src="/images/seeds.png"
          alt="Packet of seeds"
          priority
          fill
          object-fit="contain"
          className="featured"
        />
      </div>

      <div className={styles.helperCont}>
        <p>
          In this demo, you can purchase with the credit card number{' '}
          <code>4242 4242 4242 4242</code> (along with any other valid details),
          or with Mumbai MATIC. Mumbai MATIC is a free test coin that has no
          real value;{' '}
          <Link href="https://faucet.polygon.technology/" target="_blank">
            airdrop some into your wallet
          </Link>
          .
        </p>
      </div>

      <BuyButton />
    </main>
  )
}
