import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import assets from "../assets/assets"

const Programs = () => {
  const programs = [
  {
    id: 1,
    title: "Digital Literacy & Office Tools",
    description:
      "Master essential computer and internet skills, and learn to use tools like Microsoft Word, Excel, and Google Docs.",
    icon: "💻",
    features: [
      "Computer & internet basics",
      "Microsoft Office & Google Workspace",
      "Email & online etiquette",
      "Document creation and sharing"
    ],
    route: "/programs/tech-skills"
  },
  {
    id: 2,
    title: "Online Communication & Collaboration",
    description:
      "Learn how to communicate and collaborate effectively online using popular digital platforms.",
    icon: "👩‍💼",
    features: [
      "Zoom & Google Meet",
      "Team communication tools",
      "Professional online behavior",
      "Google Drive & file sharing"
    ],
    route: "/programs/Communication"
  },
  {
    id: 3,
    title: "Job Readiness & Networking",
    description:
      "Prepare for the job market with essential career skills, networking strategies, and digital presence building.",
    icon: "🚀",
    features: [
      "CV & cover letter writing",
      "LinkedIn & email setup",
      "Interview skills",
      "Building professional connections"
    ],
    route: "/programs/workshops"
  },
  {
    id: 4,
    title: "Mentorship Program",
    description:
      "Connect with mentors who guide and support your personal, academic, and professional development journey.",
    icon: "👩‍🏫",
    features: [
      "One-on-one mentoring",
      "Career advice & support",
      "Goal-setting sessions",
      "Skill development guidance"
    ],
    route: "/programs/mentorship"
  },
  {
    id: 5,
    title: "Networking Events",
    description:
      "Participate in community events that connect you with professionals and inspire your future journey.",
    icon: "🤝",
    features: [
      "Industry meetups",
      "Workshops & panel talks",
      "Success story sharing",
      "Community building"
    ],
    route: "/programs/workshops"
  }
];


  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden"
        style={{ backgroundImage: `url(${assets.herobg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('/src/assets/pattern.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-800">
              <span className="text-black mr-3">Our</span><span className="text-primary-600">Programs</span>
            </h1>
            <p className="text-lg text-neutral-700 mb-8">
              Empowering young women in Rwanda through comprehensive training and development programs.
            </p>
          </motion.div>
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
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            
            <h2 className="text-3xl font-bold mb-6 text-neutral-800">Ready to Start Your Journey?</h2>
            <p className="text-lg text-neutral-600 mb-8">
              Take the first step towards your future in technology. Apply now and join our community of learners.
            </p>
            </motion.div>
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
