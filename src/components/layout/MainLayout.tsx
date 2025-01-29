import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';

interface MainLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      <Navigation />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
