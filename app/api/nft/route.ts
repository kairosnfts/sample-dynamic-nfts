import { NextRequest, NextResponse } from 'next/server'
import { request, gql } from 'graphql-request'
import {
  NftName,
  NftDescription,
  NftPrice,
  TreeStage,
  StageDescription,
  StageImage,
} from './data'

const auth = `Basic ${Buffer.from(
  process.env.KAIROS_API_KEY! // Keep this secret from the client!
).toString('base64')}`

/**
 * This is the route will return all the NFTs and their metadata that the user owns
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const sessionToken = await req.cookies.get('__kairosSessionToken')?.value
  if (!sessionToken) {
    throw new Error('No session token found')
  }

  const data: any = await request(
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

  return NextResponse.json(
    data.collectorOwnershipsByCollection.map((d: any) => d.nft)
  )
}

/**
 * This is the route that will be called when you want to update an NFT's metadata
 * this will not redeploy the NFT, it will only update the content of the metadata
 * without having to make any transaction on the blockchain
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { nftId } = body

  const date = new Date()
  const niceDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}
  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

  // Get a random stage from TreeStage enum
  const randomStage =
    Object.values(TreeStage)[
      Math.floor(Math.random() * Object.values(TreeStage).length)
    ]

  await request(
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
          image: StageImage[randomStage],
          attributes: [
            // You can add as many attributes as you want
            {
              trait_type: 'Bonsai Stage',
              value: randomStage,
            },
            {
              trait_type: 'Description',
              value: StageDescription[randomStage],
            },
            {
              trait_type: 'Last Maintained',
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
  return NextResponse.json({ nftId })
}

/**
 * This is the route that will be called when the user clicks the "Create NFT" button
 * It will create an NFT on the Kairos server and deploy it (not mint yet)
 */
export async function POST(req: Request): Promise<NextResponse> {
  /**
   * STEP 1 - Create an NFT on the Kairos server
   */
  const createResponse: any = await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    CreateNftQuery,
    {
      input: {
        name: NftName,
        description: NftDescription,
        collectionId: process.env.KAIROS_COLLECTION_ID, // Keep this secret from the client!
        price: NftPrice, // The price of the NFT (on-chain native currency)
      },
    },
    {
      Authorization: auth,
    }
  )

  const createData = createResponse?.createOneOfOneNft
  if (createData.__typename !== 'CreateNftRes') {
    throw new Error(createData.message)
  }

  /**
   * STEP 2 - Deploy the NFT on the Kairos server.
   * Note: This will not mint the NFT on the chain yet. That happens in STEP 3.
   */
  await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    DeployNftQuery,
    {
      input: {
        nftId: createData.nft.id,
        isBlocking: true, // If true, the request will wait until the NFT is deployed
      },
    },
    {
      Authorization: auth,
    }
  )

  return NextResponse.json({ nftId: createData.nft.id })
}

/**
 * We use GraphQL queries to interact with the Kairos API
 * You can learn more about GraphQL language here: https://graphql.org/learn/
 */
const UpdateMetadataQuery = gql`
  mutation UpdateDynamicMetadata($input: UpdateDynamicMetadataInput!) {
    updateDynamicMetadata(input: $input)
  }
`

const CreateNftQuery = gql`
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
const DeployNftQuery = gql`
  mutation DeployNft($input: DeployNftInput!) {
    deployNft(input: $input) {
      __typename
    }
  }
`

const OwnershipsQuery = gql`
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
