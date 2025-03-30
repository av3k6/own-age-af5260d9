
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
import Buy from "@/pages/buy";
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
import DocumentManagement from './pages/DocumentManagement';

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
      try {
        // Verify authentication state on app load
        await checkIsAuthenticated();
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
  }, [checkIsAuthenticated]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // Update the routes array to include our new document management route
  const routes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="buy" path="/buy" element={<Buy />} />,
    <Route key="property" path="/property/:id" element={<PropertyDetail />} />,
    <Route
      key="sell"
      path="/sell"
      element={
        user ? (
          <Sell />
        ) : (
          <Navigate to="/login" replace state={{ from: "/sell" }} />
        )
      }
    />,
    <Route
      key="dashboard"
      path="/dashboard"
      element={
        user ? (
          <Dashboard />
        ) : (
          <Navigate to="/login" replace state={{ from: "/dashboard" }} />
        )
      }
    />,
    <Route
      key="profile"
      path="/profile"
      element={
        user ? (
          <Profile />
        ) : (
          <Navigate to="/login" replace state={{ from: "/profile" }} />
        )
      }
    />,
    <Route
      key="showings"
      path="/showings"
      element={
        user ? (
          <UserShowings />
        ) : (
          <Navigate to="/login" replace state={{ from: "/showings" }} />
        )
      }
    />,
    <Route
      key="make-offer"
      path="/property/:id/make-offer"
      element={user ? <MakeOffer /> : <Navigate to="/login" replace state={{ from: window.location.pathname }} />}
    />,
    <Route
      key="edit-listing"
      path="/property/:id/edit"
      element={user ? <EditListing /> : <Navigate to="/login" replace state={{ from: window.location.pathname }} />}
    />,
    <Route
      key="documents"
      path="/documents"
      element={<DocumentManagement />}
    />,
  ];

  return (
    <Routes>
      <Route element={<Layout />}>
        {routes}
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
