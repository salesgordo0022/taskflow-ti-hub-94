
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
