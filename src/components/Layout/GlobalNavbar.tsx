import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Bell, User, LogOut, Home, BookOpen, Search, MessageSquare, History, X } from 'lucide-react'
import { RootState } from '../../store/store'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { useState, useEffect } from 'react'

const GlobalNavbar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar())
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, protected: true },
    { name: 'Profile', href: '/profile', icon: User, protected: true },
    { name: 'My Skills', href: '/skills', icon: BookOpen, protected: true },
    { name: 'Browse Skills', href: '/browse', icon: Search, protected: true },
    { name: 'Swap Requests', href: '/swap-requests', icon: MessageSquare, protected: true },
    { name: 'Swap History', href: '/swap-history', icon: History, protected: true },
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <>
      <header 
        className={`transition-all duration-500 ease-out fixed top-2 left-2 right-2 z-50 rounded-lg shadow-2xl bg-[#1a1b1e]/95 backdrop-blur-xl border border-[#2c2f33]/50`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile menu button */}
          <button
            onClick={isAuthenticated ? handleSidebarToggle : () => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-md text-[#b9bbbe] hover:text-[#ffffff] hover:bg-[#2c2f33] transition-all duration-200 touch-manipulation discord-focus"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/"} 
              className="text-lg sm:text-xl font-bold text-[#7289da] hover:text-[#5b6eae] transition-colors duration-200 touch-manipulation discord-focus"
            >
              CONDuit
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`nav-item ${isActive(item.href) ? 'active' : ''} discord-focus`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`nav-item ${isActive('/') ? 'active' : ''} discord-focus`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="nav-item discord-focus"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated && (
              <>
                {/* Notifications */}
                <button className="p-2 sm:p-3 text-[#b9bbbe] hover:text-[#ffffff] hover:bg-[#2c2f33] rounded-md transition-all duration-200 touch-manipulation discord-focus">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-2 ring-[#2c2f33] hover:ring-[#7289da] transition-all duration-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-8 w-8 sm:h-9 sm:w-9 bg-[#7289da] rounded-full flex items-center justify-center ring-2 ring-[#2c2f33] hover:ring-[#5b6eae] transition-all duration-200 shadow-sm">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-[#ffffff]">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 sm:p-3 text-[#b9bbbe] hover:text-[#f04747] hover:bg-[#2c2f33] rounded-md transition-all duration-200 touch-manipulation discord-focus"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu - only for non-authenticated users */}
        {isMobileMenuOpen && !isAuthenticated && (
          <div className="lg:hidden border-t border-[#2c2f33] mt-2 pt-4 pb-4 discord-fade-in">
            <nav className="space-y-2 px-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-item ${isActive('/') ? 'active' : ''} discord-focus`}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Home</span>
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-item discord-focus"
              >
                <User className="h-5 w-5 mr-3" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary text-sm px-4 py-3 flex items-center"
              >
                <User className="h-5 w-5 mr-3" />
                <span>Sign Up</span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

export default GlobalNavbar 