import { NextRequest, NextResponse } from 'next/server'
import { request } from 'graphql-request'
import {
  nftName,
  nftDescription,
  nftPrice,
  stageDescription,
  stageImage,
  TreeStage,
} from './data'
import { auth, getNftsOfUser, updateNft } from './helpers'
import { CreateNftQuery, DeployNftQuery } from './queries'
import { Mutation } from '@kairosnfts/dapp'

/**
 * This is the route will return all the NFTs and their metadata that the user owns
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const sessionToken = req.cookies.get('__kairosSessionToken')?.value
  if (!sessionToken) {
    throw new Error('No session token found')
  }

  const nfts = await getNftsOfUser(sessionToken)

  return NextResponse.json(nfts.map((d: any) => d.nft))
}

/**
 * This is the route that will be called when the user clicks the "Create NFT" button
 * It will create an NFT on the Kairos server and deploy it (not mint yet)
 */
export async function POST(req: Request): Promise<NextResponse> {
  /**
   * STEP 1 - Create an NFT on the Kairos server
   */
  const createResponse: Mutation = await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    CreateNftQuery,
    {
      input: {
        name: nftName,
        description: nftDescription,
        collectionId: process.env.KAIROS_COLLECTION_ID, // Keep this secret from the client!
        price: nftPrice, // The price of the NFT (on-chain native currency)
      },
    },
    {
      Authorization: auth,
    }
  )

  const createData = createResponse?.createOneOfOneNft
  if (!createData || createData.__typename !== 'CreateNftRes') {
    const errorMsg =
      createData.__typename === 'CreateOneOfOneNftError'
        ? createData?.message
        : 'NFT creation failed'
    throw new Error(errorMsg)
  }

  const nftId = createData.nft.id
  if (!nftId) {
    throw new Error('No NFT ID created')
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
        nftId: nftId,
        isBlocking: true, // If true, the request will wait until the NFT is deployed
      },
    },
    {
      Authorization: auth,
    }
  )

  /**
   * Optional: Update the NFT's metadata with the initial state
   */
  const stage = TreeStage.SEED
  await updateNft({
    nftId: nftId,
    stage: stage,
    description: stageDescription[stage],
    image: stageImage[stage],
  })

  return NextResponse.json({ nftId: nftId })
}
