import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Landing       from './pages/Landing';
import Home          from './pages/Home';
import Results       from './pages/Results';
import SchemeBrowser from './pages/SchemeBrowser';
import AllSchemes    from './pages/AllSchemes';
import './App.css';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Landing />} />
          <Route path="/home"     element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/schemes" element={<SchemeBrowser />} />
          <Route path="/all-schemes" element={<AllSchemes />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
