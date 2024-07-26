const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');

const prisma = new PrismaClient();

async function updateAddresses() {
  const wallets = await prisma.wallet.findMany();

  for (const wallet of wallets) {
    const isValidHex = /^0x[0-9a-fA-F]+$/.test(wallet.address);
    if (!isValidHex) {
      const newWallet = ethers.Wallet.createRandom();
      console.log(`Updating Wallet ID: ${wallet.id}, Old Address: ${wallet.address}, New Address: ${newWallet.address}`);
      
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          address: newWallet.address,
          privateKey: {
            update: {
              key: newWallet.privateKey,
            }
          }
        },
      });
    }
  }
}

updateAddresses().catch(e => {
  console.error(e);
  prisma.$disconnect();
}).finally(() => {
  prisma.$disconnect();
});
