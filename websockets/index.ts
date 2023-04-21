import WebSocket from 'ws'
import handlePurchase from './handlePurchase'
import dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.local' })

const autoReconnectDelay = 5000

// This is a simple websocket client that will connect to the Kairos websocket server
// and listen for the purchase event.
// In this case, it runs on a separated process from Nextjs for simplicity.
const connectToWSS = () => {
  const authBase64 = Buffer.from(process.env.KAIROS_API_KEY!).toString('base64')
  let client = new WebSocket(process.env.KAIROS_WS_URL!, {
    rejectUnauthorized: process.env.NODE_ENV !== 'development',
    headers: {
      __kairosCollectionId: process.env.KAIROS_COLLECTION_ID,
      authorization: `Basic ${authBase64}`,
    },
  }) as unknown as WebSocket

  client.on('error', (err: Error & { code: string }) => {
    console.error(err)
    if (err.code === 'ECONNREFUSED') {
      client.removeAllListeners()
      // Try to reconnect in autoReconnectDelay ms
      setTimeout(() => {
        client = connectToWSS()
      }, autoReconnectDelay)
    }

    client.terminate()
  })

  client.on('open', () => {
    console.log(
      'Websocket connection established: ',
      process.env.KAIROS_WS_URL!
    )
  })

  client.on('close', function clear() {
    console.log('Websocket connection closed: ', process.env.KAIROS_WS_URL!)
    client.terminate()
  })

  client.on('message', (messageJson: any) => {
    const message = JSON.parse(messageJson)
    switch (message.eventName) {
      case 'nftPurchase':
        handlePurchase(message)
        break
      default:
        console.error('Unhandled ws event', { message })
        break
    }
  })

  return client
}

connectToWSS()
