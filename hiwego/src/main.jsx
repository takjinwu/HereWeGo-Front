// src/main.jsx (수정)

import React from 'react';
import ReactDOM from 'react-dom/client';
// App.tsx 대신 App.jsx에서 가져오도록 경로가 .js/.jsx를 가리키는지 확인
import App from './App'; 
import './styles/GlobalStyle.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);