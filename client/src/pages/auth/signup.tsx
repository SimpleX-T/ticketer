import { FaEye, FaEyeSlash, FaTicket } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { AuthArgs } from "../../types";
import { useState } from "react";
import { motion } from "motion/react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    handleSignup,
    isLoading,
    isAuthenticated,
    error,
    clearError,
    loginWithGoogle,
    loginWithGithub,
  } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const location = useLocation();
  const { from } = (location.state as { from: string }) || { from: "/" };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthArgs>();

  const signup = async (data: AuthArgs) => {
    handleSignup(data);
  };

  if (isAuthenticated) {
    return <Navigate to={from || "/dashboard"} replace />;
  }

  return (
    <section className="min-h-screen w-full bg-primary relative overflow-hidden grid place-items-center py-12 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-secondary/20 to-secondary-200/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-secondary-200/20 to-primary-100/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [-90, 0, -90],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-primary-100/40 border border-secondary/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary-100 mb-4"
            >
              <FaTicket className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-secondary-100">Join Tesarus today</p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loginWithGoogle}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300"
            >
              <FcGoogle size={20} />
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loginWithGithub}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300"
            >
              <FaGithub size={20} />
              GitHub
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
            <span className="text-secondary-100 text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-secondary/40 to-transparent" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(signup)} className="space-y-4">
            {/* Names Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="firstname"
                  className="text-sm font-medium text-secondary"
                >
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  {...register("firstname", {
                    required: "Required",
                    onChange: () => error && clearError(),
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary-200/80 border border-secondary/30 text-white placeholder:text-secondary-100/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 text-sm"
                />
                {errors.firstname && (
                  <span className="text-xs text-red-400">
                    {errors.firstname.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="lastname"
                  className="text-sm font-medium text-secondary"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  {...register("lastname", {
                    required: "Required",
                    onChange: () => error && clearError(),
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary-200/80 border border-secondary/30 text-white placeholder:text-secondary-100/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 text-sm"
                />
                {errors.lastname && (
                  <span className="text-xs text-red-400">
                    {errors.lastname.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-secondary"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                  onChange: () => error && clearError(),
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-primary-200/80 border border-secondary/30 text-white placeholder:text-secondary-100/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 text-sm"
              />
              {errors.email && (
                <span className="text-xs text-red-400">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-secondary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                    onChange: () => error && clearError(),
                  })}
                  className="w-full px-4 py-2.5 pr-12 rounded-xl bg-primary-200/80 border border-secondary/30 text-white placeholder:text-secondary-100/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 text-sm"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-100 hover:text-secondary transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-400">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-secondary"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (val) =>
                      val === watch("password") || "Passwords don't match",
                    onChange: () => error && clearError(),
                  })}
                  className="w-full px-4 py-2.5 pr-12 rounded-xl bg-primary-200/80 border border-secondary/30 text-white placeholder:text-secondary-100/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 text-sm"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-100 hover:text-secondary transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-red-400">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                id="accept-terms"
                className="mt-1 accent-secondary w-4 h-4 rounded"
              />
              <label
                htmlFor="accept-terms"
                className="text-sm text-secondary-100"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-secondary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-secondary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-100 text-white font-semibold shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaTicket className="animate-bounce" size={18} />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-secondary-100 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
