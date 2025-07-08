// src/components/LandingPage.jsx
import React from 'react';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Store Assistant</h1>
      <div className="flex gap-8">
        <button
          onClick={() => onEnter('customer')}
          className="bg-gradient-to-r from-pink-300 to-blue-300 text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition"
        >
          I'm a Customer
        </button>
        <button
          onClick={() => onEnter('employee')}
          className="bg-gradient-to-r from-pink-300 to-blue-300 text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition"
        >
          I'm an Employee
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
