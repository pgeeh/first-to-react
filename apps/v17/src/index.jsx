// react-markdown@4's old vfile dependency reads `process.cwd()` directly
// (a bare global reference, not an import) - set it up before anything else
// runs. See the matching note in vite.config.js.
import process from 'process/browser';
globalThis.process = process;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
);

reportWebVitals(console.log);
