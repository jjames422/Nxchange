"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineSwap,
  AiOutlineBank,
} from "react-icons/ai";
import { useState } from "react";

export default function DashboardPage({
  user = { firstName: "John", balance: "19.78", totalAssets: "2393.62" },
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Welcome, {user.firstName}!</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-primary">${user.balance}</h3>
              <p onClick={toggleModal} className="text-sm text-accent cursor-pointer">
                Total: ${user.totalAssets}
              </p>
            </div>
            <div>{/* Graph or additional content here */}</div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-around">
            <div className="flex flex-col items-center p-2">
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

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <ModalContent>
          <ModalHeader>
            <h3>Total Assets</h3>
          </ModalHeader>
          <ModalBody>
            <p>Your total assets in fiat: ${user.totalAssets}</p>
          </ModalBody>
          <ModalFooter>
            <button auto flat color="error" onClick={toggleModal}>
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
