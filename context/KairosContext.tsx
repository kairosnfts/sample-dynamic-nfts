'use client'

import { createContext, useEffect, useState } from 'react'
import { Kairos } from '@kairosnfts/dapp'

declare global {
  interface Window {
    Kairos: {
      init: (params: {
        hasLogs: boolean
        slug: string
        onLogIn?: () => void
        onLogOut?: () => void
      }) => Promise<any>
      close: () => Promise<any>
      destroy: () => Promise<any>
      startBid: (nftId: string) => Promise<any>
      logIn: () => Promise<any>
      logOut: () => Promise<any>
      isLoggedIn: (checkSessionExpired?: boolean) => Promise<boolean>
      getSessionCookie: () => string
    }
  }
}

export type KairosContextType = {
  isKairosScriptLoaded: boolean
  isLoggedIn: boolean | undefined
  isLoginLoading: boolean
  refetchLogin: () => void
  setIsLoaded: (loaded: boolean) => void
}

export const KairosContext = createContext<KairosContextType>({
  isKairosScriptLoaded: false,
  isLoggedIn: undefined,
  isLoginLoading: true,
  refetchLogin: () => {},
  setIsLoaded: (loaded) => {},
})

export const KairosProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(true)

  const refetchLogin = async () => {
    setIsLoginLoading(true)
    const loginStatus = await Kairos.isLoggedIn(true)
    setIsLoggedIn(loginStatus)
    setIsLoginLoading(false)
  }

  useEffect(() => {
    if (isLoaded) refetchLogin()
  }, [isLoaded])

  const value = {
    isKairosScriptLoaded: isLoaded,
    isLoggedIn,
    isLoginLoading,
    refetchLogin,
    setIsLoaded,
  }

  return (
    <KairosContext.Provider value={value}>{children}</KairosContext.Provider>
  )
}

export default KairosProvider
