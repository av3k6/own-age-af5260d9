
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
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

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-pulse text-center">
      <p className="text-lg font-medium text-gray-500">Loading application...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes with Layout */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/buy" element={<Buy />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                </Route>
                
                {/* Auth routes without Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes with Layout */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/sell" element={
                    <ProtectedRoute>
                      <Sell />
                    </ProtectedRoute>
                  } />
                  <Route path="/showings" element={
                    <ProtectedRoute>
                      <UserShowings />
                    </ProtectedRoute>
                  } />
                  <Route path="/property/:id/make-offer" element={
                    <ProtectedRoute>
                      <MakeOffer />
                    </ProtectedRoute>
                  } />
                  <Route path="/property/:id/edit" element={
                    <ProtectedRoute>
                      <EditListing />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents" element={
                    <ProtectedRoute>
                      <DocumentManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messaging />
                    </ProtectedRoute>
                  } />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
