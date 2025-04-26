import React, { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/helpers';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
}) => {
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('ohno', error)
      setErrors({ 
        general: 'Invalid e-mail or password'
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-600 mt-2">Sign in to manage your wishlists</p>
      </div>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail size={18} />}
          fullWidth
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock size={18} />}
          fullWidth
        />
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          fullWidth
          leftIcon={<LogIn size={18} />}
        >
          Sign In
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;