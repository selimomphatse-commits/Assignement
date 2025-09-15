import React, { useState, useEffect } from 'react';
import '../styles/StockManagement.css';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleStockAdjustment = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    const updatedProducts = products.map(product => {
      if (product.id === parseInt(selectedProduct)) {
        const adjustment = parseInt(quantity);
        const newQuantity = adjustmentType === 'add' 
          ? product.quantity + adjustment
          : Math.max(0, product.quantity - adjustment);
        
        return {
          ...product,
          quantity: newQuantity
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Record transaction
    const transaction = {
      id: Date.now(),
      productId: parseInt(selectedProduct),
      type: adjustmentType,
      quantity: parseInt(quantity),
      date: new Date().toISOString()
    };
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    setSelectedProduct('');
    setQuantity('');
    alert('Stock updated successfully!');
  };

  return (
    <div className="stock-management">
      <h2 className="section-title">Stock Management</h2>
      
      <div className="card">
        <h3>Adjust Stock Levels</h3>
        <form onSubmit={handleStockAdjustment} className="stock-form">
          <div className="form-row">
            <div className="form-group">
              <label>Select Product</label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Current: {product.quantity})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Adjustment Type</label>
              <select 
                value={adjustmentType} 
                onChange={(e) => setAdjustmentType(e.target.value)}
                required
              >
                <option value="add">Add Stock</option>
                <option value="subtract">Subtract Stock</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">Update Stock</button>
        </form>
      </div>
      
      <div className="card">
        <h3>Current Stock Levels</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Current Quantity</th>
                  <th>Minimum Stock Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className={product.quantity <= product.minStockLevel ? 'low-stock' : ''}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.minStockLevel}</td>
                    <td>{product.quantity <= product.minStockLevel ? 'LOW STOCK' : 'OK'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;