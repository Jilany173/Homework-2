
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'User Management', path: '/admin/users', icon: '👥' },
    { label: 'Batch Settings', path: '/admin/batches', icon: '📅' },
    { label: 'Content Manager', path: '/admin/content', icon: '📝' },
    { label: 'Test Library', path: '/admin/tests', icon: '🎧' },
    { label: 'Upload New Test', path: '/admin/upload-test', icon: '📤' },
    { label: 'Evaluate Submissions', path: '/admin/review', icon: '✅' },
  ];

  const handleAdminLogout = async () => {
    if (window.confirm("Confirm logout from Admin Portal?")) {
      await onLogout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative transition-colors duration-300">
      {/* Mobile Top Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-[60] shadow-xl">
        <div className="flex items-baseline">
          <span className="text-white font-black text-xl tracking-tighter">HEXA'S</span>
          <span className="ml-1 text-red-500 text-[10px] font-bold uppercase">Adm</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-400 flex flex-col 
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-baseline">
            <span className="text-white font-black text-2xl tracking-tighter">HEXA'S</span>
            <span className="ml-1 text-red-500 text-[11px] font-bold uppercase tracking-widest">Admin</span>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Management Hub</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40'
                : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={handleAdminLogout} className="w-full py-4 rounded-2xl bg-slate-800/50 hover:bg-red-950/40 hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800">
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 lg:ml-72 pt-20 lg:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
