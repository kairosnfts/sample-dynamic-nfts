import Image from 'next/image'
import Link from 'next/link'
import CareButton from './CareButton'

export default function Care() {
  return (
    <main>
      <div className="center">
        {/* TODO: Replace with NFT uri */}
        <Image
          src="/images/mature.png"
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
