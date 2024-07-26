const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptUser(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  try {
    const email = await promptUser('Enter email: ');
    const password = await promptUser('Enter password: ');
    const name = await promptUser('Enter name: ');
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        fiatBalance: 0.00,
        cryptoBalances: '{}',
        name: name,
        emailVerified: null,
        image: null,
      },
    });

    console.log('Created user:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main();
