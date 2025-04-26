import { Gift, LogOut, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface HeaderProps {
  // onAddWishClick: () => void;
  onLoginClick: () => void;
  activePage: 'wishlist' | 'friends';
  onNavigate: (page: 'wishlist' | 'friends') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  // onAddWishClick, 
  onLoginClick,
  activePage,
  onNavigate
}) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center text-purple-600">
                <Gift size={28} />
                <span className="ml-2 text-xl font-bold">Wishfull</span>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onNavigate('wishlist')}
                className={`${
                  activePage === 'wishlist'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                My Wishes
              </button>
              <button
                onClick={() => onNavigate('friends')}
                className={`${
                  activePage === 'friends'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Friends
              </button>
            </nav>
          </div>
          
          {/* User menu and mobile menu button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                {/* Add wish button */}
                {/* <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={16} />}
                  className="mr-4"
                  onClick={onAddWishClick}
                >
                  Add Wish
                </Button> */}
                
                {/* User button */}
                <div className="ml-3 relative hidden sm:block">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      id="user-menu-button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      {currentUser?.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={currentUser.avatar}
                          alt={currentUser.display_name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                          {currentUser?.display_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      {/* <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </a> */}
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={onLoginClick}
              >
                Sign In
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                onNavigate('wishlist');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left ${
                activePage === 'wishlist'
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              My Wishes
            </button>
            <button
              onClick={() => {
                onNavigate('friends');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left ${
                activePage === 'friends'
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Friends
            </button>
          </div>
          
          {isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {currentUser?.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={currentUser.avatar}
                      alt={currentUser.display_name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                      {currentUser?.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUser?.display_name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {/* <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </a> */}
                <button
                  className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;