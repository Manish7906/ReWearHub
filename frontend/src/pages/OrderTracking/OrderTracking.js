import React, { useState } from 'react';
import { mockOrders } from '../../utils/mockData';
import './OrderTracking.css';

const steps = ['Order Placed', 'Confirmed', 'Packed & Ready', 'Out for Delivery', 'Delivered'];
const stepMap = { processing: 1, confirmed: 2, packed: 3, out_for_delivery: 4, delivered: 5 };

const OrderTracking = () => {
  const [selected, setSelected] = useState(mockOrders[0]);
  const currentStep = stepMap[selected.status] || 4;

  return (
    <div className="track-page">
      <div className="track-header">
        <div className="container">
          <h1>📦 Track Your Orders</h1>
          <p>Real-time updates on your rental deliveries</p>
        </div>
      </div>

      <div className="container track-layout">
        {/* Order list */}
        <aside className="track-sidebar">
          <h3>Your Orders</h3>
          {mockOrders.map(order => (
            <div key={order.id}
              className={`track-order-item ${selected.id === order.id ? 'active' : ''}`}
              onClick={() => setSelected(order)}>
              <img src={order.product.image} alt={order.product.name} />
              <div>
                <strong>{order.product.name}</strong>
                <p>#{order.id} · {order.rentalDays} days</p>
                <span className={`badge ${order.status === 'delivered' ? 'badge-green' : 'badge-yellow'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </aside>

        {/* Tracking detail */}
        <main className="track-detail">
          {/* Order info card */}
          <div className="track-order-card">
            <div className="track-order-card__left">
              <img src={selected.product.image} alt={selected.product.name} />
              <div>
                <h3>{selected.product.name}</h3>
                <p className="track-order-id">Order #{selected.id}</p>
                <p>Rental: {selected.rentalDays} days · ₹{selected.totalAmount}</p>
                <p>📍 {selected.deliveryAddress}</p>
              </div>
            </div>
            <div className="track-order-card__dates">
              <div className="track-date">
                <span>Order Date</span>
                <strong>{selected.orderDate}</strong>
              </div>
              <div className="track-date">
                <span>Return By</span>
                <strong>{selected.returnDate}</strong>
              </div>
              <div className="track-date">
                <span>Total Paid</span>
                <strong style={{ color: '#f43397' }}>₹{selected.totalAmount}</strong>
              </div>
            </div>
          </div>

          {/* Progress stepper */}
          <div className="track-stepper-card">
            <h3>Delivery Progress</h3>
            <div className="track-stepper">
              {steps.map((step, i) => {
                const num = i + 1;
                const isDone = num < currentStep;
                const isActive = num === currentStep;
                return (
                  <div key={step} className="track-step">
                    <div className="track-step__left">
                      <div className={`track-step__dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                        {isDone ? '✓' : num}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`track-step__line ${isDone ? 'done' : isActive ? 'partial' : ''}`} />
                      )}
                    </div>
                    <div className={`track-step__label ${isActive ? 'active' : isDone ? 'done' : ''}`}>
                      <strong>{step}</strong>
                      {isActive && <span className="track-step__status">In Progress</span>}
                      {isDone && <span className="track-step__status done">Completed</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ETA Banner */}
            <div className={`track-eta ${selected.status === 'delivered' ? 'delivered' : ''}`}>
              {selected.status === 'delivered' ? (
                <><span>✅</span> Delivered on {selected.returnDate}</>
              ) : selected.status === 'out_for_delivery' ? (
                <><span>🚚</span> Out for delivery — arriving today!</>
              ) : (
                <><span>⏳</span> Estimated delivery in 2–3 business days</>
              )}
            </div>
          </div>

          {/* Return info */}
          <div className="track-return-card">
            <h3>Return Information</h3>
            <div className="track-return-grid">
              <div className="track-return-item">
                <span>📅</span>
                <div><small>Return Deadline</small><strong>{selected.returnDate}</strong></div>
              </div>
              <div className="track-return-item">
                <span>🚚</span>
                <div><small>Return Method</small><strong>Free Doorstep Pickup</strong></div>
              </div>
              <div className="track-return-item">
                <span>💰</span>
                <div><small>Security Deposit</small><strong style={{ color: '#27ae60' }}>₹{selected.product.deposit} Refundable</strong></div>
              </div>
              <div className="track-return-item">
                <span>📋</span>
                <div><small>Condition Required</small><strong>Same as received</strong></div>
              </div>
            </div>
            {selected.status !== 'returned' && selected.status !== 'processing' && (
              <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>
                📅 Schedule Return Pickup
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderTracking;
