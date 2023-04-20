'use client'

import { KairosContext, KairosContextType } from '@/context/KairosContext'
import { useContext, useEffect } from 'react'
import { Kairos } from '@kairosnfts/dapp'
export default function KairosScript() {
  const { setIsLoaded } = useContext<KairosContextType>(KairosContext)
  useEffect(() => {
    Kairos.init({
      env: process.env.NODE_ENV === 'production' ? 'staging' : 'development',
      hasLogs: true,
      slug: 'dynamic-demo', // This is the slug of the storefront you created in the Kairos dashboard
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
