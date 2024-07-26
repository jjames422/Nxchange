import { useState } from 'react';

const DialPad = ({ value, setValue }) => {
  const handleInput = (input) => {
    setValue((prevValue) => prevValue + input);
  };

  const handleBackspace = () => {
    setValue((prevValue) => prevValue.slice(0, -1));
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'].map((input) => (
        <button
          key={input}
          onClick={() => (input === '←' ? handleBackspace() : handleInput(input))}
          className="w-full py-6 text-2xl md:text-3xl font-bold bg-gray-800 rounded-md text-white"
        >
          {input}
        </button>
      ))}
    </div>
  );
};

export default DialPad;
