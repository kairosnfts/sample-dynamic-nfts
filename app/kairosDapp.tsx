'use client'

import { KairosContext, KairosContextType } from '@/context/KairosContext'
import { useContext, useEffect } from 'react'
import { Kairos } from '@kairosnfts/dapp'

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
