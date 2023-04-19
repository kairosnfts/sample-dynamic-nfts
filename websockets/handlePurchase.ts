const handlePurchase = async (message: {
  collectionId: string
  nftId: string
  userPubkey: string
  userId: string
  tokenId: string
  txHash: string
}) => {
  // This will trigger whenever a user buys an NFT
  // You can use this to your server database to keep track of who owns what NFT,
  // send notifications to the user, etc.
  console.log('==> handlePurchase', message)
}

export default handlePurchase
