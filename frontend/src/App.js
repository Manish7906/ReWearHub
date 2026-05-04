import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';

import Home from './pages/Home/Home';
import RentClothes from './pages/RentClothes/RentClothes';
import CelebrityStyle from './pages/CelebrityStyle/CelebrityStyle';
import Donation from './pages/Donation/Donation';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import { Signup } from './pages/Auth/Login';
import Checkout from './pages/Checkout/Checkout';
import OrderTracking from './pages/OrderTracking/OrderTracking';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <CartDrawer />
          <main style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rent" element={<RentClothes />} />
              <Route path="/celebrity-style" element={<CelebrityStyle />} />
              <Route path="/donate" element={<Donation />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderTracking />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#f0ece4',
                border: '1px solid #f43397',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                borderRadius: 12,
              },
              success: { iconTheme: { primary: '#f43397', secondary: 'white' } },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
