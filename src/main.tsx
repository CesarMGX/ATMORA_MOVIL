import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// --- ESTO ES LO QUE FALTA ---
// Inicializa Google para que el botón no marque error al hacer clic
GoogleAuth.initialize({
  clientId: '260943439033-s02n43med5qq3mkdb8bdje110q39kt97.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: false,
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);