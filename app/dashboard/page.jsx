"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineSwap, AiOutlineBank } from 'react-icons/ai';
import FullScreenModal from '@/components/FullScreenModal';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export default function DashboardPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState({
    id: null,
    firstName: "Loading...",
    balance: 0,
    totalAssets: 0,
  });

  const toggleModal = () => setModalOpen(!isModalOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        const cryptoBalances = JSON.parse(data.cryptoBalances);
        const totalCryptoBalance = Object.values(cryptoBalances).reduce((sum, value) => sum + value, 0);
        const totalAssets = data.fiatBalance + totalCryptoBalance;

        setUser({
          id: data.id,
          firstName: data.name,
          balance: data.fiatBalance,
          totalAssets,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {user.firstName}!</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-primary">{formatCurrency(user.balance)}</h3>
              <p className="text-sm text-accent cursor-pointer">
                Total: {formatCurrency(user.totalAssets)}
              </p>
            </div>
            <div>{/* Graph or additional content here */}</div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-around">
            <div className="flex flex-col items-center p-2" onClick={toggleModal}>
              <AiOutlinePlus size={24} className="text-primary" />
              <p className="text-xs mt-1 text-primary">Buy</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <AiOutlineMinus size={24} className="text-primary" />
              <p className="text-xs mt-1 text-primary">Sell</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <AiOutlineArrowUp size={24} className="text-primary" />
              <p className="text-xs mt-1 text-primary">Send</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <AiOutlineArrowDown size={24} className="text-primary" />
              <p className="text-xs mt-1 text-primary">Receive</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <AiOutlineSwap size={24} className="text-primary" />
              <p className="text-xs mt-1 text-primary">Convert</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <AiOutlineBank size={24} className="text-primary" />
              <p className="text-xs mt-1 text-primary whitespace-nowrap">Add Cash</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      <FullScreenModal isOpen={isModalOpen} toggleModal={toggleModal} />
    </div>
  );
}
