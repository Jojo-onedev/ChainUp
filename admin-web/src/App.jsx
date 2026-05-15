import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Certifications from './pages/Certifications';
import Students from './pages/Students';
import Verify from './pages/Verify';
import PublicVerify from './pages/PublicVerify';
import GraduatePortal from './pages/GraduatePortal';
import BlockchainTester from './pages/BlockchainTester';
import MinisterPortal from './pages/MinisterPortal';
import AdminLayout from './components/AdminLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<PublicVerify />} />
        <Route path="/graduate" element={<GraduatePortal />} />
        <Route path="/minister-secret-access" element={<MinisterPortal />} />
        {/* <Route path="/test-blockchain" element={<BlockchainTester />} /> */}

        {/* Page de connexion admin */}
        <Route path="/admin" element={<Login />} />

        {/* Espace admin protégé avec sidebar - On change le chemin parent pour éviter le conflit */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="students" element={<Students />} />
          <Route path="verify-admin" element={<Verify />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
