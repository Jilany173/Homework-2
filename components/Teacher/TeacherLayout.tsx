
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

interface TeacherLayoutProps {
  onLogout: () => void;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/teacher', icon: '🏠' },
    { label: 'Conduct Class', path: '/teacher/class-control', icon: '⚡' },
    { label: 'Evaluate Homework', path: '/teacher/review', icon: '📝' },
  ];

  const handleLogoutClick = async () => {
    if (window.confirm("Confirm logout from Teacher Portal?")) {
      await onLogout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 w-full h-16 bg-slate-900 flex items-center justify-between px-6 z-[60] shadow-xl">
        <span className="text-white font-black tracking-tighter">HEXA'S <span className="text-blue-500 text-xs uppercase ml-1">Faculty</span></span>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogoutClick}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-400 flex flex-col 
        transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-slate-800">
           <h1 className="text-white font-black text-2xl tracking-tighter">HEXA'S</h1>
           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Faculty Interface</p>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={handleLogoutClick} 
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-red-950/40 hover:text-red-400 transition-all border border-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 pt-20 lg:pt-10 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
