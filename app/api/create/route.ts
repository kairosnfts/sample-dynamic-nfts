import { NextResponse } from 'next/server'
import { request, gql } from 'graphql-request'

export async function POST(req: Request) {
  const auth = `Basic ${Buffer.from(
    process.env.KAIROS_API_KEY! // Keep this secret from the client!
  ).toString('base64')}`

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
