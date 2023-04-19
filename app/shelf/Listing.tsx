'use client'

import useSWR from 'swr'
import Image from 'next/image'
import styles from './Listing.module.css'
import { Nft } from '../api/nft/helpers'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const fetchNft = async () => {
  return await fetch('/api/nft', {
    method: 'GET',
  }).then((res) => res.json())
}

export default function Listing() {
  const router = useRouter()
  const { data } = useSWR('/api/nft', fetchNft)

  if (data?.length === 1) {
    // If just a single bonsai, redirect to the care page
    router.push(`/care/${data[0].id}`)
  }

  if (!data) return null

  return (
    <div className={styles.shelfContainer}>
      <h1 className="pageTitle">Your Bonsai</h1>
      <div className={styles.shelf}>
        {data.map((bonsai: Nft) => (
          <Link
            key={bonsai.id}
            className={styles.bonsai}
            href={`/care/${bonsai.id}`}
          >
            <Image
              src={bonsai?.metadataPatch?.image}
              alt="Your bonsai tree"
              width={512}
              height={512}
              priority
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
