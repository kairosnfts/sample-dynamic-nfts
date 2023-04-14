import './globals.css'

export const metadata = {
  title: 'Bonsai ~ Dynamic NFT App',
  description:
    'Buy a seed NFT, care for it, and watch it grow into a tree. You can see your NFT change directly on the blockchain!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
