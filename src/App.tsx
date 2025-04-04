
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from 'react-error-boundary';
import Layout from "./components/layout/Layout";
import Home from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Signup";
import NotFound from "./pages/NotFound";
import Sell from "./pages/Sell";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/UserProfile";
import PropertyDetail from "./pages/PropertyDetail";
import EditListing from "./pages/EditListing";
import DocumentManagement from "./pages/DocumentManagement";
import Showings from "./pages/UserShowings";
import Messages from "./pages/Messaging";
import BusinessEdit from "./pages/BusinessEdit";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { Toaster } from "./components/ui/toaster";
import DocumentRequirements from "./pages/DocumentRequirements";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <RouterProvider
            router={createBrowserRouter([
              {
                path: "/",
                element: <Layout />,
                errorElement: <NotFound />,
                children: [
                  {
                    path: "/",
                    element: <Home />,
                  },
                  {
                    path: "/login",
                    element: <Login />,
                  },
                  {
                    path: "/register",
                    element: <Register />,
                  },
                  {
                    path: "/sell",
                    element: <Sell />,
                  },
                  {
                    path: "/dashboard",
                    element: <Dashboard />,
                  },
                  {
                    path: "/dashboard/listings",
                    element: <Dashboard />,
                  },
                  {
                    path: "/profile",
                    element: <Profile />,
                  },
                  {
                    path: "/property/:id",
                    element: <PropertyDetail />,
                  },
                  {
                    path: "/edit-listing/:id",
                    element: <EditListing />,
                  },
                  {
                    path: "/document-management",
                    element: <DocumentManagement />,
                  },
                  {
                    path: "/showings",
                    element: <Showings />,
                  },
                  {
                    path: "/messages",
                    element: <Messages />,
                  },
                  {
                    path: "/business/edit",
                    element: <BusinessEdit />,
                  },
                  {
                    path: "/admin/dashboard",
                    element: <AdminDashboard />,
                  },
                  {
                    path: "/document-requirements",
                    element: <DocumentRequirements />,
                  },
                ],
              },
            ])}
          />
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
