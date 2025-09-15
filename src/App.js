import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import StockManagement from './components/StockManagement';
import Sales from './components/Sales';
import Customer from './components/Customer';
import Reporting from './components/Reporting';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Wings Cafe Inventory System</h1>
          <nav className="main-nav">
            <Link to="/">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/inventory">Inventory</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/reports">Reports</Link>
          </nav>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/inventory" element={<StockManagement />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/reports" element={<Reporting />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;