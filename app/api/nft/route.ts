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
import { auth, getNftsOfUser, getNextStage, updateNft } from './helpers'
import { CreateNftQuery, DeployNftQuery } from './queries'

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
 * This is the route that will be called when you want to update an NFT's metadata
 * this will not redeploy the NFT, it will only update the content of the metadata
 * without having to make any transaction on the blockchain
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { nftId, reset } = body

  const sessionToken = req.cookies.get('__kairosSessionToken')?.value
  if (!sessionToken) {
    throw new Error('No session token found')
  }

  const nfts = await getNftsOfUser(sessionToken)
  // Find the NFT among all NFTs this user owns that we want to update by its ID
  const nft = nfts.find((d: any) => d.nft.id === nftId)
  if (!nft) {
    throw new Error('NFT not found')
  }

  /**
   * In our example of a Bonsai NFT, we have a linear progression of tree stages.
   * You can provide your own logic here to determine the next stage of your NFT
   */
  let nextStage
  if (reset) {
    nextStage = TreeStage.SEED
  } else {
    nextStage = getNextStage(nft.nft!)
  }

  if (!nextStage) {
    // No more progression. We're at the last stage
    return NextResponse.json({ nftId })
  }

  await updateNft({
    nftId,
    stage: nextStage,
    description: stageDescription[nextStage],
    image: stageImage[nextStage],
  })

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

  /**
   * Optional: Update the NFT's metadata with the initial state
   */
  const stage = TreeStage.SEED
  await updateNft({
    nftId: createData.nft.id,
    stage: stage,
    description: stageDescription[stage],
    image: stageImage[stage],
  })

  return NextResponse.json({ nftId: createData.nft.id })
}
