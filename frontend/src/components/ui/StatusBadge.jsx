const STATUS_STYLES = {
  pending:     'bg-amber-50 text-amber-700 border-amber-100',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-100',
  completed:   'bg-green-50 text-green-700 border-green-100',
}

const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[status] || ''}`}>
    {STATUS_LABELS[status] || status}
  </span>
)

export default StatusBadge
