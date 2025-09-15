import React, { useState, useEffect } from 'react';
import '../styles/Sales.css';
import '../styles/ProductManagement.css';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const processSale = () => {
    if (cart.length === 0 || !customerName) {
      alert('Please add items to cart and enter customer name');
      return;
    }

    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          quantity: product.quantity - cartItem.quantity
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    const transaction = {
      id: Date.now(),
      customer: customerName,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date().toLocaleString()
    };

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    setCart([]);
    setCustomerName('');
    alert('Sale processed successfully!');
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h2>Sales</h2>
      
      <div className="sales-container">
        <div className="products-panel">
          <h3>Products</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={product.quantity <= product.minStockLevel ? 'low-stock' : ''}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="cart-panel">
          <h3>Cart</h3>
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <div>
                    <input
                      type="number"
                      className="quantity-input"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      min="1"
                    />
                    <span> x ${item.price} = ${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              <h4>Total: ${total.toFixed(2)}</h4>
              <button onClick={processSale}>Process Sale</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
