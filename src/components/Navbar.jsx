// src/components/Navbar.jsx
import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white/90 backdrop-blur shadow-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-300 via-green-200 to-blue-300 bg-clip-text text-transparent">
          🛍️ Store Assistant
        </div>
        <div className="flex gap-6">
          {['customer', 'queue', 'cashier'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full font-semibold border-2 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-100 to-blue-100 border-pink-400'
                  : 'border-transparent'
              } hover:-translate-y-1 transition`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
