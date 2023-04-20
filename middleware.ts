import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// Define the GraphQL API endpoint URL
const API_URL = process.env.NEXT_PUBLIC_KAIROS_API_URL!

// All routes that require authentication
const PROTECTED_ROUTES = ['/shelf', '/care']

export default async function middleware(request: NextRequest) {
  if (
    PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    const sessionToken = request.cookies.get('__kairosSessionToken')?.value
    let userId = undefined
    if (sessionToken) {
      // Send a POST request with the GraphQL query as the request body
    }

    // If the user is not logged in, redirect to the home page
    if (!userId) {
      const newPath = request.nextUrl.clone()
      newPath.pathname = '/'
      return NextResponse.redirect(newPath)
    }
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
