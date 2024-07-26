const { PrismaClient } = require('@prisma/client');
const { Alchemy, Network, Wallet, ethers } = require('alchemy-sdk');

const prisma = new PrismaClient();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

async function getNodeFetch() {
  const fetch = await import('node-fetch');
  return fetch.default;
}

// Function to get the current EUR to USD exchange rate
async function getExchangeRate() {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch('https://open.er-api.com/v6/latest/EUR');
    const data = await response.json();
    return data.rates.USD;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    console.log('API failure: Fallback rate used at 1.09 USD');
    return 1.09; // Fallback rate
  }
}

// Function to get the current USD to ETH exchange rate
async function getCryptoExchangeRate() {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching crypto exchange rate:', error);
    return 1; // Fallback rate
  }
}

// Function to convert fiat to ETH and transfer to user's wallet
async function convertFiatToEth(userId, amountEUR) {
  try {
    // Get the current EUR to USD exchange rate
    const exchangeRate = await getExchangeRate();
    // Convert the amount to USD
    const amountUSD = amountEUR * exchangeRate;

    // Update user's fiat balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fiatBalance: { decrement: amountUSD },
      }
    });

    // Get the current USD to ETH exchange rate
    const cryptoExchangeRate = await getCryptoExchangeRate();
    const amountETH = amountUSD / cryptoExchangeRate;

    // Find or create an ETH wallet for the user
    let wallet = await prisma.wallet.findFirst({
      where: { userId: userId, type: 'eth', network: 'ethereum', symbol: 'ETH' },
    });

    if (!wallet) {
      const newWallet = ethers.Wallet.createRandom();
      wallet = await prisma.wallet.create({
        data: {
          userId: userId,
          type: 'eth',
          network: 'ethereum',
          address: newWallet.address,
          balance: 0,
          privateKey: {
            create: {
              key: newWallet.privateKey
            }
          },
          symbol: 'ETH',
        }
      });
    }

    // Get the exchange wallet for gas fees
    const exchangeWalletData = await prisma.wallet.findFirst({
      where: { isExchangeWallet: true, network: 'ethereum', symbol: 'ETH' },
      include: { privateKey: true }
    });

    if (!exchangeWalletData) {
      console.error('Exchange wallet not found.');
      return;
    }

    const exchangeWallet = new Wallet(exchangeWalletData.privateKey.key, alchemy);

    // Transfer ETH to the user's wallet, covering the gas fees
    const tx = {
      to: wallet.address,
      value: ethers.utils.parseEther(amountETH.toString())
    };

    const transactionResponse = await exchangeWallet.sendTransaction(tx);
    await transactionResponse.wait();

    // Update the ETH balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amountETH }
      }
    });

    console.log("User's fiat balance updated, crypto balance credited, and transaction recorded");
  } catch (error) {
    console.error('Error updating user\'s fiat balance and converting to crypto:', error);
  }
}

// Main function to execute the credit process
async function main() {
  const userId = 3;
  const amountEUR = 1000; // Example amount to convert

  await convertFiatToEth(userId, amountEUR);

  // Disconnect Prisma Client
  await prisma.$disconnect();
}

// Execute the main function
main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
