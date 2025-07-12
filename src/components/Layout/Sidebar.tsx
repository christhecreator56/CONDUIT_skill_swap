import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  User, 
  BookOpen, 
  Search, 
  MessageSquare, 
  History,
  X
} from 'lucide-react'
import ClickSpark from '../ClickSpark'
import { useDispatch } from 'react-redux'
import { toggleSidebar } from '../../store/slices/uiSlice'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'My Skills', href: '/skills', icon: BookOpen },
    { name: 'Browse Skills', href: '/browse', icon: Search },
    { name: 'Swap Requests', href: '/swap-requests', icon: MessageSquare },
    { name: 'Swap History', href: '/swap-history', icon: History },
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  const handleCloseSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={handleCloseSidebar}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 discord-sidebar shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-[#2c2f33]">
          <h1 className="text-lg sm:text-xl font-bold text-[#7289da]">CONDuit</h1>
          <button 
            className="lg:hidden p-2 rounded-md text-[#b9bbbe] hover:text-[#ffffff] hover:bg-[#2c2f33] transition-all duration-200 touch-manipulation discord-focus"
            onClick={handleCloseSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3 flex-1 overflow-y-auto discord-scrollbar">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <ClickSpark
                  key={item.name}
                  sparkColor={isActive(item.href) ? "#7289da" : "#b9bbbe"}
                  sparkSize={6}
                  sparkRadius={15}
                  sparkCount={4}
                  duration={300}
                >
                  <Link
                    to={item.href}
                    onClick={handleCloseSidebar}
                    className={`
                      nav-item ${isActive(item.href) ? 'active' : ''} discord-focus
                    `}
                  >
                    <Icon className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive(item.href)
                        ? 'text-white'
                        : 'text-[#b9bbbe] group-hover:text-[#ffffff]'
                      }
                    `} />
                    {item.name}
                  </Link>
                </ClickSpark>
              )
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2c2f33] bg-[#2B2D31]">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-[#7289da] rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#ffffff]">Skill Exchange</p>
              <p className="text-xs text-[#b9bbbe]">Connect & Learn</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 