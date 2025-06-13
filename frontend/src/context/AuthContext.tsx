import { createContext, useContext, useState, useEffect } from "react"
import api from "../api/axios"

interface User {
  _id: string
  name: string
  email: string
  role: string
  token: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  loginWithGoogle: (googleToken: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        console.log("AuthContext - Loaded user from localStorage:", { 
          email: parsedUser.email, 
          role: parsedUser.role 
        })
        api.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`
        return parsedUser
      }
    } catch (error) {
      console.error("AuthContext - Error loading user from localStorage:", error)
      localStorage.removeItem("user")
    }
    return null
  })

  // Verify token on mount and when user changes
  useEffect(() => {
    const verifyToken = async () => {
      if (!user?.token) {
        console.log("AuthContext - No token found, skipping verification")
        return
      }

      console.log("AuthContext - Verifying token for user:", { 
        email: user.email, 
        role: user.role 
      })

      try {
        const response = await api.get("/users/me")
        if (response.data) {
          const updatedUser = { ...user, ...response.data }
          console.log("AuthContext - Token verification successful:", { 
            email: updatedUser.email, 
            role: updatedUser.role 
          })
          
          if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
            console.log("AuthContext - Updating user data")
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)
          }
        }
      } catch (error) {
        console.error("AuthContext - Token verification failed:", error)
        localStorage.removeItem("user")
        setUser(null)
      }
    }

    verifyToken()
  }, [user?.token])

  useEffect(() => {
    if (user?.token) {
      console.log("AuthContext - Setting auth header for user:", { 
        email: user.email, 
        role: user.role 
      })
      api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
    } else {
      console.log("AuthContext - Removing auth header")
      delete api.defaults.headers.common["Authorization"]
    }
  }, [user])

  const login = (userData: User) => {
    try {
      console.log("AuthContext - Logging in user:", { 
        email: userData.email, 
        role: userData.role 
      })
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("AuthContext - Error saving user to localStorage:", error)
      throw new Error("Failed to save login data")
    }
  }

  const loginWithGoogle = async (googleToken: string) => {
    try {
      const response = await api.post("/users/google-login", { token: googleToken })
      const userData: User = response.data
      console.log("AuthContext - Google login successful:", { 
        email: userData.email, 
        role: userData.role 
      })
      localStorage.setItem("user", JSON.stringify(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
      setUser(userData)
    } catch (error) {
      console.error("AuthContext - Google login failed:", error)
      throw new Error("Google login failed")
    }
  }

  const logout = () => {
    try {
      console.log("AuthContext - Logging out user:", { 
        email: user?.email, 
        role: user?.role 
      })
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("AuthContext - Error removing user from localStorage:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
