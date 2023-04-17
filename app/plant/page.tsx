import Image from 'next/image'
import BuyButton from './BuyButton'

export default function Plant() {
  return (
    <main>
      <div className="center">
        <Image
          src="/images/seed-packet.png"
          alt="Packet of seeds"
          width={512}
          height={512}
          priority
        />
      </div>

      <BuyButton />
    </main>
  )
}
