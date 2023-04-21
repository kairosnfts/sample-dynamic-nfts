# Bonsai Dynamic NFT Demo

This application utilizes the [`kairos/dapp`](https://github.com/kairosnfts/dapp) library to demonstrate the capabilities of dynamic NFTs, and the ease of integration for collections created on [Kairos](https://kairos.art).

This is an example of a project built with [Next.js](https://nextjs.org/) 13, and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). However, you can bring your own framework (or none at all!) if you don't want to use Next.

[See a live demo](https://sample-dynamic-nfts.kairos.art/) deployed on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Getting Started

To install, simply run the following in your local directory:

```bash
yarn
```

Then run it:

```bash
yarn dev
```

You should now see the application running on `http://localhost:3000`. 🎉

## Usage

This application is connected by default to Kairos Beta servers, so that you can test the flow of:

- NFT purchase → display → update

You can do this out-of-the-box, without having to add any additional environment variables, because we've already setup a demo Kairos account and added the appropriate keys to this repo. However, when you're ready to start building your own project, be sure to [signup to Kairos](https://kairos.art/sign-up), create your own collection, and update the collection and API keys shown in `.env.local`.

### Purchasing an NFT

This NFT starts as a mere seed, but blossoms into a mature bonsai tree. To begin this process, you need to mint an NFT. Since this demo is running on Kairos Beta servers, it uses the developer networks of the supported blockchains (ETH, MATIC, SOL). In the case of this demo, we have set it to use MATIC, so you must have the testnet, Mumbai, added to your wallet with funds in it, to complete this purchase. You can use a [MATIC faucet](https://faucet.polygon.technology/) to send funds to a Mumbai wallet address for free.

Alternatively, you can test the purchasing of an NFT with a credit card. Again, this is set to test mode, so you can use the card number `4242 4242 4242 4242` along with other random values for security and zip codes.

You can mint as many NFTs as you'd like to for this demo. In real-world scenarios, you may want to limit the number of mints per wallet, which can be set in the Kairos collection settings.

> **_NOTE:_** When purchasing with Kairos, the user will be asked for an email address to tie the wallet address to (or in the case of credit card purchases, to automatically create an account in Kairos for that email address). Multiple wallets can be tied to a single email address. Kairos will consolidate them automatically. If a user purchases with a credit card, Kairos will hold the NFT for the user until the user logs into Kairos (with the email address they used during purchase), and requests to move the NFT elsewhere.

### Updating NFT Dynamic Metadata

Once you purchase an NFT bonsai, you can cultivate it to progress it to the next life cycle of the tree. When you click the "Cultivate" button, it sends the metadata update request to Kairos, pulls the latest data, and then automatically displays the new data. You can continue to do this until the tree reaches maturity. This is the final stage in this demo. However, you can click on "Reset" to go back to the seed stage and test again.

## How it Works

Most NFT smart contracts don't include images or attributes directly on-chain. Rather, they link to other URLs that host that information. In this case, Kairos holds the "state" of the NFT metadata, which is linked from the smart contract. If you update the NFT metadata, and then use a real-time [blockchain explorer](https://gemcase.vercel.app/), you will see the metadata referenced on-chain has updated with your changes.

> **_NOTE:_** Some explorers and marketplaces, like Opensea, don't update metadata in real-time. Rather, they update on jobs every so often. So metadata changes may **seem** delayed, even if they aren't.

## Support

If you have any questions, or need help while implementing the library within your own project, please don't hesitate to [reach out to us at Kairos](https://kairos.art/contact). We're here to help make your NFT integration as smooth as possible.
