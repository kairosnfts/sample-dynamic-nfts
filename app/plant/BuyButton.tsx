'use client'

import useSWRMutation from 'swr/mutation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Kairos } from '@kairosnfts/dapp'

const fetchNftId = async () => {
  return await fetch('/api/nft', {
    method: 'POST',
  }).then((res) => res.json())
}

export default function BuyButton() {
  const router = useRouter()
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
     * This will open the purchase modal for the user to complete the purchase
     */
    await Kairos.startBid(result.nftId)
    /**
     * At this point the user completed the purchase and the NFT is minted on
     * the blockchain. The status of the NFT bid is returned and can be used
     * to determine next steps for your application.
     * Note: After a successful purchase, the user will be logged in to Kairos
     */

    setIsLoading(false)

    setTimeout(() => {
      Kairos.close() // Close the Kairos modal or it will stay open after redirect
      router.push('/shelf')
    }, 1000) // Show confirmation box for a second before redirecting
  }

  return (
    <button onClick={handleClick} disabled={isMutating || isLoading}>
      Buy and Plant
    </button>
  )
}
