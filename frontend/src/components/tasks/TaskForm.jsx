import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STATUSES = ['pending', 'in-progress', 'completed']

const TaskForm = ({ task, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
  })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
      })
    }
  }, [task])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-surface-900">
            {task ? 'Edit task' : 'New task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="input"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details (optional)"
              className="input resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">
              Status
            </label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
