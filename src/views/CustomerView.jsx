import React, { useState, useEffect } from 'react';

const CustomerView = () => {
  const [dish, setDish] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queueEstimates, setQueueEstimates] = useState({});

  const handleFindIngredients = async () => {
    if (!dish.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/find_ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dish }),
      });
      const data = await response.json();
      setResults(data.matches);
    } catch (err) {
      setResults([]);
    }
    setLoading(false);
  };

  const getEstimatedWaitTime = (counterNum) => {
    const data = JSON.parse(localStorage.getItem(`counter${counterNum}`) || '{}');
    const numCustomers = data.numCustomers || 0;
    const billingTimes = data.billingTimes || [];
    const avgBilling = billingTimes.length ? billingTimes.reduce((a, b) => a + b, 0) / billingTimes.length : 0;
    return Math.round(numCustomers * avgBilling);
  };

  const formatWaitTime = (seconds) => {
    if (!seconds || seconds <= 0) return '--';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min} min ${sec} sec`;
  };

  useEffect(() => {
    const estimates = {};
    for (let i = 1; i <= 5; i++) {
      estimates[i] = getEstimatedWaitTime(i);
    }
    setQueueEstimates(estimates);
  }, [results]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">🧭 Your Personal In-Store Guide</h1>
        <p className="text-gray-600 mt-2">Find ingredients for any dish with smart inventory matching</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">🍽️ What would you like to cook today?</h2>
        <input
          type="text"
          placeholder="e.g., Pasta Carbonara, Chicken Curry..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFindIngredients()}
        />
        <button
          onClick={handleFindIngredients}
          className="bg-gradient-to-r from-pink-300 to-blue-300 text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition"
        >
          {loading ? 'Finding...' : 'Find Ingredients'}
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          {results.map((match, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg shadow ${
                match.matches.length > 0 ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
              }`}
            >
              <h3 className="font-semibold">{match.matches.length > 0 ? `Matches for '${match.ingredient}'` : `No match found for: ${match.ingredient}`}</h3>
              {match.matches.map((item, i) => (
                <div key={i} className="mt-2 text-sm bg-white rounded p-2 border border-gray-200">
                  <strong>{item.name}</strong><br />
                  Brand: {item.brand}, Size: {item.size}, Price: {item.price}, Aisle: {item.aisle}<br />
                  Tags: {item.tags.join(', ')}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 mt-12">
        <h2 className="text-xl font-semibold mb-4">🕒 Estimated Wait Time at Each Counter</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.entries(queueEstimates).map(([counter, time]) => (
            <div key={counter} className="text-center">
              <p className="font-semibold">Counter {counter}</p>
              <p className="text-gray-600">{formatWaitTime(time)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
