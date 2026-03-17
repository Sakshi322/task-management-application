import { Trash2, Pencil } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow duration-200 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-medium text-surface-900 text-sm truncate">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          {task.description && (
            <p className="text-sm text-surface-500 line-clamp-2">{task.description}</p>
          )}
          <p className="text-xs text-surface-300 mt-2 font-mono">
            {new Date(task.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id || task.id)}
            className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
