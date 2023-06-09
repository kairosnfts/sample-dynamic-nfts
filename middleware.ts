import type { NextRequest } from 'next/server'
// Define the GraphQL API endpoint URL
const API_URL = process.env.NEXT_PUBLIC_KAIROS_API_URL!

// Limit the middleware to paths to these
export const config = {
  matcher: ['/shelf', '/care'],
}

export default async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('__kairosSessionToken')?.value
  let userId = undefined
  if (sessionToken) {
    // Send a POST request with the GraphQL query as the request body
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: AuthQuery,
        variables: { sessionToken },
      }),
    })
    const data = await response.json()
    userId = data?.data?.session?.userId
  }

  // If the user is not logged in, redirect to the home page
  if (!userId) {
    return Response.redirect(new URL('/', request.url))
  }
}

const AuthQuery = `
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
