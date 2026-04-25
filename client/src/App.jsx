import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing       from './pages/Landing';
import Home          from './pages/Home';
import Results       from './pages/Results';
import SchemeBrowser from './pages/SchemeBrowser';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/"        element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/schemes" element={<SchemeBrowser />} />
        <Route path="*"        element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
