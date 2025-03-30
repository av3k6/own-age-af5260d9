
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase'

// Add error handling for the root rendering
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }
    
    const root = createRoot(rootElement);
    root.render(<App />);
    
    // Make Supabase available in browser console for debugging during development
    if (import.meta.env.DEV) {
      window.supabase = supabase;
    }
  } catch (error) {
    console.error("Failed to render application:", error);
  }
};

// Execute the render function
renderApp();
