
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Home from './pages/Index';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/UserProfile';
import PropertyDetail from './pages/PropertyDetail';
import MakeOffer from "./pages/MakeOffer";
import EditListing from "./pages/EditListing";
import UserShowings from "./pages/UserShowings";
import Layout from './pages/Layout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading, checkIsAuthenticated } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Verify authentication state on app load
      await checkIsAuthenticated();
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, [checkIsAuthenticated]);

  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route
          path="/sell"
          element={
            user ? (
              <Sell />
            ) : (
              <Navigate to="/login" replace state={{ from: "/sell" }} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace state={{ from: "/dashboard" }} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace state={{ from: "/profile" }} />
            )
          }
        />
        <Route
          path="/showings"
          element={
            user ? (
              <UserShowings />
            ) : (
              <Navigate to="/login" replace state={{ from: "/showings" }} />
            )
          }
        />
        <Route
          path="/property/:id/make-offer"
          element={user ? <MakeOffer /> : <Navigate to="/login" replace state={{ from: window.location.pathname }} />}
        />
        <Route
          path="/property/:id/edit"
          element={user ? <EditListing /> : <Navigate to="/login" replace state={{ from: window.location.pathname }} />}
        />
      </Route>
      
      {/* Auth routes don't need the Layout with header/footer */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
