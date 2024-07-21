const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function verifyUser(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log('User not found');
      return false;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (isPasswordValid) {
      console.log('Password is valid');
      return true;
    } else {
      console.log('Invalid password');
      return false;
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Replace these values with the email and password you want to check
const email = 'testuser@example.com';
const password = 'password123';

verifyUser(email, password).then((isValid) => {
  if (isValid) {
    console.log('User credentials are correct');
  } else {
    console.log('User credentials are incorrect');
  }
});
