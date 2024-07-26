// Import Prisma Client
const { PrismaClient } = require('@prisma/client');
const prompt = require('prompt-sync')();
const prisma = new PrismaClient();

async function getNodeFetch() {
  const fetch = await import('node-fetch');
  return fetch.default;
}

// Function to get the current EUR to USD exchange rate
async function getExchangeRate() {
  try {
    const fetch = await getNodeFetch();
    // Use an API to get the current exchange rate
    const response = await fetch('https://open.er-api.com/v6/latest/EUR');
    const data = await response.json();
    return data.rates.USD;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    console.log('API failure: Fallback rate used at 1.09 USD');
    // Use a fallback exchange rate in case of an error
    return 1.09; // Fallback rate
  }
}

// Function to update user's fiat balance and record transaction
async function creditFiatBalance(userId, amountEUR, referenceCode, transactionReferenceNumber, bicSender, senderName, transactionDate) {
  try {
    // Get the current EUR to USD exchange rate
    const exchangeRate = await getExchangeRate();
    // Convert the amount to USD
    const amountUSD = amountEUR * exchangeRate;

    // Update user's fiat balance and create a new FiatTransaction record
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fiatBalance: { increment: amountUSD },
        fiatTransactions: {
          create: {
            amount: amountUSD,
            currency: 'USD',
            type: 'deposit',
            status: 'completed',
            referenceCode: referenceCode,
            transactionReferenceNumber: transactionReferenceNumber,
            bicSender: bicSender,
            senderName: senderName,
            transactionDate: new Date(transactionDate),
          }
        }
      }
    });

    console.log("User's fiat balance updated and transaction recorded:", updatedUser);
  } catch (error) {
    console.error('Error updating user\'s fiat balance:', error);
  }
}

// Main function to execute the credit process
async function main() {
  // Prompt the user for inputs
  const userId = parseInt(prompt('Enter user ID: '), 10);
  const amountEUR = parseFloat(prompt('Enter amount in EUR: ').replace(/,/g, ''));
  const referenceCode = prompt('Enter reference code: ');
  const transactionReferenceNumber = prompt('Enter transaction reference number (TRN): ');
  const bicSender = prompt('Enter BIC Sender: ');
  const senderName = prompt('Enter Sender Name: ');
  const transactionDate = prompt('Enter Date of Transaction (YYYY-MM-DD): ');

  // Ensure valid inputs
  if (isNaN(userId) || isNaN(amountEUR)) {
    console.error('Invalid input. Please enter valid numbers for user ID and amount.');
    return;
  }

  await creditFiatBalance(userId, amountEUR, referenceCode, transactionReferenceNumber, bicSender, senderName, transactionDate);

  // Disconnect Prisma Client
  await prisma.$disconnect();
}

// Execute the main function
main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
