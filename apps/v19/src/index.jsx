import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);

reportWebVitals(console.log);
