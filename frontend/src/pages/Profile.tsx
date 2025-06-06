import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const profileData = {
    name: user?.name || "User Name",
    email: user?.email || "user@example.com",
    role: "Student",
    joinDate: "January 2024",
    enrolledPrograms: [
      {
        id: 1,
        name: "Coding Bootcamp",
        progress: 75,
        status: "In Progress"
      },
      {
        id: 2,
        name: "Leadership Training",
        progress: 30,
        status: "In Progress"
      }
    ],
    achievements: [
      {
        id: 1,
        title: "First Project Completion",
        date: "February 2024",
        description: "Successfully completed the first coding project"
      },
      {
        id: 2,
        title: "Community Contribution",
        date: "March 2024",
        description: "Actively participated in community events"
      }
    ],
    skills: [
      "JavaScript",
      "React",
      "HTML/CSS",
      "Leadership",
      "Project Management"
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 h-32"></div>
            <div className="px-8 py-6">
              <div className="flex items-center">
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
                  {profileData.name.charAt(0)}
                </div>
                <div className="ml-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                    <p className="mt-1 text-base text-gray-600">{profileData.role}</p>
                    <p className="mt-1 text-sm text-gray-500">Member since {profileData.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("programs")}
                className={`${
                  activeTab === "programs"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Programs
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`${
                  activeTab === "achievements"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Achievements
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1 text-sm text-gray-900">{profileData.role}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === "programs" && (
            <div className="space-y-6">
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Programs</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{profileData.enrolledPrograms.length}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Achievements</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{profileData.achievements.length}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Skills</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{profileData.skills.length}</p>
                </div>
              </div>
              {profileData.enrolledPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{program.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Status: {program.status}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {program.progress}% Complete
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${program.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-900">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profileData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-sm font-medium text-purple-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-900">Enrolled Programs</h3>
                <div className="mt-2 space-y-4">
                  {profileData.enrolledPrograms.map((program) => (
                    <div key={program.id} className="rounded-lg bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-900">{program.name}</h4>
                        <span className="text-sm font-medium text-purple-600">{program.progress}%</span>
                      </div>
                      <div className="mt-2">
                        <div className="h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-1.5 rounded-full bg-purple-600"
                            style={{ width: `${program.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-900">Achievements</h3>
                <div className="mt-2 space-y-4">
                  {profileData.achievements.map((achievement) => (
                    <div key={achievement.id} className="rounded-lg bg-white p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                          <svg
                            className="h-4 w-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-900">{achievement.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile 