import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { walletId } = params;

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: parseInt(walletId) },
      select: {
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      return new Response(JSON.stringify({ message: 'Wallet not found' }), { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { walletId: parseInt(walletId) },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify({
      address: wallet.address,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      transactions
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', error }), { status: 500 });
  }
}
