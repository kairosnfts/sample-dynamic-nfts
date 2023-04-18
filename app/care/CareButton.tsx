'use client'

import useSWRMutation from 'swr/mutation'

const updateMetadata = async ({
  nftId,
  description,
  uri,
}: {
  nftId: string
  description: string
  uri: string
}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nft`, {
    method: 'PATCH',
    body: JSON.stringify({
      nftId,
      description,
      uri,
    }),
  }).then((res) => res.json())
}

export default function CareButton() {
  const { trigger, isMutating } = useSWRMutation(
    {
      nftId: 'nftId',
      uri: 'uri',
      description: 'description',
    },
    updateMetadata
  )

  const handleClick = () => {
    trigger()
  }

  return (
    <button className="button" onClick={handleClick}>
      Water
    </button>
  )
}
