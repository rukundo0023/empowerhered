import { motion } from "framer-motion";
import assets from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Communication = () => {
  const modules = [
    {
      title: "Digital Communication Basics",
      description: "Understand how to communicate effectively in online environments.",
      topics: [
        "Email Etiquette",
        "Professional Messaging",
        "Digital Body Language",
        "Tone and Clarity",
        "Cross-cultural Communication"
      ]
    },
    {
      title: "Collaboration Tools",
      description: "Learn to use modern tools for online teamwork and productivity.",
      topics: [
        "Google Drive & Docs",
        "Microsoft Teams",
        "Zoom & Google Meet",
        "Task Management Tools (e.g., Trello)",
        "File Sharing & Version Control"
      ]
    },
    {
      title: "Virtual Meeting Skills",
      description: "Gain confidence in organizing and participating in virtual meetings.",
      topics: [
        "Setting Agendas",
        "Speaking Confidently Online",
        "Engaging Participants",
        "Using Breakout Rooms",
        "Follow-up Communication"
      ]
    },
    {
      title: "Team Communication Strategies",
      description: "Develop techniques for leading and working within remote teams.",
      topics: [
        "Roles & Responsibilities",
        "Feedback Mechanisms",
        "Collaboration Norms",
        "Time Zone Management",
        "Respectful Dialogue"
      ]
    },
    {
      title: "Online Safety & Professionalism",
      description: "Maintain security, professionalism, and trust in digital spaces.",
      topics: [
        "Data Privacy",
        "Cyber Hygiene",
        "Professional Profiles",
        "Building Digital Trust",
        "Avoiding Miscommunication"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-700 text-white"
      style ={{ backgroundImage: `url(${assets.communicationbg})`, backgroundSize: "cover", backgroundPosition: "center"  }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-4 text-blue-500"><span className="text-black">Online Communication</span> & Collaboration</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Empowering young women in Rwanda to communicate and work effectively in the digital world.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Overview</h2>
            <p className="text-sm text-gray-600 mb-6">
              This program equips participants with the digital communication and collaboration skills
              necessary for modern work and learning environments. Through interactive sessions and
              practical projects, you'll become confident using tools and strategies to collaborate online.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 text-xl">💬</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Effective Messaging</h3>
                  <p className="text-xs text-gray-600">Communicate clearly and professionally</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 text-xl">🛠️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Tool Proficiency</h3>
                  <p className="text-xs text-gray-600">Master collaborative digital platforms</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 text-xl">🌐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Digital Citizenship</h3>
                  <p className="text-xs text-gray-600">Safe, respectful, and effective online behavior</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="text-gray-900 font-medium">8 weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Schedule:</span>
                <span className="text-gray-900 font-medium">Tue & Thu, 3PM-5PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900 font-medium">Online (Zoom)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prerequisites:</span>
                <span className="text-gray-900 font-medium">Basic computer skills</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Certification:</span>
                <span className="text-gray-900 font-medium">Yes</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                Apply Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Curriculum Modules */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Curriculum Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center text-gray-700">
                      <svg
                        className="h-4 w-4 text-gray-700 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Collaborate Confidently?
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
            Become part of Rwanda’s growing network of empowered young women who are ready to
            succeed in digital spaces. This program will boost your confidence and competence in
            remote work, communication, and online professionalism.
          </p>
          <div className="flex justify-center space-x-4">
            <NavLink to ="/resources/learning">
            <button className="bg-gray-700 text-white py-2 px-6 rounded-lg text-sm hover:bg-gray-800 transition-colors">
              Start Learning
            </button>
            </NavLink>
            <button className="bg-white text-gray-700 py-2 px-6 rounded-lg text-sm border border-gray-700 hover:bg-gray-50 transition-colors">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Communication;
