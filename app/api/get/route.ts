import { NextResponse, NextRequest } from 'next/server'
import { request, gql } from 'graphql-request'
import { NextApiResponse } from 'next'

export async function GET(req: NextRequest) {
  const auth = `Basic ${Buffer.from(
    process.env.KAIROS_API_KEY! // Keep this secret from the client!
  ).toString('base64')}`

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
