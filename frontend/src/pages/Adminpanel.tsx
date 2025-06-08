import { motion } from "framer-motion"

const Adminpanel = () => {
  const stats = [
    { label: "Total Users", value: "1,234" },
    { label: "Active Programs", value: "5" },
    { label: "Mentors", value: "45" },
    { label: "Success Stories", value: "89" }
  ]

  const recentActivities = [
    {
      id: 1,
      user: "Marie Uwimana",
      action: "Completed Tech Skills Program",
      date: "2024-03-15"
    },
    {
      id: 2,
      user: "Grace Mukamana",
      action: "Started Leadership Training",
      date: "2024-03-14"
    },
    {
      id: 3,
      user: "Sarah Niyonsenga",
      action: "Submitted Success Story",
      date: "2024-03-13"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recent Activities */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-500">{activity.action}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Program Management */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Program Management</h2>
              <div className="space-y-4">
                <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Add New Program
                </button>
                <button className="w-full bg-white text-gray-700 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Manage Existing Programs
                </button>
                <button className="w-full bg-white text-gray-700 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Program Analytics
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button className="w-full bg-white text-gray-700 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Manage Users
                </button>
                <button className="w-full bg-white text-gray-700 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Review Applications
                </button>
                <button className="w-full bg-white text-gray-700 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Generate Reports
                </button>
              </div>
            </section>

            {/* System Status */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Server Status</span>
                  <span className="text-green-600">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="text-gray-600">2024-03-15</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Adminpanel
