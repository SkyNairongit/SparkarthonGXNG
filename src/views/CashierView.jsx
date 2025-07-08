// src/components/CashierView.jsx
import React, { useState, useEffect } from 'react';

const CashierView = () => {
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [queue, setQueue] = useState([]);

  // Fetch queue from localStorage
  useEffect(() => {
    if (selectedCounter) {
      const data = JSON.parse(localStorage.getItem(`queue${selectedCounter}`)) || [];
      setQueue(data);
    }
  }, [selectedCounter]);

  // Handle customer done
  const handleCustomerDone = () => {
    const updatedQueue = [...queue];
    updatedQueue.shift(); // Remove the first customer
    setQueue(updatedQueue);
    localStorage.setItem(`queue${selectedCounter}`, JSON.stringify(updatedQueue));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👨‍💼 Cashier Portal</h2>

      <div className="mb-6">
        <p className="font-semibold mb-2">Select Queue:</p>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`px-4 py-2 rounded-full font-semibold border ${
                selectedCounter === num
                  ? 'bg-blue-200 border-blue-500'
                  : 'border-gray-300 bg-white'
              } hover:bg-blue-100 transition`}
              onClick={() => setSelectedCounter(num)}
            >
              Counter {num}
            </button>
          ))}
        </div>
      </div>

      {selectedCounter && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Queue for Counter {selectedCounter}</h3>

          {queue.length === 0 ? (
            <p className="text-gray-600">No customers in queue.</p>
          ) : (
            <div className="space-y-4">
              {queue.map((customer, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg shadow border ${
                    idx === 0 ? 'border-green-400' : 'border-gray-300'
                  } bg-white flex justify-between`}
                >
                  <div>
                    <p className="font-bold">Customer {idx + 1}</p>
                    <p>Items: {customer.items}</p>
                    <p>Time: {customer.time} seconds</p>
                  </div>
                  {idx === 0 && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600"
                      onClick={handleCustomerDone}
                    >
                      ✅ Done
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CashierView;
