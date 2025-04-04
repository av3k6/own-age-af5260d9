
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './lib/supabase';
import { ErrorBoundary } from './components/ErrorBoundary';

// Add error handling for the root rendering
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }
    
    console.log("Starting app rendering");
    const root = createRoot(rootElement);
    
    // Removed React.StrictMode to prevent duplicate rendering in development
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    
    console.log("App rendering complete");
    
    // Make Supabase available in browser console for debugging during development
    if (import.meta.env.DEV) {
      window.supabase = supabase;
    }
  } catch (error) {
    console.error("Failed to render application:", error);
    // Show a fallback UI when rendering fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Something went wrong</h2>
          <p>The application failed to initialize. Please check the console for more details.</p>
        </div>
      `;
    }
  }
};

// Execute the render function
renderApp();
