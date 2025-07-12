import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Bell, User, LogOut } from 'lucide-react'
import { RootState } from '../../store/store'
import { logout } from '../../store/slices/authSlice'
import { useState, useEffect } from 'react'
import { authAPI } from '../../api/auth'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header 
      className={`transition-all duration-500 ease-out ${
        isScrolled 
          ? 'fixed top-4 left-4 right-4 z-50 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/80 border border-white/30' 
          : 'bg-transparent'
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
            CONDuit
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200">
            <Bell className="h-5 w-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <img
                src={user?.profilePhoto || authAPI.generateAvatarUrl(user?.firstName || '', user?.lastName || '')}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/40 hover:ring-white/60 transition-all duration-200 shadow-sm"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50/60 rounded-xl transition-all duration-200"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 