import React from 'react';
import { Button } from "@nextui-org/button";
import { AiOutlineGlobal } from 'react-icons/ai';
import siteConfig from '@/config/site';
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-900 text-white`}>
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={onClose} className="text-2xl">&times;</button>
      </div>
      <ul className="p-4">
        <li className="mb-2"><a href={siteConfig.links.explore}>Explore</a></li>
        <li className="mb-2"><a href={siteConfig.links.learn}>Learn</a></li>
        <li className="mb-2"><a href={siteConfig.links.company}>Company</a></li>
      </ul>
      <div className="p-4 flex space-x-2">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button as="a" href={siteConfig.links.signup} color="primary" fullWidth>Sign Up</Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button as="a" href={siteConfig.links.signin} color="secondary" fullWidth>Sign In</Button>
        </motion.div>
      </div>
      <div className="flex items-center justify-center w-full py-4 mt-4 border-t border-gray-700">
        <AiOutlineGlobal className="mr-2" />
        <a href="#" className="mr-2">Global</a>
        <span className="mx-2">|</span>
        <a href="#">English</a>
      </div>
    </div>
  );
};

export default Sidebar;
