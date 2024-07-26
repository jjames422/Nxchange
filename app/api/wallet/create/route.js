import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';

const prisma = new PrismaClient();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

function generateETHWallet() {
  const wallet = ethers.Wallet.createRandom();
  return { address: wallet.address, privateKey: wallet.privateKey };
}

export async function POST(req) {
  const { userId, type, network, symbol } = await req.json();

  if (!userId || !type || !network || !symbol) {
    return new Response(JSON.stringify({ message: 'User ID, token type, network, and symbol are required' }), { status: 400 });
  }

  try {
    // Check if a wallet already exists for the user, type, and network
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId: parseInt(userId),
        type,
        network,
        symbol
      },
    });

    if (existingWallet) {
      return new Response(JSON.stringify({ message: 'A wallet already exists for this user, type, and network combination' }), { status: 400 });
    }

    let newWallet = generateETHWallet();

    // Save the private key
    const privateKeyRecord = await prisma.privateKey.create({
      data: {
        key: newWallet.privateKey,
      },
    });

    // Create the wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId: parseInt(userId),
        type,
        network,
        address: newWallet.address,
        privateKeyId: privateKeyRecord.id,
        symbol
      },
    });

    return new Response(JSON.stringify({
      id: wallet.id,
      userId: wallet.userId,
      type: wallet.type,
      network: wallet.network,
      address: wallet.address,
      balance: wallet.balance,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      privateKeyId: wallet.privateKeyId,
      symbol: wallet.symbol
    }), { status: 201 });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
  }
}
