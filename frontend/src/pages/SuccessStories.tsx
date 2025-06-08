import { motion } from "framer-motion"
import assets from "../assets/assets"


const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Marie Uwimana",
      role: "Software Developer",
      image: assets.profile,
      quote: "EmpowerHerEd gave me the skills and confidence to pursue my dream career in tech. The mentorship and support were invaluable.",
      story: "After completing the coding bootcamp, I secured a position as a junior developer at a local tech company. The practical skills and real-world projects prepared me well for the industry."
    },
    {
      id: 2,
      name: "Grace Mukamana",
      role: "Business Owner",
      image: assets.profile,
      quote: "The business development program helped me turn my small idea into a thriving enterprise.",
      story: "With the knowledge gained from EmpowerHerEd's business program, I successfully launched my own fashion brand, creating employment opportunities for other women in my community."
    },
    {
      id: 3,
      name: "Sarah Niyonsenga",
      role: "Community Leader",
      image: assets.profile,
      quote: "The leadership training empowered me to make a real difference in my community.",
      story: "Through the community leadership program, I learned how to organize and mobilize resources effectively. Now I'm leading initiatives that support education and women's empowerment in my district."
    },
    {
      id: 4,
      name: "Claire Uwase",
      role: "Data Scientist",
      image: assets.profile,
      quote: "The data analysis program opened up a whole new world of opportunities for me.",
      story: "After completing the data science track, I joined a research institute where I'm now working on projects that use data to improve healthcare delivery in rural communities."
    },
    {
      id: 5,
      name: "Joyce Mutoni",
      role: "Tech Entrepreneur",
      image: assets.profile,
      quote: "The combination of technical skills and business training was exactly what I needed.",
      story: "I developed a mobile app that connects farmers with markets, and with the support from EmpowerHerEd's entrepreneurship program, I've grown it into a successful startup."
    },
    {
      id: 6,
      name: "Esther Mukamana",
      role: "Digital Marketing Specialist",
      image: assets.profile,
      quote: "The digital skills program helped me pivot my career during the pandemic.",
      story: "I transitioned from traditional marketing to digital marketing, and now I'm helping local businesses establish their online presence and reach new customers."
    },
    {
      id: 7,
      name: "Alice Uwamahoro",
      role: "UX/UI Designer",
      image: assets.profile,
      quote: "The design program helped me combine my creativity with technical skills.",
      story: "I now lead the design team at a tech startup, creating user-friendly interfaces for mobile applications that serve local communities."
    },
    {
      id: 8,
      name: "Beatrice Nyirahabimana",
      role: "Cybersecurity Analyst",
      image: assets.profile,
      quote: "The cybersecurity training opened doors to a field I never thought I could enter.",
      story: "After completing the program, I joined a financial institution's security team, where I help protect customer data and prevent cyber threats."
    },
    {
      id: 9,
      name: "Diane Uwase",
      role: "AI Research Engineer",
      image: assets.profile,
      quote: "The advanced tech program helped me pursue my passion for artificial intelligence.",
      story: "I'm now working on AI projects that help improve agricultural yields and predict weather patterns, making a real impact on farmers' lives."
    }
  ]

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
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl md:text-6xl">
              Success Stories
            </h1>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover how EmpowerHerEd has transformed lives and created opportunities for women in Rwanda.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={story.image}
                    alt={story.name}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-neutral-900">{story.name}</h3>
                    <p className="text-neutral-600">{story.role}</p>
                  </div>
                </div>
                <blockquote className="text-lg text-neutral-700 italic mb-6">
                  "{story.quote}"
                </blockquote>
                <p className="text-neutral-600">{story.story}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-neutral-900">
              Be Part of Our Success Story
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our community of empowered women and start your journey to success.
            </p>
            <div className="mt-8">
              <a
                href="/programs"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800"
              >
                Explore Programs
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SuccessStories 