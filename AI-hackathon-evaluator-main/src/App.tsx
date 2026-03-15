/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BackendProvider, useBackend } from './context/BackendContext';
import { ToastProvider } from './components/ui/toast';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TeamDashboard from './pages/TeamDashboard';
import { Loader2 } from 'lucide-react';

function SessionGate({ children }: { children: React.ReactNode }) {
  const { sessionLoading } = useBackend();

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020205]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-gray-400 font-rajdhani text-lg">Restoring session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function ProtectedRoute({ children, role }: { children: React.ReactNode, role: 'admin' | 'team' }) {
  const { currentUser } = useBackend();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
    <ToastProvider>
      <BackendProvider>
        <Router>
          <SessionGate>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute role="team">
                      <TeamDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </SessionGate>
        </Router>
      </BackendProvider>
    </ToastProvider>
    </ErrorBoundary>
  );
}
