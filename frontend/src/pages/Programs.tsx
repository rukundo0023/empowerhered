import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Programs = () => {
  const programs = [
    {
      id: 1,
      title: "Tech Skills Development",
      description: "Learn essential technical skills including programming, web development, and data analysis.",
      icon: "💻",
      features: [
        "Hands-on coding projects",
        "Industry-standard tools",
        "Career guidance",
        "Portfolio development"
      ],
      route: "/programs/tech-skills"
    },
    {
      id: 2,
      title: "Leadership Training",
      description: "Develop leadership skills and learn how to lead teams effectively in the tech industry.",
      icon: "👩‍💼",
      features: [
        "Team management",
        "Communication skills",
        "Strategic thinking",
        "Project leadership"
      ],
      route: "/programs/leadership"
    },
    {
      id: 3,
      title: "Workshops",
      description: "Learn how to start and grow your own tech business with practical guidance.",
      icon: "🚀",
      features: [
        "Business planning",
        "Market research",
        "Funding strategies",
        "Pitch development"
      ],
      route: "/programs/workshops"
    },
    {
      id: 4,
      title: "Mentorship Program",
      description: "Get paired with experienced mentors who can guide you through your career journey.",
      icon: "👩‍🏫",
      features: [
        "One-on-one mentoring",
        "Career advice",
        "Skill development",
        "Networking opportunities"
      ],
      route: "/programs/mentorship"
    },
    {
      id: 5,
      title: "Networking Events",
      description: "Connect with industry professionals and build your professional network.",
      icon: "🤝",
      features: [
        "Industry meetups",
        "Career fairs",
        "Workshop sessions",
        "Community building"
      ],
      route: "/programs/workshops"
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('/src/assets/pattern.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-800">
              Our Programs
            </h1>
            <p className="text-lg text-neutral-700 mb-8">
              Empowering young women in Rwanda through comprehensive training and development programs.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-100"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-800">{program.title}</h3>
                <p className="text-neutral-600 mb-4">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-neutral-600">
                      <span className="text-primary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={program.route}
                  className="inline-block w-full text-center bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-neutral-800">Ready to Start Your Journey?</h2>
            <p className="text-lg text-neutral-600 mb-8">
              Take the first step towards your future in technology. Apply now and join our community of learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                Apply Now
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Programs
