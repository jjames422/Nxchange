import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, currency, amount } = await req.json();

    if (!userId || !currency || !amount) {
      return new Response(JSON.stringify({ message: 'User ID, currency, and amount are required' }), { status: 400 });
    }

    const wallet = await prisma.wallet.findFirst({
      where: { userId, type: currency },
    });

    if (!wallet) {
      return new Response(JSON.stringify({ message: 'Wallet not found' }), { status: 404 });
    }

    if (wallet.balance < parseFloat(amount)) {
      return new Response(JSON.stringify({ message: 'Insufficient balance' }), { status: 400 });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: parseFloat(amount) } },
    });

    return new Response(JSON.stringify(updatedWallet), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error', error }), { status: 500 });
  }
}
