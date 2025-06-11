import { motion } from "framer-motion"
import Newsletter from "../components/Newsletter"
import assets from "../assets/assets"

const Blog = () => {
  const blogPosts = [
    {
      title: "Breaking Barriers: Women in Tech",
      excerpt: "Exploring the challenges and triumphs of women in the technology industry.",
      image: assets.profile,
      date: "March 15, 2024",
      author: "Rukundo Nshimiyimana"
    },
    {
      title: "The Future of Women in STEM",
      excerpt: "How we're working to increase female representation in STEM fields.",
      image: assets.profile,
      date: "March 10, 2024",
      author: "Maria Garcia"
    },
    {
      title: "Building a Supportive Tech Community",
      excerpt: "The importance of community in fostering women's success in tech.",
      image: assets.profile,
      date: "March 5, 2024",
      author: "Aisha Patel"
    },
    {
      title: "Coding Bootcamp Success Stories",
      excerpt: "Real stories from women who transformed their careers through coding.",
      image: assets.profile,
      date: "February 28, 2024",
      author: "Rukundo Nshimiyimana"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-28"
        style={{ backgroundImage: `url(${assets.blogbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Blog</span>
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Insights, stories, and updates from our community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48 contain">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <button className="text-gray-700 font-semibold hover:text-gray-900 transition-colors">
                    Read More →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </div>
  )
}

export default Blog 