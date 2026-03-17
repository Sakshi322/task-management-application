import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { CheckSquare } from 'lucide-react'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-50">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-center gap-2 mb-8">
          <CheckSquare size={24} className="text-brand-600" />
          <span className="text-xl font-semibold tracking-tight">TaskFlow</span>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-surface-900 mb-1">Create account</h1>
          <p className="text-sm text-surface-500 mb-6">Start managing your tasks</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Sakshi"
                className="input"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
