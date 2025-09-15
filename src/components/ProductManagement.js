import React, { useState, useEffect } from 'react';
import '../styles/ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    minStockLevel: ''
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? { 
              ...formData, 
              id: editingProduct.id,
              price: parseFloat(formData.price),
              quantity: parseInt(formData.quantity),
              minStockLevel: parseInt(formData.minStockLevel)
            }
          : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        minStockLevel: parseInt(formData.minStockLevel)
      };
      setProducts([...products, newProduct]);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      minStockLevel: ''
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      minStockLevel: product.minStockLevel.toString()
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="product-management">
      <h2 className="section-title">Product Management</h2>
      
      <div className="card">
        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Beverages">Beverages</option>
                <option value="Food">Food</option>
                <option value="Desserts">Desserts</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Minimum Stock Level</label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          
          {editingProduct && (
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: '',
                  description: '',
                  category: '',
                  price: '',
                  quantity: '',
                  minStockLevel: ''
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      
      <div className="card">
        <h3>Product List</h3>
        {products.length === 0 ? (
          <p>No products found. Add your first product above.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Min Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className={product.quantity <= product.minStockLevel ? 'low-stock' : ''}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>{product.minStockLevel}</td>
                    <td>
                      {product.quantity <= product.minStockLevel ? 'Low Stock' : 'In Stock'}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleEdit(product)}
                        className="btn btn-primary"
                        style={{marginRight: '0.5rem', padding: '0.5rem'}}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger"
                        style={{padding: '0.5rem'}}
                      >
                        Delete
                      </button>
                    </td>
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

export default ProductManagement;