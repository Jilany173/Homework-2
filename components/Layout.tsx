
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    if (window.confirm("Confirm sign out from portal?")) {
      await onLogout();
      navigate('/login', { replace: true });
    }
  };

  const username = localStorage.getItem('username') || 'Student';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-300">
      {/* Responsive Header */}
      <header className="px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-colors">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex flex-col group transition-transform active:scale-95">
            <div className="flex items-baseline">
              <span className="text-slate-900 font-black text-2xl tracking-tighter group-hover:text-blue-600 transition-colors">HEXA'S</span>
              <span className="ml-1 text-red-600 text-[10px] font-bold">🎓</span>
            </div>
            <span className="text-red-600 font-bold text-[9px] tracking-[0.3em] -mt-1 uppercase opacity-80">Zindabazar</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
            <div className="hidden sm:block text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{username}</p>
              <p className="text-[11px] text-blue-600 font-bold uppercase tracking-tighter">Student Panel</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-200 shadow-sm overflow-hidden bg-white ring-2 ring-slate-100 transition-all">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                alt="User profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Dedicated Logout Button */}
          <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-4">
        <Outlet />
      </main>

      {/* Sticky footer */}
      <footer className="py-8 text-center bg-transparent border-t border-slate-200/40 mt-auto">
        <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] opacity-40">
          Academic Management System • HEXA'S Zindabazar Portal
        </p>
      </footer>
    </div>
  );
};

export default Layout;
