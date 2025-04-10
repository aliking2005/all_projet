// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Utilisez 'react-dom/client' pour React 18+
 // Importez vos styles globaux (facultatif)
import App from './App'; // Importez le composant principal de votre application

// Créez un root pour votre application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu de l'application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);