import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button, ButtonGroup } from '@nextui-org/button';
import DialPad from './DialPad'; // Ensure this path is correct based on your directory structure

const FullScreenModal = ({ isOpen, toggleModal }) => {
  const [tab, setTab] = useState('buy');
  const [crypto, setCrypto] = useState('Ethereum');
  const [paymentMethod, setPaymentMethod] = useState('USDC');
  const [amount, setAmount] = useState('');

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  return (
    <Modal isOpen={isOpen} onClose={toggleModal} className="fixed inset-0 z-10 flex items-center justify-center">
      <ModalContent className="w-full h-full bg-background text-foreground rounded-none">
        <ModalHeader className="flex justify-between items-center bg-background text-foreground p-4">
          <button onClick={toggleModal} className="text-xl font-bold">&times;</button>
          <div className="flex space-x-4">
            <ButtonGroup>
              <Button 
                auto 
                onClick={() => handleTabChange('buy')} 
                className={tab === 'buy' ? 'bg-primary text-white' : 'text-gray-500'}
              >
                Buy
              </Button>
              <Button 
                auto 
                onClick={() => handleTabChange('sell')} 
                className={tab === 'sell' ? 'bg-primary text-white' : 'text-gray-500'}
              >
                Sell
              </Button>
              <Button 
                auto 
                onClick={() => handleTabChange('convert')} 
                className={tab === 'convert' ? 'bg-primary text-white' : 'text-gray-500'}
              >
                Convert
              </Button>
            </ButtonGroup>
          </div>
          <div></div> {/* Placeholder for symmetry */}
        </ModalHeader>
        <ModalBody className="flex flex-col items-center p-4 space-y-4">
          <div className="flex flex-col items-start w-full">
            <label className="mb-2 text-sm font-medium text-foreground">Buy</label>
            <select
              value={crypto}
              onChange={(e) => setCrypto(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-background text-foreground"
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="Litecoin">Litecoin</option>
            </select>
            <label className="mb-2 text-sm font-medium text-foreground">Pay with</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-background text-foreground"
            >
              <option value="USDC">USDC</option>
              <option value="USD">USD</option>
              <option value="Credit Card">Credit Card</option>
            </select>
            <div className="w-full p-2 mb-4 text-4xl font-bold text-center border-b border-gray-300 bg-background text-foreground focus:outline-none">
              <span className="break-all text-4xl md:text-3xl lg:text-4xl">{amount} USD</span>
            </div>
          </div>
          <DialPad value={amount} setValue={setAmount} />
        </ModalBody>
        <ModalFooter className="p-4">
          <Button
            type="button"
            auto
            onClick={toggleModal}
            className="w-full text-lg font-medium bg-primary text-white rounded-md hover:bg-primary-600"
          >
            Buy maximum amount
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FullScreenModal;
