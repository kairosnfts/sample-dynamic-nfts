import { NextResponse, NextRequest } from 'next/server'
import { request, gql } from 'graphql-request'

export async function POST(req: NextRequest) {
  const auth = `Basic ${Buffer.from(
    process.env.KAIROS_API_KEY! // Keep this secret from the client!
  ).toString('base64')}`

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

export const UpdateMetadataQuery = gql`
  mutation UpdateDynamicMetadata($input: UpdateDynamicMetadataInput!) {
    updateDynamicMetadata(input: $input)
  }
`
