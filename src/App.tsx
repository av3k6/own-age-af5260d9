
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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
import Messaging from './pages/Messaging';

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
  const { user, loading, isInitialized } = useAuth();

  // Force render routes after maximum wait time even if not initialized
  useEffect(() => {
    const forceRenderTimer = setTimeout(() => {
      if (!isInitialized) {
        console.warn("Forcing app to render routes after timeout");
      }
    }, 2000); // 2 second timeout
    
    return () => clearTimeout(forceRenderTimer);
  }, [isInitialized]);

  // Remove the initialization check and go straight to routes
  // This prevents the app from being stuck on loading
  console.log("App rendering routes, initialization status:", isInitialized);

  // Update the routes array to include our messaging route
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
    <Route
      key="messages"
      path="/messages"
      element={user ? <Messaging /> : <Navigate to="/login" replace state={{ from: "/messages" }} />}
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
