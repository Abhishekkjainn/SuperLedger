import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Inventory() {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Available');
  const [billingCart, setBillingCart] = useState([]);

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      const vendoremail = localStorage.getItem('vendoremail');
      try {
        const response = await axios.get(
          `https://superbill-api.vercel.app/fetchinventory/vendoremail=${vendoremail}`
        );
        if (response.data.success) {
          setInventoryData(response.data.inventory);
        } else {
          console.error('Error fetching inventory:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  const categories = [
    'All',
    ...(Array.isArray(inventoryData)
      ? [...new Set(inventoryData.map((item) => item.category))]
      : []),
  ];

  // Filter inventory by search query and category
  const filteredItems = inventoryData.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.productName.toLowerCase().includes(query) ||
      item.productId.toString().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.stockQuantity.toString().includes(query) ||
      item.costPrice.toString().includes(query) ||
      item.sellingPrice.toString().includes(query);
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter items based on stock availability
  const getFilteredItemsByStock = () => {
    switch (activeFilter) {
      case 'Available':
        return inventoryData.filter((item) => item.stockQuantity > 5);
      case 'Low Availability':
        return inventoryData.filter(
          (item) => item.stockQuantity > 0 && item.stockQuantity <= 5
        );
      case 'Stock Over':
        return inventoryData.filter((item) => item.stockQuantity === 0);
      default:
        return inventoryData;
    }
  };

  // Add or remove items from the billing cart
  const toggleItemInCart = (item, quantityChange) => {
    setBillingCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItem = prevCart.find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItem) {
        // Update the quantity of the existing item
        const updatedCart = prevCart.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + quantityChange }
            : cartItem
        );
        return updatedCart.filter((cartItem) => cartItem.quantity > 0); // Ensure quantity doesn't go below 1
      } else {
        // Add the item to the cart with an initial quantity of 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Calculate the total price with GST (assuming 18% GST)
  // Calculate total price with GST and quantity adjustments
  const calculateTotal = () => {
    return billingCart.reduce((total, item) => {
      const sellingPrice = parseFloat(item.sellingPrice); // Ensure sellingPrice is a number
      const gst = sellingPrice * 0.18; // 18% GST
      const totalPriceWithGST = (sellingPrice + gst) * item.quantity; // Multiply by quantity
      return total + totalPriceWithGST;
    }, 0);
  };
  const handleCheckout = () => {
    const total = calculateTotal(); // Get the total amount
    navigate('/checkout', { state: { items: billingCart, total } }); // Pass structured data
  };

  return (
    <div className="inventory">
      <div className="categoriesandsearchbar">
        <div className="categories-container">
          <div className="categories">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`category ${
                  selectedCategory === category ? 'categoryactive' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
        <div className="searchbar">
          <input
            type="text"
            name="searchinventory"
            id="searchinventory"
            className="searchinventory"
            placeholder="Search For Product ID, Name etc"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="products">
        <div className="inventoryitems">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div className="productcard" key={item.productId}>
                <img
                  src={item.image || '/default-image.png'}
                  alt="Product"
                  className="productimage"
                />
                <div className="productinfo">
                  <div className="productname">
                    <span className="serialnumber">{index + 1}. </span>
                    {item.productName}
                  </div>
                  <div className="productstatus">
                    <div className="prodcat">Id : {item.productId}</div>
                    <div className="prodcat">{item.category}</div>
                    <div
                      className="stockcount"
                      style={{
                        color: item.stockQuantity === 0 ? 'red' : 'green',
                      }}
                    >
                      {item.stockQuantity} in Stock
                    </div>
                  </div>
                </div>
                <div className="sep"></div>
                <div className="productprice">
                  <div className="buyingprice">
                    <div className="buyinghead">
                      <div className="smallcirclegreen"></div>
                      <div className="buyingtext">Buying Price</div>
                    </div>
                    <div className="buyingpriceamount">{item.costPrice} Rs</div>
                  </div>
                  <div className="sep"></div>
                  <div className="sellingprice">
                    <div className="sellinghead">
                      <div className="smallcirclegreen"></div>
                      <div className="sellingtext">Selling Price</div>
                    </div>
                    <div className="sellingpriceamount">
                      {item.sellingPrice} Rs
                    </div>
                  </div>
                  <div className="sep"></div>
                </div>
                <div className="actionsinv">
                  {billingCart.some(
                    (cartItem) => cartItem.productId === item.productId
                  ) ? (
                    <>
                      <div
                        className="decreaseButton"
                        onClick={() => toggleItemInCart(item, -1)}
                      >
                        -
                      </div>
                      <div className="item-quantity">
                        {billingCart.find(
                          (cartItem) => cartItem.productId === item.productId
                        )?.quantity || 0}
                      </div>
                      <div
                        className="increaseButton"
                        onClick={() => toggleItemInCart(item, 1)}
                      >
                        +
                      </div>
                    </>
                  ) : (
                    <div
                      className="increaseButton"
                      onClick={() => toggleItemInCart(item, 1)}
                    >
                      +
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-placeholder">
              No products match your search or selected category.
            </div>
          )}
        </div>

        {/* Fixed footer for billing totals */}
        <div className="billing-footer">
          <div className="billing-cart">
            {billingCart.length > 0 ? (
              billingCart.map((item) => (
                <div className="billing-cart-item" key={item.productId}>
                  <div className="product-name">{item.productName}</div>
                  <div className="product-id">ID: {item.productId}</div>
                  <div className="product-id">Quantity: {item.quantity}</div>
                  <div className="gst">
                    GST (18%): {parseFloat(item.sellingPrice) * 0.18} Rs
                  </div>
                  <div className="total-price">
                    Total Price:{' '}
                    {parseFloat(item.sellingPrice) +
                      parseFloat(item.sellingPrice) * 0.18}{' '}
                    Rs
                  </div>
                </div>
              ))
            ) : (
              <div>No items in cart.</div>
            )}
          </div>
          <div className="total">
            <span>Total: </span>
            <span>{calculateTotal()} Rs</span>
          </div>
          <button onClick={handleCheckout} className="checkout-button">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
