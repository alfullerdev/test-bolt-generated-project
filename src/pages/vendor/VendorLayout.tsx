import React from 'react';
import { Outlet } from 'react-router-dom';
import VendorTopBar from './VendorTopBar';
import Footer from '../../components/Footer';

function VendorLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <VendorTopBar />
      <div className="pt-16 flex-1 flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default VendorLayout;
