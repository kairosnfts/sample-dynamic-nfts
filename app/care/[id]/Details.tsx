'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Image from 'next/image'
import styles from './Details.module.css'
import { Nft } from '../../api/nft/helpers'

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

  const ResetButton = () => (
    <div>
      <button className="button" onClick={handleClick} disabled={isMutating}>
        Reset
      </button>
    </div>
  )

  if (!bonsai || isLoading) return null
  // Something went wrong, show a reset button
  if (!bonsai.metadataPatch?.image) return <ResetButton />

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.bonsai}>
        <Image
          src={bonsai?.metadataPatch?.image}
          alt="Your bonsai tree"
          width={512}
          height={512}
          priority
          className="featured"
        />
      </div>
      <div className={styles.details}>
        {attributes?.map((attribute) => (
          <div key={attribute.trait_type} className={styles.attribute}>
            <h3>{attribute.trait_type}</h3>
            <p>{attribute.value}</p>
          </div>
        ))}
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
