# Bonsai Dynamic NFT Demo

<img width="828" alt="dynamic-nft-screenshot" src="https://user-images.githubusercontent.com/6920066/234094436-997722ee-d806-42ee-a889-10e8cd00aef9.png">

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

This application is connected by default to Kairos Beta servers, so that you can test the flow of NFTs:

- Purchase → Display → Update

You can do this out-of-the-box, without having to add any additional environment variables, because we've already setup a demo Kairos account and added the appropriate keys to this repo. However, when you're ready to start building your own project, be sure to [signup to Kairos](https://kairos.art/sign-up), create your own collection, and update the collection and API keys shown in `.env.local`. Also be sure to update the URLs for Kairos in `.env` with non-beta versions for your production environment (ie, `https://beta.kairos.art/public/graphql` → `https://kairos.art/public/graphql`)

### Purchasing an NFT

This NFT starts as a mere seed, but blossoms into a mature bonsai tree. To begin this process, you need to mint an NFT. Since this demo is running on Kairos Beta servers, it uses the developer networks of the supported blockchains (ETH, MATIC, SOL). In the case of this demo, we have set it to use MATIC, so you must have the testnet, Mumbai, added to your wallet with funds in it, to complete this purchase. You can use a [MATIC faucet](https://faucet.polygon.technology/) to send funds to a Mumbai wallet address for free.

Alternatively, you can test the purchasing of an NFT with a credit card. Again, this is set to test mode, so you can use the card number `4242 4242 4242 4242` along with other random values for security and zip codes.

You can mint as many NFTs as you'd like to for this demo. In real-world scenarios, you may want to limit the number of mints per wallet, which can be set in the Kairos collection settings.

> **_NOTE:_** When purchasing with Kairos, the user will be asked for an email address to tie the wallet address to (or in the case of credit card purchases, to automatically create an account in Kairos for that email address). Multiple wallets can be tied to a single email address. Kairos will consolidate them automatically. If a user purchases with a credit card, Kairos will hold the NFT for the user until the user logs into Kairos (with the email address they used during purchase), and requests to move the NFT elsewhere.

#### What's Happening Behind the Scenes

When you click on the "Buy and Plant" button, found in [`BuyButton.tsx`](https://github.com/kairosnfts/sample-dynamic-nfts/blob/a80612d0958628f1a53ba6a79dc0070bad8dede2/app/plant/BuyButton.tsx), it triggers a `POST` mutation to our [app API](https://github.com/kairosnfts/sample-dynamic-nfts/blob/a80612d0958628f1a53ba6a79dc0070bad8dede2/app/api/nft/route.ts#L85), which starts the process of creating an NFT on Kairos:

```js
/**
 * STEP 1 - Create an NFT on the Kairos server
 */
const createResponse: any = await request(
  process.env.NEXT_PUBLIC_KAIROS_API_URL!,
  CreateNftQuery,
  {
    input: {
      name: nftName,
      description: nftDescription,
      collectionId: process.env.KAIROS_COLLECTION_ID, // Keep this secret from the client!
      price: nftPrice, // The price of the NFT (on-chain native currency)
    },
  },
  {
    Authorization: auth,
  }
)
```
The `CreateNftQuery` gql is found in [`queries.ts`](https://github.com/kairosnfts/sample-dynamic-nfts/blob/06fdb1c86d7970041e8aec40b6ac46697febdadf/app/api/nft/queries.ts), and you can reference the Kairos API options for this request in the [Kairos API definition for `CreateOneOfOneNft`](https://api.kairos.art/#mutation-createOneOfOneNft).

The next step is to ask Kairos to deploy the newly created NFT to Kairos servers in order to obtain an `nftId`:

```js
/**
 * STEP 2 - Deploy the NFT on the Kairos server.
 * Note: This will not mint the NFT on the chain yet. That happens in STEP 3.
 */
await request(
  process.env.NEXT_PUBLIC_KAIROS_API_URL!,
  DeployNftQuery,
  {
    input: {
      nftId: createData.nft.id,
      isBlocking: true, // If true, the request will wait until the NFT is deployed
    },
  },
  {
    Authorization: auth,
  }
)
```

As this point, we have created what *will become the NFT* once a user mints it, but it has no metadata (and hasn't been minted by the user) yet. Next we'll add some initial metadata before minting it.

```js
await updateNft({
  nftId: createData.nft.id,
  stage: stage,
  description: stageDescription[stage],
  image: stageImage[stage],
})
```

The metadata for your application would be unique to your use case, or maybe you want no metadata to start. It's up to you!

The final step is for the user to finalize the purchase from completed the steps in their crytpo wallet or filling out the credit card information. This is handled on the client-side of the application, back in [`BuyButton.tsx`](https://github.com/kairosnfts/sample-dynamic-nfts/blob/a80612d0958628f1a53ba6a79dc0070bad8dede2/app/plant/BuyButton.tsx) and is initiated once the above two steps have been completed successfully. 

```js
/**
 * STEP 3 - Initiate NFT purchase using the NFT ID from Kairos
 * This will open the purchase modal for the user to complete the purchase
 */
await Kairos.startBid(result.nftId)
```

At this point, the user has completed the purchase and the NFT is minted on the blockchain. You can now direct the user to whatever page or action they should see next. 

### Displaying NFTs

After a successful purchase, or the user connecting to Kairos by using the provided `Kairos.logIn()` method, you now have access to the [`currentUser` object in the Kairos context](https://github.com/kairosnfts/dapp/blob/85bf59e9c6e3c97c494f2775cf2444d774c5c348/src/types.ts#L55). You may want to use this to display some kind of user informaton on the front-end, and provide a logout link using tge `Kairos.logOut()` method. You can see this in action in our demo in the [`Navigation.tsx`](https://github.com/kairosnfts/sample-dynamic-nfts/blob/a80612d0958628f1a53ba6a79dc0070bad8dede2/app/Navigation.tsx) component.

In order to display the user-owned NFTs, we use the logged-in session token found in cookies, and pass that along to the [`CollectorOwnershipsByCollection` gql query](https://api.kairos.art/#query-collectorOwnershipsByCollection) using our application `GET` API call.

```js
await request(
  process.env.NEXT_PUBLIC_KAIROS_API_URL!,
  OwnershipsQuery,
  {
    collectionId: process.env.KAIROS_COLLECTION_ID,
    sessionToken: sessionToken,
  },
  {
    Authorization: auth,
  }
)
```

### Updating NFT Dynamic Metadata

Once you purchase an NFT bonsai, you can cultivate it to progress it to the next life cycle of the tree. When you click the "Cultivate" button, it sends the metadata update request to Kairos, pulls the latest data, and then automatically displays the new data. You can continue to do this until the tree reaches maturity. This is the final stage in this demo. However, you can click on "Reset" to go back to the seed stage and test again.

#### What's Happening Behind the Scenes

We trigger a `PATCH` mutation on our API that handles the logic for our dynamic NFTs on the server-side. Our example simply finds the next available stage for the tree, and sends the next stage data to the Kairos API. 

```js
await request(
  process.env.NEXT_PUBLIC_KAIROS_API_URL!,
  UpdateMetadataQuery,
  {
    input: {
      nftId: nftId,
      /**
       * Metadata patch is a JSON object that will be merged with the existing
       * metadata. You can use this to update the metadata of an NFT without
       * having to redeploy it. This is useful for updating the image of an
       * NFT, or adding new attributes
       */
      metadataPatch: {
        image: image,
        attributes: [
          // You can add as many attributes as you want
          {
            trait_type: 'Bonsai Stage',
            value: stage,
          },
          {
            trait_type: 'Description',
            value: description,
          },
          {
            trait_type: 'Last Cultivated On',
            value: niceDate,
          },
        ],
      },
    },
  },
  {
    Authorization: auth,
  }
)
```

Please take a look at the [Kairos API documentation for the `UpdateDynamicMetadata` query](https://api.kairos.art/#mutation-updateDynamicMetadata) to find the available input options.

## How it Works

Most NFT smart contracts don't include images or attributes directly on-chain. Rather, they link to other URLs that host that information. In this case, Kairos holds the "state" of the NFT metadata, which is linked from the smart contract. If you update the NFT metadata, and then use a [blockchain explorer](https://testnets.opensea.io/collection/bonsai-dynamic-nft), you will see the metadata referenced on-chain has updated with your changes.

> **_NOTE:_** Some explorers and marketplaces, like Opensea, don't update metadata in real-time. Rather, they update on jobs that run periodically, so metadata changes may *seem* delayed, even if they aren't. In the case of Opensea, you can click on the three dots button in the top right of an NFT detail page to manually refresh the metadata. 

## Support

If you have any questions, or need help while implementing the library within your own project, please don't hesitate to [reach out to us at Kairos](https://kairos.art/contact). We're here to help make your NFT integration as smooth as possible.

#### Relevant Links

- [Kairos Dapp Library](https://github.com/kairosnfts/dapp)
- [Kairos API Documentation](https://api.kairos.art/)
