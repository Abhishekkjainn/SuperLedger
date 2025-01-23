import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Inventory from './inventory';
import Checkout from './checkout';

function App() {
  useEffect(() => {
    const vendorEmail = 'automatevellore@gmail.com'; // Replace with your logic to get the vendor email
    localStorage.setItem('vendoremail', vendorEmail);
    console.log('Vendor email set to:', vendorEmail);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inventory />} /> {/* Inventory route */}
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
