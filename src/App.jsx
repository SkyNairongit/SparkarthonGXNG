import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import CustomerView from './views/CustomerView';
import QueueView from './views/QueueView';
import CashierView from './views/CashierView';
import EmployeePortal from './views/EmployeePortal';

function App() {
  const [role, setRole] = useState(null); // 'customer', 'employee'
  const [activeTab, setActiveTab] = useState('customer'); // 'customer', 'queue', 'cashier'

  const handleEnterApp = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleBackToLanding = () => {
    setRole(null);
    setActiveTab('customer');
  };

  return (
    <div>
      {!role && <LandingPage onEnter={handleEnterApp} />}

      {role === 'customer' && (
        <>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'customer' && <CustomerView />}
          {activeTab === 'queue' && <QueueView />}
          {activeTab === 'cashier' && <CashierView />}
        </>
      )}

      {role === 'employee' && (
        <EmployeePortal onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;
