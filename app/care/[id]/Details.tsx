'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Image from 'next/image'
import styles from './Details.module.css'
import { Nft } from '../../api/nft/helpers'
import Link from 'next/link'

const fetchNft = async () => {
  return await fetch('/api/nft', {
    method: 'GET',
  }).then((res) => res.json())
}

const updateMetadata = async (
  url: string,
  { arg }: { arg: { nftId: string; reset: boolean } }
) => {
  return await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

export default function Details() {
  const { id } = useParams()
  const { data, isLoading } = useSWR('/api/nft', fetchNft)
  const bonsai = data && data.find((nft: Nft) => nft.id === id)
  const { attributes } = (bonsai?.metadataPatch as Nft['metadataPatch']) || {}

  const { trigger, isMutating } = useSWRMutation('/api/nft', updateMetadata)

  const handleClick = () => {
    trigger({ nftId: bonsai?.id, reset: true })
  }

  const getOpenSeaUrl = () => {
    const baseUrl = 'https://testnets.opensea.io'
    const network = 'mumbai'
    const collectionPubkey = process.env.NEXT_PUBLIC_KAIROS_COLLECTION_PUBKEY
    const mintPubkey = bonsai.mintPubkey

    const url = new URL(
      `assets/${network}/${collectionPubkey}/${mintPubkey}`,
      baseUrl
    )

    return url.href
  }

  const ResetButton = () => (
    <div>
      <button className="button" onClick={handleClick} disabled={isMutating}>
        Reset
      </button>
    </div>
  )

  const ExplorerButton = () => (
    <div>
      <Link href={getOpenSeaUrl()} target="_blank">
        Open on chain explorer
      </Link>
    </div>
  )

  if (!bonsai || isLoading) return null
  // Something went wrong, show a reset button
  if (!bonsai.metadataPatch?.image) return <ResetButton />

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.bonsai}>
        <div>
          <Image
            src={bonsai?.metadataPatch?.image}
            alt="Your bonsai tree"
            width={512}
            height={512}
            priority
            // className="featured"
          />
        </div>
      </div>
      <div className={styles.details}>
        {attributes?.map((attribute) => (
          <div key={attribute.trait_type} className={styles.attribute}>
            <h3>{attribute.trait_type}</h3>
            {attribute.value}
          </div>
        ))}
        <ExplorerButton />
        {/* Show a reset option when we've reached the final stage */}
        {attributes?.find(
          (attribute) =>
            attribute.trait_type === 'Bonsai Stage' &&
            attribute.value === 'Mature'
        ) && <ResetButton />}
      </div>
    </div>
  )
}
