import ClickSpark from '../../components/ClickSpark'

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to your skill exchange dashboard</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <ClickSpark
          sparkColor="#3b82f6"
          sparkSize={8}
          sparkRadius={20}
          sparkCount={6}
          duration={400}
        >
          <div className="card cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">My Skills</h3>
            <p className="text-3xl font-bold text-primary-600">5</p>
            <p className="text-sm text-gray-400">Skills available for exchange</p>
          </div>
        </ClickSpark>
        
        <ClickSpark
          sparkColor="#f59e0b"
          sparkSize={8}
          sparkRadius={20}
          sparkCount={6}
          duration={400}
        >
          <div className="card cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-accent-600">2</p>
            <p className="text-sm text-gray-400">Awaiting your response</p>
          </div>
        </ClickSpark>
        
        <ClickSpark
          sparkColor="#059669"
          sparkSize={8}
          sparkRadius={20}
          sparkCount={6}
          duration={400}
        >
          <div className="card cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Completed Swaps</h3>
            <p className="text-3xl font-bold text-secondary-600">12</p>
            <p className="text-sm text-gray-400">Successful exchanges</p>
          </div>
        </ClickSpark>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <p className="text-gray-400">No recent activity to display.</p>
      </div>
    </div>
  )
}

export default DashboardPage 