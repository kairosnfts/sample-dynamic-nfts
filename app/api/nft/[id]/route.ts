import { NextRequest, NextResponse } from 'next/server'
import { getNft, getNextStage, updateNft } from '../helpers'
import { stageDescription, stageImage, TreeStage } from '../data'

/**
 * This is the route will return the NFT and its metadata
 */
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string }
  }
): Promise<NextResponse> {
  const nftId = params.id
  if (!nftId) {
    throw new Error('No NFT ID provided')
  }

  const nft = await getNft(nftId)
  if (!nft) {
    throw new Error('NFT not found')
  }

  return NextResponse.json(nft)
}

/**
 * This is the route that will be called when you want to update an NFT's metadata
 * this will not redeploy the NFT, it will only update the content of the metadata
 * without having to make any transaction on the blockchain
 */
export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string }
  }
): Promise<NextResponse> {
  const nftId = params.id
  const body = await req.json()
  const { reset } = body

  const nft = await getNft(nftId)
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
    nextStage = getNextStage(nft)
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
