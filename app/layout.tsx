import { Kaushan_Script } from 'next/font/google'
import Providers from './Providers'
import Navigation from './Navigation'
import './globals.css'

export const metadata = {
  title: 'Bonsai ~ Dynamic NFT App',
  description:
    'Buy a seed NFT, care for it, and watch it grow into a tree. You can see your NFT change directly on the blockchain!',
}

const kaushan = Kaushan_Script({ subsets: ['latin'], weight: '400' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={kaushan.className}>
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}
