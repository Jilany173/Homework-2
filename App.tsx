
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DayDetail from './components/DayDetail';
import CourseSelection from './components/CourseSelection';
import Layout from './components/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import ContentManager from './components/Admin/ContentManager';
import HomeworkReview from './components/Admin/HomeworkReview';
import UserManager from './components/Admin/UserManager';
import BatchManager from './components/Admin/BatchManager';
import TeacherLayout from './components/Teacher/TeacherLayout';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import ClassControl from './components/Teacher/ClassControl';
import PracticeZone from './components/PracticeZone';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBatchExpired, setIsBatchExpired] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      // ১. বর্তমান সেশন চেক করা
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, batch_id')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          localStorage.setItem('userRole', profile.role);
          if (profile.batch_id) localStorage.setItem('userBatchId', profile.batch_id);
          setUserRole(profile.role);
          setIsAuthenticated(true);
        }
      }

      // ২. অথেন্টিকেশন স্টেট চেঞ্জ লিসেন করা
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserRole(null);
          localStorage.clear();
        } else if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          // রোল সেট করা হবে Login component থেকে অথবা রিফ্রেশে উপরের useEffect থেকে
        }
      });

      setIsLoading(false);
      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const handleLogin = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setIsBatchExpired(false);
  };

  const handleLogout = async () => {
    // স্টেট আগে ক্লিয়ার করা যাতে রিডাইরেক্ট লুপ না হয়
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.clear();
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-[0_0_40px_rgba(37,99,235,0.3)]"></div>
          <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={userRole === 'admin' || userRole === 'Admin' || userRole === 'Super Admin' ? "/admin" : userRole === 'teacher' || userRole === 'Teacher' ? "/teacher" : "/"} replace />} 
        />
        
        {/* Student Routes */}
        <Route element={isAuthenticated && (userRole === 'student' || userRole === 'Student') ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<CourseSelection />} />
          <Route path="/practice-zone" element={<PracticeZone />} />
          <Route path="/course/:courseType/:mode" element={isBatchExpired ? <Navigate to="/expired" /> : <Dashboard />} />
          <Route path="/course/:courseType/:mode/day/:dayId" element={isBatchExpired ? <Navigate to="/expired" /> : <DayDetail />} />
          <Route path="/expired" element={
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6 border-4 border-red-100">🔒</div>
              <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase">Batch Access Expired</h1>
              <p className="max-w-md text-slate-500 font-medium">Your course duration has ended. Please contact the branch management.</p>
              <button onClick={handleLogout} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">Back to Login</button>
            </div>
          } />
        </Route>

        {/* Admin Routes */}
        <Route element={isAuthenticated && (userRole === 'admin' || userRole === 'Admin' || userRole === 'Super Admin') ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<ContentManager />} />
          <Route path="/admin/users" element={<UserManager />} />
          <Route path="/admin/batches" element={<BatchManager />} />
          <Route path="/admin/review" element={<HomeworkReview />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={isAuthenticated && (userRole === 'teacher' || userRole === 'Teacher') ? <TeacherLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/class-control" element={<ClassControl />} />
          <Route path="/teacher/review" element={<HomeworkReview />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
