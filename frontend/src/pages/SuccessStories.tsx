import { motion } from "framer-motion"
import assets from "../assets/assets"
import { useTranslation } from 'react-i18next'

const SuccessStories = () => {
  const { t } = useTranslation();
  
  const stories = [
    {
      id: 1,
      name: t('successStories.stories.marie.name'),
      role: t('successStories.stories.marie.role'),
      image: assets.profile,
      quote: t('successStories.stories.marie.quote'),
      story: t('successStories.stories.marie.story')
    },
    {
      id: 2,
      name: t('successStories.stories.grace.name'),
      role: t('successStories.stories.grace.role'),
      image: assets.profile,
      quote: t('successStories.stories.grace.quote'),
      story: t('successStories.stories.grace.story')
    },
    {
      id: 3,
      name: t('successStories.stories.sarah.name'),
      role: t('successStories.stories.sarah.role'),
      image: assets.profile,
      quote: t('successStories.stories.sarah.quote'),
      story: t('successStories.stories.sarah.story')
    },
    {
      id: 4,
      name: t('successStories.stories.claire.name'),
      role: t('successStories.stories.claire.role'),
      image: assets.profile,
      quote: t('successStories.stories.claire.quote'),
      story: t('successStories.stories.claire.story')
    },
    {
      id: 5,
      name: t('successStories.stories.joyce.name'),
      role: t('successStories.stories.joyce.role'),
      image: assets.profile,
      quote: t('successStories.stories.joyce.quote'),
      story: t('successStories.stories.joyce.story')
    },
    {
      id: 6,
      name: t('successStories.stories.esther.name'),
      role: t('successStories.stories.esther.role'),
      image: assets.profile,
      quote: t('successStories.stories.esther.quote'),
      story: t('successStories.stories.esther.story')
    },
    {
      id: 7,
      name: t('successStories.stories.alice.name'),
      role: t('successStories.stories.alice.role'),
      image: assets.profile,
      quote: t('successStories.stories.alice.quote'),
      story: t('successStories.stories.alice.story')
    },
    {
      id: 8,
      name: t('successStories.stories.beatrice.name'),
      role: t('successStories.stories.beatrice.role'),
      image: assets.profile,
      quote: t('successStories.stories.beatrice.quote'),
      story: t('successStories.stories.beatrice.story')
    },
    {
      id: 9,
      name: t('successStories.stories.diane.name'),
      role: t('successStories.stories.diane.role'),
      image: assets.profile,
      quote: t('successStories.stories.diane.quote'),
      story: t('successStories.stories.diane.story')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700/20 to-gray-800/20 pt-28"
        style={{ backgroundImage: `url(${assets.herobg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-blue-600 sm:text-5xl md:text-6xl">
              <span className="text-black">{t('successStories.hero.title')}</span>
            </h1>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              {t('successStories.hero.description')}
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
              {t('successStories.cta.title')}
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('successStories.cta.description')}
            </p>
            <div className="mt-8">
              <a
                href="/programs"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800"
              >
                {t('successStories.cta.button')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SuccessStories 