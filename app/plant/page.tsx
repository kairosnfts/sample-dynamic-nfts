'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import { request, gql } from 'graphql-request'

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

// Steps 1 and 2 would normally be called from a backend server,
// in this case we are calling it from the frontend for simplicity
const createNft = async () => {
  // To deploy an NFT you need a Kairos API key with write permissions to the collection
  // In a production environment, you would not expose this key to the frontend
  const auth = `Basic ${Buffer.from(
    process.env.NEXT_PUBLIC_KAIROS_API_KEY!
  ).toString('base64')}`

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
      Authorization: auth,
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
      Authorization: auth,
    }
  )

  // 3.- Initiate NFT purchase
  // This will open the purchase modal and the user will be able to complete the purchase
  await window.Kairos.startBid(createData.nft.id)

  // At this point the user completed the purchase and the NFT is minted on the chain
  // after a successful purchase, if the user was not logged in, they will be logged in automatically
}

export default function Plant() {
  return (
    <main>
      <header>
        <Link href="/">↩ Back</Link>
      </header>

      <div className={styles.center}>
        <Image
          src="/images/seed-packet.png"
          alt="Packet of seeds"
          width={512}
          height={512}
          priority
        />
      </div>

      <div className={styles.grid}>
        <Link
          href=""
          className="button"
          onClick={(e) => {
            e.preventDefault()
            createNft()
          }}
        >
          Buy and Plant
        </Link>
      </div>
    </main>
  )
}
