const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyAddresses() {
  const wallets = await prisma.wallet.findMany({
    select: {
      id: true,
      address: true,
    },
  });

  wallets.forEach(wallet => {
    const isValidHex = /^0x[0-9a-fA-F]+$/.test(wallet.address);
    console.log(`Wallet ID: ${wallet.id}, Address: ${wallet.address}, Valid: ${isValidHex}`);
  });
}

verifyAddresses().catch(e => {
  console.error(e);
  prisma.$disconnect();
}).finally(() => {
  prisma.$disconnect();
});
