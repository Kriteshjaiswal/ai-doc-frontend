import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SearchCommand from './SearchCommand';
import UserDetailDrawer from './user/UserDetailDrawer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const { user, refreshProfile } = useAuth();

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setProfileDrawerOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-[72px]">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenProfile={() => setProfileDrawerOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] w-full mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      <SearchCommand isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Global Profile & Account Details Drawer */}
      <UserDetailDrawer
        userId={user?.id}
        currentUserId={user?.id}
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onUserUpdated={refreshProfile}
      />
    </div>
  );
}
