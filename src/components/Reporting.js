import React, { useState, useEffect } from 'react';
import '../styles/Reporting.css';
import '../styles/ProductManagement.css';

const Reporting = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (!startDate && !endDate) return true;
    
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    return transactionDate >= start && transactionDate <= end;
  });

  const totalRevenue = filteredTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const totalTransactions = filteredTransactions.length;

  return (
    <div>
      <h2>Reporting</h2>
      
      <div className="report-filters">
        <h3>Filters</h3>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-boxes">
        <div className="stat-box">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-box">
          <h3>Total Transactions</h3>
          <p>{totalTransactions}</p>
        </div>
      </div>

      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.customer}</td>
              <td>
                {transaction.items.map(item => (
                  <div key={item.id}>
                    {item.name} (x{item.quantity})
                  </div>
                ))}
              </td>
              <td>${transaction.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reporting;

