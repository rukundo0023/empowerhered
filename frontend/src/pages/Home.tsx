import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Newsletter from "../components/Newsletter"
import assets from "../assets/assets"

const Home = () => {

  const featuredCourses = [
  {
    title: "Computer Basics & Hardware",
    description: "Learn the fundamentals of computer hardware and maintenance",
    level: "Beginner",
    duration: "6 weeks",
    students: "1.2k",
    route: "/resources/learning"
  },
  {
    title: "Internet & Email Skills",
    description: "Master essential internet navigation and email communication",
    level: "Beginner",
    duration: "4 weeks",
    students: "1.1k",
    route: "/resources/learning"
  },
  {
    title: "Microsoft Word",
    description: "Become proficient in Microsoft Word for professional documents",
    level: "Beginner",
    duration: "3 weeks",
    students: "950",
    route: "/resources/learning"
  }
]


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden pt-28"
      style={{ backgroundImage: `url(${assets.herobg})`, backgroundSize: "cover" }} >

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMjA5IDEuNzkxLTQgNC00czQgMS43OTEgNCA0LTEuNzkxIDQtNCA0LTQtMS43OTEtNC00eiIgZmlsbD0iI2U1ZTdlYiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
            >
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-8 leading-tight tracking-tight">
                Empowering Women Through{" "}
                <span className="text-blue-600">Digital Education</span>
              </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <p className="text-gray-600 text-lg leading-relaxed">
                  EmpowerHerEd is more than just a learning platform — it's a movement to uplift, educate, and inspire young women across Rwanda. 
                  Our mission is to close the gender gap in the tech industry by equipping girls and women with the skills, support, and confidence they need to thrive in today's digital world.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <p className="text-gray-600 text-lg leading-relaxed">
                  Join Rwanda's premier tech education platform. Learn from industry experts, connect with mentors, 
                  and launch your dream career in technology. Whether you're just beginning or ready to take your skills to the next level, 
                  we're here to guide your journey every step of the way.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link
                  to="/programs"
                className="w-full sm:w-auto px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
                >
                  Explore Programs
                </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 text-center"
              >
                Contact Us
                </Link>
              </div>

              {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "1000+", label: "Women Empowered" },
                  { number: "95%", label: "Success Rate" },
                  { number: "50+", label: "Expert Mentors" },
                  { number: "15+", label: "Partner Companies" }
              ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center"
                  >
                  <div className="text-3xl font-bold text-gray-700 mb-2">
                      {stat.number}
                    </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-black font-medium tracking-wide">Featured Programs</span>
            <h2 className="text-3xl font-bold text-blue-600 mt-2 mb-4 tracking-tight">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully designed programs to accelerate your tech career
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
            <motion.div
                key={course.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{course.level}</span>
                    <span>{course.duration}</span>
                    <span>{course.students} students</span>
                </div>
                  <Link
                    to={course.route}
                    className="block w-full text-center bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                  >
                    Learn More
                  </Link>
              </div>
            </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-black font-medium tracking-wide">Why Choose Us</span>
            <h2 className="text-3xl font-bold text-blue-600 mt-2 mb-4 tracking-tight">
              Your Path to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in the tech industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Expert-Led Learning",
                description: "Learn from industry professionals with years of experience"
              },
              {
                icon: "🤝",
                title: "Mentorship",
                description: "Get personalized guidance from experienced mentors"
              },
              {
                icon: "💼",
                title: "Career Support",
                description: "Access job opportunities and career development resources"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-black font-medium tracking-wide">Success Stories</span>
            <h2 className="text-3xl font-bold text-blue-600 mt-2 mb-4 tracking-tight">
              Hear From Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how our programs have transformed careers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Uwimana",
                role: "Software Developer",
                image: assets.profile,
                quote: "EmpowerHerEd gave me the skills and confidence to pursue my dream career in tech."
              },
              {
                name: "Grace Mukamana",
                role: "UX Designer",
                image: assets.profile,
                quote: "The mentorship program helped me transition into tech and find my passion."
              },
              {
                name: "Sarah Niyonsenga",
                role: "Data Scientist",
                image: assets.profile,
                quote: "The support and guidance I received were invaluable to my success."
              }
            ].map((story, index) => (
            <motion.div
                key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-gray-200"
                  />
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">{story.name}</h3>
                    <p className="text-gray-600">{story.role}</p>
              </div>
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
            </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/success-stories"
              className="inline-flex items-center text-gray-700 hover:text-gray-800 font-medium transition-colors duration-300"
            >
              View All Success Stories
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of women in tech and take the first step towards your dream career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all duration-300 text-lg font-medium"
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

export default Home
