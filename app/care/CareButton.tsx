'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

const fetchNft = async () => {
  return await fetch('/api/nft', {
    method: 'GET',
  }).then((res) => res.json())
}

const updateMetadata = async (
  url: string,
  { arg }: { arg: { nftId: string } }
) => {
  return await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

export default function CareButton() {
  const { data } = useSWR('/api/nft', fetchNft)
  // TODO: Handle multiple NFTs
  const nftId = data && data[0].id

  const { trigger, isMutating } = useSWRMutation('/api/nft', updateMetadata)

  const handleClick = () => {
    trigger({ nftId })
  }

  return (
    <button className="button" onClick={handleClick} disabled={isMutating}>
      Cultivate
    </button>
  )
}
