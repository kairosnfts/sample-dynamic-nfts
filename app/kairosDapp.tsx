'use client'

import { KairosContext, KairosContextType } from '@kairosnfts/dapp/dist/react'
import { useContext, useEffect } from 'react'
import { Kairos } from '@kairosnfts/dapp'

// We need to import and export the provider so we can include it as a client componet
export { KairosProvider } from '@kairosnfts/dapp/dist/react'

export default function KairosScript() {
  const { setIsLoaded } = useContext<KairosContextType>(KairosContext)
  useEffect(() => {
    Kairos.init({
      env: 'staging', // This is the environment you want to use. It can be 'staging', 'production' or 'development', it will determine the server you will connect to
      hasLogs: true,
      slug: process.env.NEXT_PUBLIC_KAIROS_COLLECTION_SLUG!, // This is the slug of the storefront you created in the Kairos dashboard
      onLogIn: () => {
        console.log('Kairos log in')
      },
      onLogOut() {
        console.log('Kairos log out')
      },
    }).then(() => {
      setIsLoaded(true)
    })
  }, [setIsLoaded])
  return null
}
