'use client'

import { KairosEnv, KairosProvider } from '@kairosnfts/dapp'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <KairosProvider
      env={KairosEnv.staging} // This is the Kairos environment you want to use
      hasLogs={true}
      slug={process.env.NEXT_PUBLIC_KAIROS_COLLECTION_SLUG!} // Kairos storefront slug
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
