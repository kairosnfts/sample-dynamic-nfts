'use client'

import { useParams } from 'next/navigation'
import useSWRMutation from 'swr/mutation'

const updateMetadata = async (
  url: string,
  { arg }: { arg: { reset?: boolean } }
) => {
  return await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

export default function CareButton() {
  const { id } = useParams()
  const { trigger, isMutating } = useSWRMutation(
    '/api/nft/' + id,
    updateMetadata
  )

  const handleClick = () => {
    trigger({})
  }

  if (!id) return null

  return (
    <button className="button" onClick={handleClick} disabled={isMutating}>
      Cultivate
    </button>
  )
}
