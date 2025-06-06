import { motion } from "framer-motion"

const Stories = () => {
  const stories = [
    {
      id: 1,
      title: "From Student to Tech Leader",
      author: "Marie Uwimana",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      excerpt: "How the Tech Skills Development program helped me launch my career in technology...",
      date: "March 15, 2024"
    },
    {
      id: 2,
      title: "Breaking Barriers in Leadership",
      author: "Grace Mukamana",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      excerpt: "My journey from a shy student to a confident leader in the tech industry...",
      date: "March 10, 2024"
    },
    {
      id: 3,
      title: "Building a Tech Business in Rwanda",
      author: "Sarah Niyonsenga",
      role: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      excerpt: "How the Entrepreneurship program helped me start my own tech company...",
      date: "March 5, 2024"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover how our programs have transformed the lives of young women in Rwanda
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-purple-600 mb-2">{story.date}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{story.excerpt}</p>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {story.author}
                      </p>
                      <p className="text-sm text-gray-500">{story.role}</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Share Your Story
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Are you a program graduate with a success story to share? We'd love to hear from you!
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-300">
            Submit Your Story
          </button>
        </div>
      </section>
    </div>
  )
}

export default Stories 