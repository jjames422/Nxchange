import { PrismaClient } from '@prisma/client';
import { Alchemy, Network, Wallet, Contract } from 'alchemy-sdk';

const prisma = new PrismaClient();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

async function transferERC20(tokenContractAddress, fromPrivateKey, toAddress, amount) {
  try {
    const wallet = new Wallet(fromPrivateKey, alchemy);
    const contract = new Contract(
      tokenContractAddress,
      [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)"
      ],
      wallet
    );

    // Get token decimals
    const decimals = await contract.decimals();
    const adjustedAmount = (BigInt(amount) * BigInt(10 ** decimals)).toString();

    const tx = await contract.transfer(toAddress, adjustedAmount);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error in transferERC20:', error);
    throw new Error(error.reason || 'Error in transferERC20');
  }
}

export async function POST(req) {
  let requestBody;

  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid JSON', error: error.message }), { status: 400 });
  }

  const { fromUserId, toUserId, amount, network, symbol } = requestBody;

  if (!fromUserId || !toUserId || !amount || !network || !symbol) {
    return new Response(JSON.stringify({ message: 'All parameters are required' }), { status: 400 });
  }

  try {
    const fromUserWallet = await prisma.wallet.findFirst({
      where: {
        userId: parseInt(fromUserId),
        network: network,
        symbol: symbol,
      },
      include: {
        privateKey: true,
      },
    });

    if (!fromUserWallet) {
      return new Response(JSON.stringify({ message: 'Sender wallet not found' }), { status: 404 });
    }

    const toUserWallet = await prisma.wallet.findFirst({
      where: {
        userId: parseInt(toUserId),
        network: network,
        symbol: symbol,
      },
    });

    if (!toUserWallet) {
      return new Response(JSON.stringify({ message: 'Receiver wallet not found' }), { status: 404 });
    }

    const txHash = await transferERC20(
      fromUserWallet.address,
      fromUserWallet.privateKey.key,
      toUserWallet.address,
      amount
    );

    return new Response(JSON.stringify({
      message: 'Transfer successful',
      txHash: txHash
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
  }
}
