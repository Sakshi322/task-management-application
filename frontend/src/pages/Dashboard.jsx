import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'

const STATUSES = ['all', 'pending', 'in-progress', 'completed']

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (statusFilter !== 'all') params.status = statusFilter
      if (search.trim()) params.search = search.trim()

      const { data } = await api.get('/tasks', { params })
      setTasks(data.data.tasks)
      setPagination(data.data.pagination)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleStatusFilter = (s) => {
    setStatusFilter(s)
    setPage(1)
  }

  const handleCreate = async (form) => {
    setFormLoading(true)
    try {
      await api.post('/tasks', form)
      toast.success('Task created')
      setShowForm(false)
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (form) => {
    setFormLoading(true)
    try {
      await api.put(`/tasks/${editingTask.id || editingTask._id}`, form)
      toast.success('Task updated')
      setEditingTask(null)
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success('Task deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const openCreate = () => { setEditingTask(null); setShowForm(true) }
  const openEdit = (task) => { setEditingTask(task); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditingTask(null) }

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-surface-900">My tasks</h1>
            <p className="text-sm text-surface-400 mt-0.5">{pagination.total} total tasks</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
            <Plus size={16} />
            <span>New task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input pl-9"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-lg p-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-800'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Task grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
              <Filter size={20} className="text-surface-300" />
            </div>
            <p className="text-surface-500 font-medium">No tasks found</p>
            <p className="text-surface-400 text-sm mt-1">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first task'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id || task._id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!pagination.hasPrevPage}
              className="btn-secondary p-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-surface-500 font-mono px-2">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
              className="btn-secondary p-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={closeForm}
          loading={formLoading}
        />
      )}
    </div>
  )
}

export default Dashboard
