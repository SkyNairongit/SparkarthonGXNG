import React, { useState } from 'react';

const EmployeePortal = () => {
  const [activeTab, setActiveTab] = useState('know');

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🛠️ Employee Portal</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('know')}
          className={`px-4 py-2 rounded-full ${
            activeTab === 'know' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Know Your Data
        </button>
        <button
          onClick={() => setActiveTab('enter')}
          className={`px-4 py-2 rounded-full ${
            activeTab === 'enter' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Enter Queue Data
        </button>
      </div>

      {activeTab === 'know' && (
        <div className="text-gray-700">
          <p>📊 This section will display queue and billing analytics.</p>
        </div>
      )}

      {activeTab === 'enter' && (
        <div className="text-gray-700">
          <p>📝 This section will allow entering customer/billing data for counters.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeePortal;
