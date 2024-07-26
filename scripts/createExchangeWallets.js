const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');
const { Alchemy, Network, Wallet } = require('alchemy-sdk');

const prisma = new PrismaClient();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// Function to generate Ethereum and Matic wallets
function generateEthWallet() {
  const wallet = ethers.Wallet.createRandom();
  const alchemyWallet = new Wallet(wallet.privateKey, alchemy);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    alchemyWallet,
  };
}

// Function to store wallets in the database
async function storeWallet(wallet, type, network) {
  await prisma.exchangeWallet.create({
    data: {
      type,
      network,
      address: wallet.address,
      privateKey: wallet.privateKey,
    },
  });
}

async function createExchangeWallets() {
  try {
    const exchangeWallets = {
      BTC: generateEthWallet(),  // Replace this with Bitcoin wallet generation
      ETH: generateEthWallet(),
      LTC: generateEthWallet(),  // Replace this with Litecoin wallet generation
      MATIC: generateEthWallet(),
    };

    for (const [type, wallet] of Object.entries(exchangeWallets)) {
      await storeWallet(wallet, type, type === 'MATIC' ? 'polygon' : 'ethereum');
    }

    console.log('Exchange wallets created successfully');
  } catch (error) {
    console.error('Error creating exchange wallets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createExchangeWallets();
