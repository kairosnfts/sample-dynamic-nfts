'use client'

import { KairosContext, KairosContextType } from '@/context/KairosContext'
import Script from 'next/script'
import { useContext } from 'react'

export default function KairosScript() {
  const { setIsLoaded } = useContext<KairosContextType>(KairosContext)
  return (
    <>
      <Script
        strategy="afterInteractive"
        onLoad={async () => {
          await window.Kairos.init({
            hasLogs: true,
            slug: process.env.NEXT_PUBLIC_KAIROS_COLLECTION_SLUG!, // This is the slug of the storefront you created in the Kairos dashboard
            onLogIn: () => {
              console.log('Kairos log in')
            },
            onLogOut() {
              console.log('Kairos log out')
            },
          })
          setIsLoaded(true)
        }}
        onError={(err: any) => console.error('KairosDappJsLoadFail', err)}
        src={process.env.NEXT_PUBLIC_KAIROS_DAPP_SCRIPT_URL}
      />
    </>
  )
}
