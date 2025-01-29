import React from 'react';
import { Outlet } from 'react-router-dom';
import UserTopBar from './UserTopBar';
import Footer from '../../components/Footer';

function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UserTopBar />
      <div className="pt-16 flex-1 flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
