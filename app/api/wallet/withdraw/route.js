import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { walletId, amount, currency } = await req.json();

  if (!walletId || !amount || !currency) {
    return new Response(JSON.stringify({ message: 'Wallet ID, amount, and currency are required' }), { status: 400 });
  }

  try {
    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId,
        type: 'withdrawal',
        amount,
        currency,
        status: 'completed',
      }
    });

    // Update the wallet balance
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { decrement: amount }
      }
    });

    return new Response(JSON.stringify(transaction), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', error }), { status: 500 });
  }
}
