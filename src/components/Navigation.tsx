import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const isSignInPage = location.pathname === '/signin';
  const isVendorSignup = location.pathname === '/signup';
  const isDevelopersPage = location.pathname === '/developers';

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-200 ${
      hasScrolled || isDevelopersPage ? 'bg-white shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" onClick={handleLinkClick} className="flex items-center">
            <Globe2 className={`h-8 w-8 ${hasScrolled || isDevelopersPage ? 'text-primary' : (isSignInPage || isVendorSignup) ? 'text-white' : 'text-white'}`} />
            <span className={`ml-2 text-xl font-bold ${hasScrolled || isDevelopersPage ? 'gradient-text' : (isSignInPage || isVendorSignup) ? 'text-white' : 'text-white'}`}>
              Bev.Merch.Food
            </span>
          </Link>
          
          {/* Mobile/Tablet menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              hasScrolled || isDevelopersPage
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/products" className={`${
              hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
            }`}>Products</Link>
            <Link to="/solutions" className={`${
              hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
            }`}>Solutions</Link>
            <Link to="/developers" className={`${
              hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
            }`}>Developers</Link>
            <Link to="/resources" className={`${
              hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
            }`}>Resources</Link>
            <Link to="/pricing" className={`${
              hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
            }`}>Pricing</Link>
          </div>
          <div className="hidden lg:flex items-center">
            <Link 
              to="/signin" 
              className="border border-white text-white px-6 py-2 rounded-full hover:bg-white/10 transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet menu */}
      {isMenuOpen && (
        <div className={`lg:hidden ${
          hasScrolled || isDevelopersPage ? 'bg-white border-b border-gray-100' : 'bg-black/90 backdrop-blur-md'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
            <Link 
              to="/products" 
              onClick={handleLinkClick}
              className={`block py-2 text-lg ${
                hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/solutions" 
              onClick={handleLinkClick}
              className={`block py-2 text-lg ${
                hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Solutions
            </Link>
            <Link 
              to="/developers" 
              onClick={handleLinkClick}
              className={`block py-2 text-lg ${
                hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Developers
            </Link>
            <Link 
              to="/resources" 
              onClick={handleLinkClick}
              className={`block py-2 text-lg ${
                hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Resources
            </Link>
            <Link 
              to="/pricing" 
              onClick={handleLinkClick}
              className={`block py-2 text-lg ${
                hasScrolled || isDevelopersPage ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Pricing
            </Link>
            <div className="pt-3 border-t border-white/20">
              <Link 
                to="/signin" 
                onClick={handleLinkClick}
                className="block py-2 text-lg text-center border border-white text-white rounded-full hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
