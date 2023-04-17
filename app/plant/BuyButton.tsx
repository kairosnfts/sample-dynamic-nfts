'use client'

import useSWRMutation from 'swr/mutation'

const fetchNftId = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create`, {
    method: 'POST',
  }).then((res) => res.json())
}

export default function BuyButton() {
  const { trigger, isMutating } = useSWRMutation('/api/create', fetchNftId)

  const handleClick = async () => {
    const result = await trigger()
    if (!result) return

    // STEP 3 - Initiate NFT purchase using the NFT ID from Kairos
    // This will open the purchase modal for the user to complete the purchase
    await window.Kairos.startBid(result.nftId)

    // At this point the user completed the purchase and the NFT is minted on the chain
    // After a successful purchase, if the user was not logged in, they will be
    // logged in automatically
  }

  return (
    <button onClick={handleClick} disabled={isMutating}>
      Buy and Plant
    </button>
  )
}
