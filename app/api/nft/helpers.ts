import { request, gql } from 'graphql-request'
import { TreeStage, treeStages } from './data'

export const auth = `Basic ${Buffer.from(
  process.env.KAIROS_API_KEY! // Keep this secret from the client!
).toString('base64')}`

export const getNftsOfUser = async (sessionToken: string) => {
  const data: Ownerships = await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    OwnershipsQuery,
    {
      collectionId: process.env.KAIROS_COLLECTION_ID,
      sessionToken: sessionToken,
    },
    {
      Authorization: auth,
    }
  )

  if (!data.collectorOwnershipsByCollection) {
    throw new Error('No NFTs found')
  }

  return data.collectorOwnershipsByCollection
}

export const getNextStage = (nft: Nft) => {
  const currentStage = nft.metadataPatch?.attributes?.find(
    (d) => d.trait_type === 'Bonsai Stage'
  )?.value
  // Find the matching property in TreeStage enum based on the current stage string
  const currentStageEnum = Object.values(TreeStage).find(
    (value) => value === currentStage
  )
  if (!currentStageEnum) {
    throw new Error('Current stage could not be determined')
  }

  // Find the next stage in treeStages based on currentStage string
  const index = treeStages.indexOf(currentStageEnum)
  let nextStage: TreeStage | undefined
  if (index !== -1 && index < treeStages.length - 1) {
    nextStage = treeStages[index + 1]
  }

  return nextStage
}

type UpdateNftProps = {
  nftId: string
  image: string
  stage: TreeStage
  description: string
}

export const updateNft = async ({
  nftId,
  image,
  stage,
  description,
}: UpdateNftProps) => {
  const date = new Date()
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const niceDate = `${month}/${day}/${year} ${hour}:${minute}:${second}`

  return await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    UpdateMetadataQuery,
    {
      input: {
        nftId: nftId,
        /**
         * Metadata patch is a JSON object that will be merged with the existing
         * metadata. You can use this to update the metadata of an NFT without
         * having to redeploy it. This is useful for updating the image of an
         * NFT, or adding new attributes
         */
        metadataPatch: {
          image: image,
          attributes: [
            // You can add as many attributes as you want
            {
              trait_type: 'Bonsai Stage',
              value: stage,
            },
            {
              trait_type: 'Description',
              value: description,
            },
            {
              trait_type: 'Last Cultivated On',
              value: niceDate,
            },
          ],
        },
      },
    },
    {
      Authorization: auth,
    }
  )
}

/**
 * We use GraphQL queries to interact with the Kairos API
 * You can learn more about GraphQL language here: https://graphql.org/learn/
 */
export const UpdateMetadataQuery = gql`
  mutation UpdateDynamicMetadata($input: UpdateDynamicMetadataInput!) {
    updateDynamicMetadata(input: $input)
  }
`

export const CreateNftQuery = gql`
  mutation CreateOneOfOneNft($input: CreateOneOfOneNftInput!) {
    createOneOfOneNft(input: $input) {
      ... on CreateNftRes {
        nft {
          id
        }
      }
      ... on CreateOneOfOneNftError {
        message
      }
      __typename
    }
  }
`
export const DeployNftQuery = gql`
  mutation DeployNft($input: DeployNftInput!) {
    deployNft(input: $input) {
      __typename
    }
  }
`

export const OwnershipsQuery = gql`
  query CollectorOwnershipsByCollection(
    $collectionId: UUID!
    $sessionToken: String!
  ) {
    collectorOwnershipsByCollection(
      collectionId: $collectionId
      sessionToken: $sessionToken
    ) {
      id
      nft {
        name
        id
        __typename
        metadataPatch {
          image
          attributes {
            trait_type
            value
          }
          description
        }
      }
      __typename
    }
  }
`

export type Nft = {
  name: string
  id: string
  __typename: string
  metadataPatch: {
    image: string
    attributes: {
      trait_type: string
      value: string
    }[]
    description: string
  }
}

export type Ownerships = {
  collectorOwnershipsByCollection: {
    id: string
    nft: Nft
    __typename: string
  }[]
}
