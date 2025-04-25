import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { loading } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center text-purple-600 mb-4">
            <Gift size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wishfull</h1>
          <p className="text-xl text-gray-600">Create and share your wishes with friends and family</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-2 border-b">
            <button
              className={`py-4 text-sm font-medium ${
                activeTab === 'login'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
              disabled={loading}
            >
              Sign In
            </button>
            <button
              className={`py-4 text-sm font-medium ${
                activeTab === 'register'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
              disabled={loading}
            >
              Create Account
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'login' ? (
              <LoginForm
                onSuccess={onLoginSuccess}
                onRegisterClick={() => setActiveTab('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={onLoginSuccess}
                onLoginClick={() => setActiveTab('login')}
              />
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 Wishfull. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;