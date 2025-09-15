import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    const lowStockItems = products.filter(product => 
      product.quantity <= product.minStockLevel
    ).length;
    
    const totalSales = transactions.reduce((total, transaction) => 
      total + transaction.total, 0
    );
    
    setStats({
      totalProducts: products.length,
      lowStockItems,
      totalSales,
      totalCustomers: customers.length
    });
  }, []);

  return (
    <div className="dashboard">
      <h2 className="section-title">Dashboard</h2>
      
      <div className="welcome-banner">
        <h3>Welcome to Wings Cafe Inventory System</h3>
        <p>Manage your products, inventory, sales, and customers in one place</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{stats.lowStockItems}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${stats.totalSales.toFixed(2)}</div>
          <div className="stat-label">Total Sales</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-label">Total Customers</div>
        </div>
      </div>
      
      <div className="recent-activity card">
        <h3>Recent Activity</h3>
        <p>Your dashboard will show recent activities here once you start using the system.</p>
      </div>
    </div>
  );
};

export default Dashboard;