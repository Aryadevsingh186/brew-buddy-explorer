
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create and render root
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found!');
}

createRoot(root).render(<App />);
