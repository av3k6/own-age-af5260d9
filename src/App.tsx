import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from 'react-error-boundary';
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Sell from "@/pages/Sell";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import PropertyDetail from "@/pages/PropertyDetail";
import EditListing from "@/pages/EditListing";
import DocumentManagement from "@/pages/DocumentManagement";
import Showings from "@/pages/Showings";
import Messages from "@/pages/Messages";
import BusinessEdit from "@/pages/BusinessEdit";
import AdminDashboard from "@/pages/AdminDashboard";
import { Toaster } from "@/components/ui/toaster"

// Add the import for DocumentRequirements
import DocumentRequirements from "./pages/DocumentRequirements";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
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
                
                // Add the new route for DocumentRequirements
                {
                  path: "/document-requirements",
                  element: <DocumentRequirements />,
                },
                
              ],
            },
          ])}
        />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
