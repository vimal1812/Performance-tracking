import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser } from './lib/mockDb'
import Layout from './components/Layout'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import MemberDashboard from './pages/MemberDashboard'
import TasksPage from './pages/TasksPage'
import PerformanceStats from './pages/PerformanceStats'
import ProjectsPage from './pages/ProjectsPage'
import MeetingsPage from './pages/MeetingsPage'
import UsersManagement from './pages/UsersManagement'

function App() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const session = getCurrentUser();
    if(session) setUser(session);
    
    // Quick polling to refresh session logic (simulating global context)
    const interval = setInterval(() => {
       const s = getCurrentUser();
       setUser(s);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
           user ? (user.system_role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/member" />) : <Navigate to="/login" />
        } />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        
        {/* Protected Admin Routes */}
        {user?.system_role === 'admin' && (
          <Route path="/admin" element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="performance" element={<PerformanceStats />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>
        )}
        
        {/* Protected Member Routes */}
        {user?.system_role === 'member' && (
          <Route path="/member" element={<Layout />}>
             <Route index element={<MemberDashboard />} />
             <Route path="tasks" element={<TasksPage />} />
             <Route path="performance" element={<PerformanceStats />} />
             <Route path="meetings" element={<MeetingsPage />} />
          </Route>
        )}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
