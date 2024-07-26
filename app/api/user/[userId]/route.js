// app/api/wallet/[userId]/index.js
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const wallets = await prisma.wallet.findMany({
        where: { userId: parseInt(userId, 10) },
        select: {
          id: true,
          type: true,
          address: true,
          balance: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (wallets.length === 0) {
        return res.status(404).json({ error: 'Wallets not found for this user' });
      }

      return res.status(200).json(wallets);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
