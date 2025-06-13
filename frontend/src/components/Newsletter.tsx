import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'

interface NewsletterProps {
  className?: string
  variant?: "default" | "compact"
}

const Newsletter = ({ className = "", variant = "default" }: NewsletterProps) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      // TODO: Implement newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('footer.newsletter.placeholder')}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-gray-700 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : t('footer.newsletter.subscribe')}
          </button>
        </form>
        {status === "success" && (
          <p className="mt-2 text-sm text-green-600">{t('footer.newsletter.success')}</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-sm text-red-600">{t('footer.newsletter.error')}</p>
        )}
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl mx-auto text-center ${className}`}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('footer.newsletter.title')}</h2>
      <p className="text-gray-600 mb-8">
        {t('footer.newsletter.description')}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.newsletter.placeholder')}
          className="flex-1 max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? t('footer.newsletter.subscribing') : t('footer.newsletter.subscribe')}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-4 text-green-600">{t('footer.newsletter.success')}</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-600">{t('footer.newsletter.error')}</p>
      )}
    </motion.div>
  )
}

export default Newsletter 