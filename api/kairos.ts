import { request, gql } from 'graphql-request'
import {
  CreateNftQuery,
  DeployNftQuery,
  OwnershipsQuery,
  UpdateMetadataQuery,
} from './gql'

// To deploy an NFT you need a Kairos API key with write permissions to the collection
// In a production environment, you would not expose this key to the frontend
export const KAIROS_AUTH = `Basic ${Buffer.from(
  process.env.NEXT_PUBLIC_KAIROS_API_KEY!
).toString('base64')}`

// Fetches all NFTs owned by the current user from the Kairos API
// You can also use this to fetch the metadata of the NFTs
export const fetchUserNfts = async () => {
  if (!window.Kairos?.getSessionCookie()) return

  const sessionToken = window.Kairos.getSessionCookie()

  const data: any = await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    OwnershipsQuery,
    {
      collectionId: process.env.NEXT_PUBLIC_KAIROS_COLLECTION_ID,
      sessionToken: sessionToken,
    },
    {
      Authorization: KAIROS_AUTH,
    }
  )

  return data.collectorOwnershipsByCollection.map((d: any) => d.nft)
}

// Steps 1 and 2 would normally be called from a backend server,
// in this case we are calling it from the frontend for simplicity
export const createNft = async () => {
  // 1.- Create NFT on kairos server
  const createResponse: any = await request(
    process.env.NEXT_PUBLIC_KAIROS_API_URL!,
    CreateNftQuery,
    {
      input: {
        name: 'Test NFT',
        description: 'This is a test NFT',
        collectionId: process.env.NEXT_PUBLIC_KAIROS_COLLECTION_ID,
        price: 0.01, // The price of the nft on the chain native currency, in this case MATIC
      },
    },
    {
      Authorization: KAIROS_AUTH,
    }
  )

  const createData = createResponse?.createOneOfOneNft
  if (createData.__typename !== 'CreateNftRes') {
    throw new Error(createData.message)
  }

  // 2.- Deploy NFT on kairos server, this will not mint the NFT on the chain
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
      Authorization: KAIROS_AUTH,
    }
  )

  // 3.- Initiate NFT purchase
  // This will open the purchase modal and the user will be able to complete the purchase
  await window.Kairos.startBid(createData.nft.id)

  // At this point the user completed the purchase and the NFT is minted on the chain
  // after a successful purchase, if the user was not logged in, they will be logged in automatically
}

// Would normally be called from a backend server,
// in this case we are calling it from the frontend for simplicity
export const updateMetadata = async ({
  nftId,
  uri,
  description,
}: {
  nftId: string
  uri: string
  description: string
}) => {
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
      Authorization: KAIROS_AUTH,
    }
  )
}
