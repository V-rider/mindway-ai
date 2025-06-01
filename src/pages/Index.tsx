
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Mindway AI</h1>
        <p className="text-xl text-gray-600 mb-8">Math Test Analysis & Learning Pathways</p>
        <div className="space-x-4">
          <Link to="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
