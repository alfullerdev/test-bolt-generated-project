import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../components/AdminDashboard/TopBar';
import Sidebar from '../../components/AdminDashboard/Sidebar';
import Footer from '../../components/Footer';
import ErrorBoundary from '../../components/ErrorBoundary';

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`pt-16 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <main className="min-h-[calc(100vh-64px)]">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;
