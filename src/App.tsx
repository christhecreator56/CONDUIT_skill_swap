import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import GlobalNavbar from './components/Layout/GlobalNavbar';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SkillsPage from './pages/Skills/SkillsPage';
import BrowsePage from './pages/Browse/BrowsePage';
import SwapRequestsPage from './pages/Swaps/SwapRequestsPage';
import SwapHistoryPage from './pages/Swaps/SwapHistoryPage';
import AdminPanelPage from './pages/Dashboard/AdminPanelPage';
import { AnimatePresence, motion } from 'framer-motion';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar - appears on all pages */}
      <GlobalNavbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/login" element={!isAuthenticated ? <PageTransition><LoginPage /></PageTransition> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <PageTransition><RegisterPage /></PageTransition> : <Navigate to="/dashboard" />} />
          <Route path="/admin" element={<PageTransition><AdminPanelPage /></PageTransition>} />

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={isAuthenticated ? <PageTransition><DashboardPage /></PageTransition> : <Navigate to="/login" />} />
            <Route path="profile" element={isAuthenticated ? <PageTransition><ProfilePage /></PageTransition> : <Navigate to="/login" />} />
            <Route path="skills" element={isAuthenticated ? <PageTransition><SkillsPage /></PageTransition> : <Navigate to="/login" />} />
            <Route path="browse" element={isAuthenticated ? <PageTransition><BrowsePage /></PageTransition> : <Navigate to="/login" />} />
            <Route path="swap-requests" element={isAuthenticated ? <PageTransition><SwapRequestsPage /></PageTransition> : <Navigate to="/login" />} />
            <Route path="swap-history" element={isAuthenticated ? <PageTransition><SwapHistoryPage /></PageTransition> : <Navigate to="/login" />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App; 