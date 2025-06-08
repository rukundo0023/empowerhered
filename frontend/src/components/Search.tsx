import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

interface SearchProps {
  onClose: () => void
}

const Search = ({ onClose }: SearchProps) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  // Close search when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a search with mock data
      const mockResults = [
        { id: 1, title: "Web Development Course", type: "course" },
        { id: 2, title: "Leadership Workshop", type: "workshop" },
        { id: 3, title: "Mentorship Program", type: "program" },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      )

      setResults(mockResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultClick = (result: any) => {
    // Navigate based on result type
    switch (result.type) {
      case "course":
        navigate(`/courses/${result.id}`)
        break
      case "workshop":
        navigate(`/workshops/${result.id}`)
        break
      case "program":
        navigate(`/programs/${result.id}`)
        break
      default:
        navigate(`/search?q=${encodeURIComponent(result.title)}`)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          ref={searchRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
        >
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for courses, workshops, or programs..."
                className="w-full px-4 py-3 pl-12 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {result.title}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Search 