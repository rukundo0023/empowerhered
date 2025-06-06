import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "program" | "page" | "resource"
  url: string
}

interface SearchProps {
  isOpen: boolean
  onClose: () => void
}

const Search = ({ isOpen, onClose }: SearchProps) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Sample data - replace with actual API call
  const searchData: SearchResult[] = [
    {
      id: "1",
      title: "Web Development Bootcamp",
      description: "Comprehensive web development program covering HTML, CSS, JavaScript, and more",
      type: "program",
      url: "/programs/tech-skills"
    },
    {
      id: "2",
      title: "Leadership Training",
      description: "Develop essential leadership skills for tech industry success",
      type: "program",
      url: "/programs/leadership"
    },
    {
      id: "3",
      title: "About Us",
      description: "Learn about our mission and values",
      type: "page",
      url: "/about"
    },
    {
      id: "4",
      title: "Coding Resources",
      description: "Collection of free coding resources and tutorials",
      type: "resource",
      url: "/resources"
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const filteredResults = searchData.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filteredResults)
        setIsLoading(false)
      }, 300)
    } else {
      setResults([])
    }
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case "program":
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case "page":
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case "resource":
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
        >
          <motion.div
            ref={searchRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-2xl bg-white rounded-lg shadow-xl"
          >
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search programs, resources, and more..."
                  className="w-full px-4 py-2 pl-10 pr-10 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <button
                  onClick={onClose}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : results.length > 0 ? (
                <div className="divide-y">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      to={result.url}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getIcon(result.type)}</div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{result.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                          <span className="inline-block mt-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            {result.type}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <div className="p-4 text-center text-gray-500">No results found</div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Search 