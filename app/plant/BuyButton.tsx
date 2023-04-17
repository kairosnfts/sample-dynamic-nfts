'use client'

import { createNft } from '@/api/kairos'

export default function BuyButton() {
  return <button onClick={() => createNft()}>Buy and Plant</button>
}
