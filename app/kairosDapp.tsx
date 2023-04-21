'use client'

import { KairosProvider } from '@kairosnfts/dapp/dist/react'
import { KairosEnv } from '@kairosnfts/dapp/dist/types'

export default function KairosClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KairosProvider
      env={KairosEnv.staging} // This is the environment you want to use. It can be 'staging', 'production' or 'development', it will determine the server you will connect to
      hasLogs={true}
      slug={process.env.NEXT_PUBLIC_KAIROS_COLLECTION_SLUG!} // This is the slug of the storefront you created in the Kairos dashboard
      onLogIn={() => {
        console.log('Kairos log in')
      }}
      onLogOut={() => {
        console.log('Kairos log out')
      }}
    >
      {children}
    </KairosProvider>
  )
}
