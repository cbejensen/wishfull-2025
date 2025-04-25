import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Dashboard from './pages/Dashboard';
import Friends from './pages/Friends';
import Auth from './pages/Auth';
import Header from './components/layout/Header';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [activePage, setActivePage] = useState<'wishlist' | 'friends'>('wishlist');
  
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      setShowAuth(true);
    } else if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (showAuth) {
    return <Auth onLoginSuccess={() => setShowAuth(false)} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddWishClick={() => {}} 
        onLoginClick={() => setShowAuth(true)}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      {activePage === 'wishlist' ? (
        <Dashboard onLoginClick={() => setShowAuth(true)} />
      ) : (
        <Friends />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AppContent />
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;