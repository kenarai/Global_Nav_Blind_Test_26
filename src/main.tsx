import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

document.title = `Option ${__ACTIVE_OPTION__}`;

const basename = __ACTIVE_OPTION__ === '2' ? '/opt2' : __ACTIVE_OPTION__ === '3' ? '/opt3' : '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
