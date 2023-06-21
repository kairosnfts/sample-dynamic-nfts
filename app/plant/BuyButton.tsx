'use client'

import useSWRMutation from 'swr/mutation'
import { useState } from 'react'
import { Kairos } from '@kairosnfts/dapp'

const fetchNftId = async () => {
  return await fetch('/api/nft', {
    method: 'POST',
  }).then((res) => res.json())
}

export default function BuyButton() {
  const { trigger, isMutating } = useSWRMutation('/api/nft', fetchNftId)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    const result = await trigger()
    if (!result) {
      setIsLoading(false)
      return
    }

    /**
     * STEP 3 - Initiate NFT purchase using the NFT ID from Kairos
     * This will open the purchase route on the same tab
     * after purchase completed, the user will be redirected to the route configured trough
     * the Kairos dashboard.
     */
    Kairos.startBid(result.nftId)
  }

  return (
    <button onClick={handleClick} disabled={isMutating || isLoading}>
      Buy and Plant
    </button>
  )
}
