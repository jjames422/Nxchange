const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fundExchangeWallets() {
  const exchangeWallets = [
    {
      network: 'btc',
      symbol: 'BTC',
      address: '0xB4DDFDc0B545d4ac6cDaA6723e0fbA482b8Da6dE',
      privateKey: '0xa5bd0f2e65cf1c59853795f2bd0779cbc27c4bea9db194a9a973b42fe8e5599c',
    },
    {
      network: 'eth',
      symbol: 'ETH',
      address: '0x0596Bf77faa8991eb42DA3dB964b5F9267F6F2ba',
      privateKey: '0xcb23eb2ae5aa86de301e5071977bc78497092aa3dbf4c215900d57a425174688',
    },
    {
      network: 'ltc',
      symbol: 'LTC',
      address: '0x28a7c8F1101aA802e7315421815d21D683b00Eb9',
      privateKey: '0xd14366a79791be3f8cb5b2a65c3d7fad54b31cdcddcbf844b0361c3aa8a360a5',
    },
    {
      network: 'matic',
      symbol: 'MATIC',
      address: '0x08859B5A7E6fdb4647C90FEa892ebCbE044b76a0',
      privateKey: '0x1d31a59a25a2699921fd9ffe6d523fe5f8af896ebf8d079a9d9d6b110bcd8dc2',
    },
  ];

  try {
    for (const wallet of exchangeWallets) {
      await prisma.wallet.updateMany({
        where: {
          network: wallet.network,
          symbol: wallet.symbol,
          address: wallet.address,
        },
        data: {
          balance: 1000,
        },
      });
    }

    console.log('Exchange wallets funded successfully');
  } catch (error) {
    console.error('Error funding exchange wallets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fundExchangeWallets().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
