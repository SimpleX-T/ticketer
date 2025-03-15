import { FaEye, FaEyeSlash, FaTicket } from "react-icons/fa6";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";

// Define a type for login form data
interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading, error, isAuthenticated, clearError } =
    useAuth();
  const location = useLocation();
  const { from } = (location.state as { from: string }) || { from: "/" };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const login = async (data: LoginFormData) => {
    // Using our improved context which handles all validation
    handleLogin(data.email, data.password);
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-bl from-secondary-200 to-primary grid place-items-center">
      <div className="w-full max-w-sm border border-secondary-100 rounded-sm p-4">
        <div className="mb-3 text-center">
          <h2 className="text-2xl mb-2 font-semibold text-secondary">Login</h2>
          <p className="text-sm text-secondary-100">Login to your account</p>
        </div>

        <hr className="w-4/5 border-secondary mx-auto border-dotted mb-6" />

        <form
          className="rounded-md border w-full p-2 py-4 mb-3 space-y-5"
          style={{
            borderImage:
              "linear-gradient(var(--color-primary-100), var(--color-secondary))",
            borderImageSlice: 20,
          }}
          onSubmit={handleSubmit(login)}
        >
          <div className="relative">
            <label
              htmlFor="email"
              className="text-sm mb-1 block text-secondary"
            >
              Email:
            </label>

            <input
              type="email"
              placeholder="user@example.com"
              {...register("email", {
                required: "Please input your email",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please input a valid email",
                },
                onChange: () => error && clearError(),
              })}
              className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
            />
            {errors.email && (
              <span className="text-[10px] text-center text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm mb-1 block text-secondary"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                {...register("password", {
                  required: "Please input your password",
                  onChange: () => error && clearError(),
                })}
                className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="flex items-center justify-center cursor-pointer text-secondary absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-xs focus:ring-1 focus:ring-secondary focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-center text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Display Supabase auth errors */}
          {error && (
            <span className="text-xs text-center block text-red-500 bg-red-200 p-2 rounded-md">
              {error}
            </span>
          )}

          <button
            type="submit"
            className="px-3 mt-4 w-full py-2 border rounded-md border-secondary text-secondary outline-none text-sm flex items-center justify-center gap-4 cursor-pointer hover:bg-primary transition-colors duration-300 focus:ring-2 focus:ring-secondary"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaTicket className="animate-bounce" size={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div>
          <p className="text-xs text-secondary text-center">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/signup"
              className="font-semibold hover:underline"
              replace
            >
              create
            </Link>{" "}
            a new account.
          </p>
        </div>
      </div>
    </section>
  );
}
