const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'testuser2@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: email,
      passwordHash: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      fiatBalance: 1000.00,
      cryptoBalances: '{}',
      name: 'Test User2',
      emailVerified: null,
      image: null,
    },
  });

  console.log('Created test user:', user);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
