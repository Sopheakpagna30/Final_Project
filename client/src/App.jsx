import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx'; // <--- Make sure to import SocketProvider
import LoginForm from './components/Auth/LoginForm.jsx';
import RegisterForm from './components/Auth/RegisterForm.jsx';
import ChatApp from './components/Chat/ChatApp.jsx';

const AuthRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If the user is logged in, they should be redirected to the /chat route
  if (user) {
    return <Navigate to="/chat" />;
  }

  // If not logged in, render the login/register forms based on the URL
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      {/* If neither /login nor /register matches, redirect to /login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* The /chat route. ChatApp needs SocketProvider, so wrap it here. */}
          <Route
            path="/chat"
            element={
              <SocketProvider> {/* <--- SocketProvider now correctly wraps ChatApp */}
                <ChatApp />
              </SocketProvider>
            }
          />
          {/* All other routes will be handled by AuthRoutes (e.g., /, /login, /register) */}
          <Route path="/*" element={<AuthRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;