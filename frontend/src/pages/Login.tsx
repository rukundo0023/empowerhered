import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import api, { retryRequest } from "../api/axios"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useTranslation } from "react-i18next"
import offlineAuthService from "../services/offlineAuthService"
import OfflineLoginInfo from "../components/OfflineLoginInfo"

interface DecodedToken {
  role?: string
  // add other fields if needed
}

const Login = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [cachedEmails, setCachedEmails] = useState<string[]>([])
  const [rememberMe, setRememberMe] = useState(false)
  const [isWarmingUp, setIsWarmingUp] = useState(false)
  const { login, user, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  // Check offline status and cached emails
  useEffect(() => {
    const updateOfflineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    const loadCachedEmails = async () => {
      if (!navigator.onLine) {
        const emails = await offlineAuthService.getCachedEmails();
        setCachedEmails(emails);
      }
    };

    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);
    
    loadCachedEmails();

    return () => {
      window.removeEventListener('online', updateOfflineStatus);
      window.removeEventListener('offline', updateOfflineStatus);
    };
  }, []);

  // Redirect if already logged in based on role
  useEffect(() => {
    console.log("Login component - User state:", user)
    if (user) {
      console.log("Login component - User role:", user.role)
      // Add a small delay to ensure the user state is fully set
      const timer = setTimeout(() => {
        if (user.role === "admin") {
          console.log("Login component - Redirecting to admin panel")
          navigate("/admin", { replace: true })
        } else if (user.role === "mentor") {
          console.log("Login component - Redirecting to mentor dashboard")
          navigate("/mentorDashboard", { replace: true })
        } else if (user.role === "instructor") {
          console.log("Login component - Redirecting to instructor dashboard")
          navigate("/instructor-dashboard", { replace: true })
        } else {
          console.log("Login component - Redirecting to user dashboard")
          navigate("/dashboard", { replace: true })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      console.log("Login component - Attempting login with:", { email, isOffline })

      if (isOffline) {
        // Handle offline login
        const canLoginOffline = await offlineAuthService.canLoginOffline(email);
        if (!canLoginOffline) {
          throw new Error('No cached credentials found for offline login. Please connect to the internet to log in.');
        }

        const offlineUser = await offlineAuthService.loginOffline(email, password);
        login(offlineUser);
        toast.success('Logged in offline. Your session will sync when you reconnect.');
      } else {
        // Handle online login
        console.log("Login component - Attempting online login to:", api.defaults.baseURL + "/users/login");
        
        try {
          // Use the configured axios instance with retry logic for cold starts
          console.log('Using axios with baseURL:', api.defaults.baseURL);
          setIsWarmingUp(true);
          const response = await retryRequest({
            method: 'post',
            url: "/users/login",
            data: { email, password }
          });
          console.log("Login component - Login response:", { 
            success: !!response.data.token,
            role: response.data.role
          })

          if (response.data.token) {
            // Cache credentials for offline login if remember me is checked
            if (rememberMe) {
              await offlineAuthService.cacheCredentials(email, password);
            }
            
            // Call context login to update user state
            login(response.data)
            toast.success(t('auth.login.success'))
          }
        } catch (apiError: any) {
          console.error("Login component - API error details:", {
            message: apiError.message,
            status: apiError.response?.status,
            statusText: apiError.response?.statusText,
            data: apiError.response?.data,
            config: {
              url: apiError.config?.url,
              method: apiError.config?.method,
              baseURL: apiError.config?.baseURL
            }
          });
          throw apiError;
        }
      }
      // Let useEffect handle navigation
    } catch (error: any) {
      console.error("Login component - Login error:", error)
      // Show the specific error message from the backend
      const errorMessage = error.message || t('auth.login.error')
      toast.error(errorMessage)
      
      // Clear password field on error
      setPassword('')
    } finally {
      setIsLoading(false)
      setIsWarmingUp(false)
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      console.log("Google login response:", credentialResponse);
      const token = credentialResponse.credential;
      
      if (!token) {
        console.error("No token received from Google");
        throw new Error("No token found");
      }

      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded Google token:", decoded);

      await loginWithGoogle(token);
      toast.success(t('auth.login.success'));

      // Navigate based on user role saved in localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const role = userData.role;
      
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "mentor") {
        navigate("/mentorDashboard", { replace: true });
      } else if (role === "instructor") {
        navigate("/instructor-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(t('auth.login.error'));
    }
  };
  // Handle Google login error

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
    toast.error(t('auth.login.error'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.login.subtitle')}
          </p>
          {isOffline && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    You're offline. Only cached credentials can be used for login.
                  </p>
                </div>
              </div>
            </div>
          )}
          {!isOffline && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    First login may take longer as the server warms up. Please be patient.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <OfflineLoginInfo />
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.login.email.label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.login.email.placeholder')}
                disabled={isLoading}
                list={isOffline ? "cached-emails" : undefined}
              />
              {isOffline && cachedEmails.length > 0 && (
                <datalist id="cached-emails">
                  {cachedEmails.map((cachedEmail) => (
                    <option key={cachedEmail} value={cachedEmail} />
                  ))}
                </datalist>
              )}
              {isOffline && cachedEmails.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Available cached emails: {cachedEmails.join(', ')}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.login.password.label')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.login.password.placeholder')}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t('auth.login.rememberMe')} {isOffline && <span className="text-xs text-gray-500">(enables offline login)</span>}
              </label>
            </div>

            <div className="text-sm">
              <Link to="/ForgotPassword" className="font-medium text-blue-600 hover:text-blue-500">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isWarmingUp ? "Warming up server..." : t('auth.login.signingIn')}
                </span>
              ) : (
                t('auth.login.signIn')
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('auth.login.or')}
              </span>
            </div>
          </div>

          <div className="mt-6 ">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              width={"sm: 200, md: 400, lg: 400, xl: 400"}
              
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('auth.login.noAccount')}{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.login.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
