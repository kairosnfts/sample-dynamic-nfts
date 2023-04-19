import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(process.env.NEXT_PUBLIC_KAIROS_API_URL!, {
  fetch: fetch,
})

// All routes that require authentication
const PROTECTED_ROUTES = ['/care']

export async function middleware(request: NextRequest) {
  if (PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    const sessionToken = request.cookies.get('__kairosSessionToken')?.value
    let userId: string | undefined = undefined
    if (sessionToken) {
      // Get the seession from the Kairos API
      const response: any = await client.request(AuthQuery, { sessionToken })
      userId = response?.session?.userId
    }

    // If the user is not logged in, redirect to the home page
    if (!userId) {
      const newPath = request.nextUrl.clone()
      newPath.pathname = '/'
      return NextResponse.redirect(newPath)
    }
  }
}

const AuthQuery = gql`
  query GetSession($sessionToken: String!) {
    session(sessionToken: $sessionToken) {
      id
      userId
      wallet {
        pubkey
        isCustody
      }
      user {
        email
      }
      __typename
    }
  }
`
