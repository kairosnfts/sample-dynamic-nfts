/**
 * This file contains the data that will be used to create and update NFTs.
 */

export const nftName = 'NFT Bonsai'
export const nftDescription = 'A Bonsai tree that grows with your care.'
export const nftPrice = 0.1

export enum TreeStage {
  SEED = 'Seed',
  SEEDLING = 'Seedling',
  SAPLING = 'Sapling',
  MATURE = 'Mature',
}

export const treeStages = [
  TreeStage.SEED,
  TreeStage.SEEDLING,
  TreeStage.SAPLING,
  TreeStage.MATURE,
]

export const stageDescription = {
  [TreeStage.SEED]:
    'A seed is a plant embryo with a protective outer covering.',
  [TreeStage.SEEDLING]:
    'A seedling is an early plant that has germinated from a seed.',
  [TreeStage.SAPLING]: 'A sapling is a young tree nearing maturity.',
  [TreeStage.MATURE]: 'A mature tree is a tree that has grown to full size.',
}

export const stageImage = {
  [TreeStage.SEED]:
    'https://cdn.shopify.com/s/files/1/0249/4811/3492/products/shutterstock_1459014053_f4ac62c8-a034-4f05-bd25-1077a8703d09.jpg?v=1667050598',
  [TreeStage.SEEDLING]:
    'https://cdn.shopify.com/s/files/1/0249/4811/3492/products/bonsai-1805494_1920_960x.jpg?v=1667050598',
  [TreeStage.SAPLING]:
    'https://cdn.shopify.com/s/files/1/0249/4811/3492/products/bonsai-2211102_1920-1920x1200_1080x.jpg?v=1667050598',
  [TreeStage.MATURE]:
    'https://cdn.shopify.com/s/files/1/0249/4811/3492/products/Muffif_maple_tree_bonsai_hyper_real_art_station_trending_unreal_bc331610-e206-407c-b2fd-4bcc5405802c_1080x.png?v=1667050693.',
}
