
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase'

// Make Supabase available in browser console for debugging during development
if (import.meta.env.DEV) {
  window.supabase = supabase;
}

createRoot(document.getElementById("root")!).render(<App />);
