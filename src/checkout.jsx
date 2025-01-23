import { useLocation } from 'react-router-dom';

function Checkout() {
  const location = useLocation();
  const billingData = location.state; // Retrieve data passed from Inventory

  return (
    <div className="checkout-container">
      <div className="bill-header">
        <h1 className="store-name">SuperMart</h1>
        <p className="store-address">123 Market Street, Cityville</p>
        <p className="store-contact">Phone: +91-9876543210</p>
        <p className="bill-date">Date: {new Date().toLocaleDateString()}</p>
        <p className="bill-time">Time: {new Date().toLocaleTimeString()}</p>
        <p className="bill-time">Bill ID: 1245</p>
        <p className="bill-divider">----------------------------------------</p>
      </div>

      {billingData && billingData.items ? (
        <div className="bill-content">
          <div className="bill-header-row">
            <span className="item-name">Item Name</span>
            <span className="item-qty">Qty</span>
            <span className="item-price">Price</span>
          </div>
          <p className="bill-divider">
            ----------------------------------------
          </p>
          {billingData.items.map((item) => (
            <div className="bill-item" key={item.productId}>
              <span className="item-name">{item.productName}</span>
              <span className="item-qty">{item.quantity}</span>
              <span className="item-price">
                ₹
                {(
                  parseFloat(item.sellingPrice) +
                  parseFloat(item.sellingPrice) * 0.18
                ).toFixed(2)}
              </span>
            </div>
          ))}
          <p className="bill-divider">
            ----------------------------------------
          </p>
          <div className="bill-total-row">
            <span>Total:</span>
            <span>₹{billingData.total.toFixed(2)}</span>
          </div>
          <p className="bill-divider">
            ----------------------------------------
          </p>
        </div>
      ) : (
        <div className="no-data-message">
          <p>
            No data available. Please return to the Inventory page and try
            again.
          </p>
        </div>
      )}

      <div className="bill-footer">
        <p className="footer-thankyou">Thank you for shopping with us!</p>
        <p className="footer-note">Powered by SuperBill</p>
      </div>
    </div>
  );
}

export default Checkout;
