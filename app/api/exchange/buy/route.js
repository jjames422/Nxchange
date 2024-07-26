import { PrismaClient } from '@prisma/client';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// Mock function to get ETH price in USD from your exchange
async function getEtherPriceInUSD() {
  // Replace this with actual implementation to get ETH price from your exchange
  return 2000; // Mock price
}

// Function to estimate gas fees using Alchemy SDK
async function estimateGasFees() {
  try {
    const feeData = await alchemy.core.getFeeData();
    return feeData;
  } catch (error) {
    throw new Error(`Error estimating gas fees: ${error.message}`);
  }
}

// Function to mint ERC20 token
async function mintERC20Token(wallet, amount, tokenContractAddress) {
  const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
  ];
  const contract = new ethers.Contract(tokenContractAddress, ERC20_ABI, wallet);
  const decimals = await contract.decimals();
  const amountInDecimals = ethers.utils.parseUnits(amount.toString(), decimals);
  const tx = await contract.transfer(wallet.address, amountInDecimals);
  await tx.wait();
  return tx.hash;
}

// Function to send native token
async function sendNativeToken(wallet, walletAddress, amount) {
  const tx = await wallet.sendTransaction({
    to: walletAddress,
    value: ethers.utils.parseEther(amount.toString())
  });
  await tx.wait();
  return tx.hash;
}

export async function POST(req) {
  let requestBody;

  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid JSON', error: error.message }), { status: 400 });
  }

  const { userId, amountUSD, tokenContractAddress, network } = requestBody;

  if (!userId || !amountUSD || !network) {
    return new Response(JSON.stringify({ message: 'User ID, amount, and network are required' }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    if (user.fiatBalance < amountUSD) {
      return new Response(JSON.stringify({ message: 'Insufficient fiat balance' }), { status: 400 });
    }

    await prisma.user.update({ where: { id: parseInt(userId) }, data: { fiatBalance: { decrement: amountUSD } } });

    const walletRecord = await prisma.wallet.findFirst({ where: { userId: parseInt(userId), network: network } });

    if (!walletRecord) {
      return new Response(JSON.stringify({ message: 'Wallet not found' }), { status: 404 });
    }

    const privateKeyRecord = await prisma.privateKey.findUnique({ where: { id: walletRecord.privateKeyId } });

    if (!privateKeyRecord || !privateKeyRecord.key) {
      return new Response(JSON.stringify({ message: 'Private key not found for wallet' }), { status: 500 });
    }

    const provider = new ethers.providers.AlchemyProvider('mainnet', process.env.ALCHEMY_API_KEY);
    const wallet = new ethers.Wallet(privateKeyRecord.key, provider);

    // Estimate gas fees
    let gasFees;
    try {
      gasFees = await estimateGasFees();
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error estimating gas fees', error: error.message }), { status: 500 });
    }

    // Use gas fees for the transaction
    let txHash;
    if (tokenContractAddress) {
      txHash = await mintERC20Token(wallet, amountUSD, tokenContractAddress);
    } else {
      txHash = await sendNativeToken(wallet, walletRecord.address, amountUSD);
    }

    return new Response(JSON.stringify({ message: 'Transaction successful', txHash }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
  }
}
