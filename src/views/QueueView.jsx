import React, { useState } from 'react';

const QueueView = () => {
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [numItems, setNumItems] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const handleQueueSelect = (queueNum) => {
    setSelectedQueue(queueNum);
    setShowForm(true);
    setConfirmation('');
    setNumItems('');
  };

  const handleSubmit = () => {
    const n = parseInt(numItems);
    if (isNaN(n) || n <= 0) {
      alert('Enter a valid number of items');
      return;
    }

    const sessionTime = n * 5 + 180; // in seconds
    const key = `counter${selectedQueue}`;
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    const numCustomers = (stored.numCustomers || 0) + 1;
    const billingTimes = stored.billingTimes || [];

    localStorage.setItem(
      key,
      JSON.stringify({
        numCustomers,
        billingTimes: [...billingTimes, sessionTime],
      })
    );

    setConfirmation(
      `✅ Customer added to Queue ${selectedQueue} with estimated session time ${Math.floor(
        sessionTime / 60
      )} min ${sessionTime % 60} sec.`
    );
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">🧾 Select Queue</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center mb-6">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            className="bg-blue-100 hover:bg-blue-200 font-semibold py-2 px-4 rounded-xl"
            onClick={() => handleQueueSelect(n)}
          >
            Queue {n}
          </button>
        ))}
        <button
          className="bg-pink-100 hover:bg-pink-200 font-semibold py-2 px-4 rounded-xl col-span-2 sm:col-span-1"
          onClick={() => handleQueueSelect(5)}
        >
          Fast 5
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">
            🛒 Enter No. of Items for Queue {selectedQueue}
          </h2>
          <input
            type="number"
            min={1}
            className="w-full border p-2 rounded-lg mb-4"
            value={numItems}
            onChange={(e) => setNumItems(e.target.value)}
            placeholder="Number of items"
          />
          <button
            className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            ✅ Confirm and Add to Queue
          </button>
        </div>
      )}

      {confirmation && (
        <p className="mt-6 text-center text-green-600 font-semibold">{confirmation}</p>
      )}
    </div>
  );
};

export default QueueView;
