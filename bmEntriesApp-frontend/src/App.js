import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";  // Import Navbar

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from './pages/Register';
import Unauthorized from "./pages/Unauthorized";
import Success from "./pages/Success";
import HomePage from "./pages/HomaPage";
import ProposalEntry from './pages/ProposalEntry';
import BMGRTEntry from './pages/BMGRTEntry';
import DisbursementEntry from './pages/DisbursementEntry';

import AdminHomePage from './pages/AdminHomePage';
import ProposalEntries from './pages/ProposalEntries';
import BMGRTEntries from './pages/BMGRTEntries';
import DisbursementEntries from './pages/DisbursementEntries';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/success" element={<Success />} />

          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="/proposal-entry" element={
            <ProtectedRoute role="customer">
              <ProposalEntry />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminHomePage />
            </ProtectedRoute>
          } />

          <Route path="/proposal-entries" element={
            <ProtectedRoute role="admin">
              <ProposalEntries />
            </ProtectedRoute>
          } />

          <Route path="/bm-grt-entries" element={
            <ProtectedRoute role="admin">
              <BMGRTEntries />
            </ProtectedRoute>
          } />

          <Route path="/disbursement-entries" element={
            <ProtectedRoute role="admin">
              <DisbursementEntries />
            </ProtectedRoute>
          } />

          <Route path="/bm-grt-entry" element={
            <ProtectedRoute role="customer">
              <BMGRTEntry />
            </ProtectedRoute>
          } />
          <Route path="/disbursement-entry" element={
            <ProtectedRoute role="customer">
              <DisbursementEntry />
            </ProtectedRoute>
          } /> 

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
