import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import offlineAuthService from "../services/offlineAuthService";
import OfflineSignupInfo from "../components/OfflineSignupInfo";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "student",
    terms: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(null);

  // Check offline status and email availability
  useEffect(() => {
    const updateOfflineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    const checkEmailAvailability = async () => {
      if (formData.email && formData.email.includes('@')) {
        const available = await offlineAuthService.isEmailAvailableForSignup(formData.email);
        setEmailAvailability(available);
      }
    };

    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);
    
    checkEmailAvailability();

    return () => {
      window.removeEventListener('online', updateOfflineStatus);
      window.removeEventListener('offline', updateOfflineStatus);
    };
  }, [formData.email]);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      role: "",
    };

    if (!formData.name.trim()) newErrors.name = t('auth.signup.name.required');

    if (!formData.email.trim()) {
      newErrors.email = t('auth.signup.email.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.signup.email.invalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.signup.password.required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.signup.password.minLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.confirmPassword.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.confirmPassword.mismatch');
    }

    if (!formData.gender) newErrors.gender = t('auth.signup.gender.required');
    if (!formData.role) newErrors.role = t('auth.signup.role.required');

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("Signup component - Attempting signup:", { email: formData.email, isOffline });

      if (isOffline) {
        // Handle offline signup
        const offlineUser = await offlineAuthService.signupOffline(formData);
        signup(offlineUser);
        toast.success('Account created offline. Your registration will sync when you reconnect.');
        setRegistrationSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        // Handle online signup
        const response = await api.post("/users/register", formData);
        toast.success(t('auth.signup.success'));
        setRegistrationSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error: any) {
      console.error("Signup component - Signup error:", error);
      const errorMessage = error.message || error.response?.data?.message || t('auth.signup.error');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {getUserInitials(formData.name)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isOffline ? 'Account Created Offline!' : t('auth.signup.success.title', { name: formData.name })}
            </h2>
            <p className="text-gray-600 mb-4">
              {isOffline 
                ? 'Your account has been created locally and will sync when you reconnect to the internet.'
                : t('auth.signup.success.message')
              }
            </p>
            <p className="text-sm text-gray-500">
              {isOffline 
                ? 'Redirecting to dashboard...'
                : t('auth.signup.success.redirecting')
              }
            </p>
            {isOffline && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  🔄 Your account will be synced to the server when you're back online.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{t('auth.signup.title')}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.signup.subtitle')}{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t('auth.login.signIn')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <OfflineSignupInfo />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('auth.signup.name.label')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.signup.email.label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              {emailAvailability === false && (
                <p className="text-sm text-red-600">This email is already registered</p>
              )}
              {emailAvailability === true && formData.email && (
                <p className="text-sm text-green-600">✓ Email is available</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                {t('auth.signup.gender.label')}
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              >
                <option value="">{t('auth.signup.gender.options.select')}</option>
                <option value="female">{t('auth.signup.gender.options.female')}</option>
                <option value="male">{t('auth.signup.gender.options.male')}</option>
                <option value="other">{t('auth.signup.gender.options.other')}</option>
                <option value="prefer-not-to-say">{t('auth.signup.gender.options.preferNotToSay')}</option>
              </select>
              {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t('auth.signup.role.label')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              >
                <option value="">{t('auth.signup.role.options.select')}</option>
                <option value="student">{t('auth.signup.role.options.student')}</option>
                <option value="mentor">{t('auth.signup.role.options.mentor')}</option>
                <option value="instructor">Instructor</option>
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.signup.password.label')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('auth.signup.confirmPassword.label')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-900">
                {t('auth.signup.terms.agree')}{" "}
                <Link to="/TermsAndConditions" className="text-indigo-600 hover:text-indigo-500">
                  {t('auth.signup.terms.link')}
                </Link>
              </label>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50"
              >
                {loading ? t('auth.signup.creatingAccount') : t('auth.signup.createAccount')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
