import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Layout from './components/Layout/Layout'
import GlobalNavbar from './components/Layout/GlobalNavbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ProfilePage from './pages/Profile/ProfilePage'
import SkillsPage from './pages/Skills/SkillsPage'
import BrowsePage from './pages/Browse/BrowsePage'
import SwapRequestsPage from './pages/Swaps/SwapRequestsPage'
import SwapHistoryPage from './pages/Swaps/SwapHistoryPage'
import AdminPanelPage from './pages/Dashboard/AdminPanelPage';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar - appears on all pages */}
      <GlobalNavbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="skills" element={isAuthenticated ? <SkillsPage /> : <Navigate to="/login" />} />
          <Route path="browse" element={isAuthenticated ? <BrowsePage /> : <Navigate to="/login" />} />
          <Route path="swap-requests" element={isAuthenticated ? <SwapRequestsPage /> : <Navigate to="/login" />} />
          <Route path="swap-history" element={isAuthenticated ? <SwapHistoryPage /> : <Navigate to="/login" />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App 