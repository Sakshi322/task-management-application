import { useAuth } from '../../context/AuthContext'
import { LogOut, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare size={20} className="text-brand-600" />
          <span className="font-semibold text-surface-900 tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-surface-500 hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900 transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
