import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { InfuraProvider } from '@ethersproject/providers';

const prisma = new PrismaClient();
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET;

function getProvider(network) {
  switch (network) {
    case 'ethereum':
      return new InfuraProvider('mainnet', {
        projectId: INFURA_PROJECT_ID,
        projectSecret: INFURA_PROJECT_SECRET,
      });
    case 'polygon':
      return new InfuraProvider('matic', {
        projectId: INFURA_PROJECT_ID,
        projectSecret: INFURA_PROJECT_SECRET,
      });
    default:
      throw new Error('Unsupported network');
  }
}

async function getERC20Balance(walletAddress, tokenContractAddress, provider) {
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  const contract = new ethers.Contract(tokenContractAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  const decimals = await contract.decimals();
  return ethers.utils.formatUnits(balance, decimals);
}

export async function POST(req) {
  let requestBody;

  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid JSON' }), { status: 400 });
  }

  const { userId, tokenContractAddress, network } = requestBody;

  if (!userId || !tokenContractAddress || !network) {
    return new Response(JSON.stringify({ message: 'User ID, token contract address, and network are required' }), { status: 400 });
  }

  try {
    const walletRecord = await prisma.wallet.findUnique({
      where: {
        userId_network: {
          userId: parseInt(userId),
          network: network,
        },
      },
    });

    if (!walletRecord) {
      return new Response(JSON.stringify({ message: 'Wallet not found' }), { status: 404 });
    }

    const provider = getProvider(network);
    const balance = await getERC20Balance(walletRecord.address, tokenContractAddress, provider);

    return new Response(JSON.stringify({ balance }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', error }), { status: 500 });
  }
}
