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
  [TreeStage.SEED]: 'https://pretty.kairos.art/o/bonsai-seed.png',
  [TreeStage.SEEDLING]: 'https://pretty.kairos.art/o/bonsai-seedling.png',
  [TreeStage.SAPLING]: 'https://pretty.kairos.art/o/bonsai-sappling.png',
  [TreeStage.MATURE]: 'https://pretty.kairos.art/o/bonsai-mature.png',
}
