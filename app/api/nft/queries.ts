import { gql } from 'graphql-request'

/**
 * The Kairos API uses GraphQL for all requests.
 * Please visit https://api.kairos.art/ for the full documentation and options.
 * You can learn more about GraphQL language here: https://graphql.org/learn/
 */

/**
 * Create a one-of-one NFT on the Kairos server
 * See https://api.kairos.art/#mutation-createOneOfOneNft
 */
export const CreateNftQuery = gql`
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

/**
 * Deploy an NFT on the Kairos server
 * See https://api.kairos.art/#mutation-deployNft
 */
export const DeployNftQuery = gql`
  mutation DeployNft($input: DeployNftInput!) {
    deployNft(input: $input) {
      __typename
    }
  }
`

/**
 * Get a single NFT from the Kairos server by ID
 */
export const GetNftQuery = gql`
  query nft($nftId: UUID!) {
    nft(nftId: $nftId) {
      id
      name
      description
      collectionId
      mintPubkey
      metadataPatch {
        description
        external_url
        image
        attributes {
          trait_type
          value
        }
      }
    }
  }
`

/**
 * Get the NFTs owned by logged-in user on the Kairos server
 * https://api.kairos.art/#query-collectorOwnershipsByCollection
 */
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
        mintPubkey
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

/**
 * Update the metadata of an NFT on the Kairos server
 * See https://api.kairos.art/#mutation-updateDynamicMetadata
 */
export const UpdateMetadataQuery = gql`
  mutation UpdateDynamicMetadata($input: UpdateDynamicMetadataInput!) {
    updateDynamicMetadata(input: $input)
  }
`
