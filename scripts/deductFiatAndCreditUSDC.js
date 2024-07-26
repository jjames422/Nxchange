const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    const userId = await askQuestion('Enter the user ID: ');
    const amountUSD = parseFloat(await askQuestion('Enter the amount in USD: '));

    if (!userId || isNaN(amountUSD)) {
      console.log('Please provide a valid user ID and amount in USD');
      rl.close();
      return;
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        wallets: {
          where: {
            symbol: 'USDC',
            network: 'ethereum'
          }
        }
      }
    });

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      rl.close();
      return;
    }

    // Check if user has sufficient fiat balance
    if (user.fiatBalance < amountUSD) {
      console.log(`Insufficient fiat balance. Current balance: ${user.fiatBalance}`);
      rl.close();
      return;
    }

    // Deduct fiat balance
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { fiatBalance: { decrement: amountUSD } }
    });

    // Check if the user has a USDC wallet
    let usdcWallet = user.wallets.find(wallet => wallet.symbol === 'USDC');

    if (!usdcWallet) {
      console.log(`No USDC wallet found for user with ID ${userId}`);
      rl.close();
      return;
    }

    // Convert USD to USDC (assuming 1 USDC = 1 USD)
    const amountUSDC = amountUSD;

    // Update USDC wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: usdcWallet.id },
      data: { balance: { increment: amountUSDC } }
    });

    console.log(`Successfully transferred ${amountUSD} USD to ${amountUSDC} USDC for user ID ${userId}`);
    console.log(`New fiat balance: ${updatedUser.fiatBalance}`);
    console.log(`New USDC wallet balance: ${updatedWallet.balance}`);
  } catch (error) {
    console.error('Error performing transaction:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
