import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, loading }) {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  console.log("ProtectedRoute decision:", {
    userData: !!userData,
    path: location.pathname
  });

  if (!userData) {
    console.log("No user data found in ProtectedRoute. Redirecting to auth.");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("User authenticated, rendering protected route.");
  return children;
}

export default ProtectedRoute;
