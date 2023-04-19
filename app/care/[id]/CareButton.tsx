'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Nft } from '../../api/nft/helpers'

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
  const { id } = useParams()
  const { data } = useSWR('/api/nft', fetchNft)
  const bonsai = data && data.find((nft: Nft) => nft.id === id)

  const { trigger, isMutating } = useSWRMutation('/api/nft', updateMetadata)

  const handleClick = () => {
    trigger({ nftId: bonsai?.id })
  }

  return (
    <button className="button" onClick={handleClick} disabled={isMutating}>
      Cultivate
    </button>
  )
}
