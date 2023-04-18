import { NextRequest, NextResponse } from 'next/server'
import { request, gql } from 'graphql-request'

const auth = `Basic ${Buffer.from(
  process.env.KAIROS_API_KEY! // Keep this secret from the client!
).toString('base64')}`

/**
 * This is the route will return all the NFTs and their metadata that the user owns
 *
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  const sessionToken = await req.cookies.get('__kairosSessionToken')?.value
  if (!sessionToken) {
    throw new Error('No session token')
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
    throw new Error('No data')
  }

  return NextResponse.json(
    data.collectorOwnershipsByCollection.map((d: any) => d.nft)
  )
}

/**
 * This is the route that will be called when you want to update an NFT's metadata
 * this will not redeploy the NFT, it will only update the content of the metadata
 * without having to make any transaction on the blockchain
 *
 * @param req
 * @returns
 */
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { nftId, description, uri } = body

  await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    UpdateMetadataQuery,
    {
      input: {
        nftId: nftId,
        // Metadata patch is a JSON object that will be merged with the existing metadata
        // You can use this to update the metadata of an NFT without having to redeploy it
        // This is useful for updating the image of an NFT or adding new attributes
        metadataPatch: {
          external_url: 'https://kairos.art',
          description,
          image: uri,
          attributes: [
            // You can add as many attributes as you want
            {
              trait_type: 'Updated at',
              value: new Date().toISOString(),
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
 *
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  // STEP 1 - Create an NFT on the Kairos server
  const createResponse: any = await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    CreateNftQuery,
    {
      input: {
        name: 'Test NFT',
        description: 'This is a test NFT',
        collectionId: process.env.KAIROS_COLLECTION_ID, // Keep this secret from the client!
        price: 0.01, // The price of the NFT (on-chain native currency)
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

  // STEP 2 - Deploy the NFT on the Kairos server.
  // Note: This will not mint the NFT on the chain yet. That happens in STEP 3.
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

// We use GraphQL queries to interact with the Kairos API
// You can learn more about GraphQL language here: https://graphql.org/learn/

export const UpdateMetadataQuery = gql`
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
