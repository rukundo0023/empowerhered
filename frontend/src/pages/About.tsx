import { motion } from "framer-motion"
import assets from "../assets/assets"
import Newsletter from "../components/Newsletter"

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700/20 to-gray-800/20 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-gray-700">EmpowerHerEd</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering women through technology, education, and community support.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                EmpowerHerEd was born from a simple but powerful idea: when women are educated and empowered, entire communities prosper. Founded by a passionate team of educators, mentors, and advocates, EmpowerHerEd exists to bridge the gender gap in education and opportunity.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform is a safe, inclusive space where women and girls can learn, connect, and grow — academically, professionally, and personally.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We offer curated educational content, mentorship programs, workshops, and career support to help women at every stage of their journey. From high school students to working professionals, we're here to uplift, equip, and empower.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📚", label: "Educational Content" },
                  { icon: "👥", label: "Mentorship" },
                  { icon: "🎯", label: "Workshops" },
                  { icon: "💼", label: "Career Support" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To bridge the gender gap in technology by providing women with the skills, 
                resources, and support they need to succeed in the tech industry.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                A world where women are equally represented in technology and have the 
                opportunity to shape the future of innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why It Matters</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Despite progress, millions of women around the world still face limited access to education and leadership roles. EmpowerHerEd is changing that by nurturing confidence, capability, and community.
            </p>
            <p className="text-xl font-semibold text-gray-700">
              Together, we are shaping a future where education is a right — not a privilege — for every woman.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at EmpowerHerEd
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Empowerment",
                description: "We believe in empowering women through education and skill development.",
                icon: "🌟"
              },
              {
                title: "Community",
                description: "Building a supportive network of women in tech who lift each other up.",
                icon: "🤝"
              },
              {
                title: "Innovation",
                description: "Fostering creativity and innovation in technology through diverse perspectives.",
                icon: "💡"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the passionate individuals driving our mission forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5">
            {[
              {
                name: "Rukundo Nshimiyimana",
                role: "Founder & CEO",
                image: assets.profile
              },
              {
                name: "Maria Garcia",
                role: "Head of Education",
                image: assets.profile
              },
              {
                name: "Aisha Patel",
                role: "Community Director",
                image: assets.profile
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative h-72">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-700">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Making a difference in the lives of women in tech
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Women Empowered" },
              { number: "95%", label: "Job Placement Rate" },
              { number: "50+", label: "Partner Companies" },
              { number: "1000+", label: "Graduates" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm text-center"
              >
                <div className="text-4xl font-bold text-gray-700 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-700 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
              Be part of the movement to empower women in technology and create a more inclusive future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Get Started
              </button>
              <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
