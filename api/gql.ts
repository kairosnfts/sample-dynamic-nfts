import { gql } from 'graphql-request'

// Kairos API uses GraphQL to query the data, so we need to define the queries
// that we will use to fetch the data from the API, The queries are defined using
// the GraphQL query language, you can learn more about it here:
// https://graphql.org/learn/queries/

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
export const DeployNftQuery = gql`
  mutation DeployNft($input: DeployNftInput!) {
    deployNft(input: $input) {
      __typename
    }
  }
`

export const UpdateMetadataQuery = gql`
  mutation UpdateDynamicMetadata($input: UpdateDynamicMetadataInput!) {
    updateDynamicMetadata(input: $input)
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
