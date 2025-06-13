import { motion } from "framer-motion"
import assets from "../assets/assets"

const Community = () => {
  const events = [
    {
      title: "Monthly Meetup",
      date: "March 25, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Virtual",
      description: "Join us for our monthly community meetup featuring guest speakers and networking opportunities."
    },
    {
      title: "Coding Workshop",
      date: "April 2, 2024",
      time: "10:00 AM - 2:00 PM",
      location: "Tech Hub",
      description: "Hands-on coding workshop focusing on web development fundamentals."
    },
    {
      title: "Career Fair",
      date: "April 15, 2024",
      time: "11:00 AM - 4:00 PM",
      location: "Convention Center",
      description: "Connect with tech companies and explore career opportunities."
    }
  ]

  const features = [
    {
      title: "Mentorship Program",
      description: "Connect with experienced professionals in the tech industry for guidance and support.",
      icon: "👥"
    },
    {
      title: "Study Groups",
      description: "Join study groups to learn and practice coding together with peers.",
      icon: "📚"
    },
    {
      title: "Job Board",
      description: "Access exclusive job opportunities from our partner companies.",
      icon: "💼"
    },
    {
      title: "Discussion Forums",
      description: "Engage in meaningful discussions with community members.",
      icon: "💬"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20"
        style={{ backgroundImage: `url(${assets.communitybg2})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Our <span className="text-blue-600">Community</span>
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Join a supportive network of women in technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us for these exciting community events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span> {event.date}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Register Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-700 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
              Be part of a supportive network of women in technology. Connect, learn, and grow together.
            </p>
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Sign Up Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Community 