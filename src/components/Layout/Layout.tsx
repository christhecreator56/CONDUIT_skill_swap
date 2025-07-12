import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import Sidebar from './Sidebar'
import type { UIState } from '../../store/slices/uiSlice'

const Layout = () => {
  const sidebarIsOpen = useSelector((state: RootState) => {
    const ui = state.ui as UIState | undefined
    return ui?.sidebar?.isOpen ?? false
  })

  return (
    <div className="flex h-screen bg-[#313338]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarIsOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#313338] pt-20 sm:pt-24 discord-scrollbar">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 