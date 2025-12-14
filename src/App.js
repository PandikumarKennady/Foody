import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/home';
import About from './pages/about';
import Foods from './pages/food';
import Restaurants from './pages/restaurants';
import Login from './pages/login';
import Signup from './pages/signup';
import Orders from './pages/orders';

// Admin Pages
import AdminDashboard from './pages/admin/dashboard';
import AdminOrders from './pages/admin/orders';
import AdminAnalytics from './pages/admin/analytics';

// Components
import Dish from './components/Dish';
import ChatBot from './components/ChatBot';

function App() {
  
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/foods' element={<Foods />}/>
          <Route path='/foods/:id' element={<Dish />} />
          <Route path='/restaurants' element={<Restaurants />} />
          
          {/* Auth Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          
          {/* User Orders */}
          <Route path='/orders' element={<Orders />} />
          
          {/* Restaurant Admin Routes (Protected) */}
          <Route
            path='/admin/dashboard'
            element={
              <ProtectedRoute requiredRole="restaurant_admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/orders'
            element={
              <ProtectedRoute requiredRole="restaurant_admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/analytics'
            element={
              <ProtectedRoute requiredRole="restaurant_admin">
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
      </Routes>
        
        {/* Cravey - AI Chatbot */}
        <ChatBot />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
