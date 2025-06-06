import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Mentordashboard = () => {
  const mentees = [
    {
      id: 1,
      name: "Marie Uwimana",
      program: "Tech Skills Development",
      progress: 75,
      lastMeeting: "2024-03-15",
      nextMeeting: "2024-03-22"
    },
    {
      id: 2,
      name: "Grace Mukamana",
      program: "Leadership Training",
      progress: 60,
      lastMeeting: "2024-03-14",
      nextMeeting: "2024-03-21"
    },
    {
      id: 3,
      name: "Sarah Niyonsenga",
      program: "Entrepreneurship",
      progress: 85,
      lastMeeting: "2024-03-13",
      nextMeeting: "2024-03-20"
    }
  ]

  const upcomingMeetings = [
    {
      id: 1,
      mentee: "Marie Uwimana",
      date: "2024-03-22",
      time: "10:00 AM",
      topic: "Career Development Planning"
    },
    {
      id: 2,
      mentee: "Grace Mukamana",
      date: "2024-03-21",
      time: "2:00 PM",
      topic: "Leadership Challenges"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Mentees Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Mentees</h2>
              <div className="space-y-6">
                {mentees.map((mentee) => (
                  <motion.div
                    key={mentee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{mentee.name}</h3>
                        <p className="text-sm text-gray-500">{mentee.program}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Progress</p>
                        <p className="font-medium text-purple-600">{mentee.progress}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Last Meeting: {mentee.lastMeeting}</p>
                      <p>Next Meeting: {mentee.nextMeeting}</p>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button className="text-sm text-purple-600 hover:text-purple-700">
                        Schedule Meeting
                      </button>
                      <button className="text-sm text-purple-600 hover:text-purple-700">
                        View Progress
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Upcoming Meetings */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Meetings</h2>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <h3 className="font-medium text-gray-900">{meeting.mentee}</h3>
                    <p className="text-sm text-gray-500">{meeting.topic}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{meeting.date} at {meeting.time}</p>
                    </div>
                    <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Schedule New Meeting
                </button>
                <button className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                  Add New Mentee
                </button>
                <button className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                  View Resources
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentordashboard
