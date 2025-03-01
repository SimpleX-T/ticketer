import { FaTicket } from "react-icons/fa6";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { AuthArgs } from "../../types";
import { useState } from "react";

export default function Signup() {
  const { handleSignup, isLoading, isAuthenticated, error, clearError } =
    useAuth();
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
    <section className="min-h-screen w-full bg-gradient-to-bl from-secondary-200 to-primary grid place-items-center">
      <div className="w-full max-w-md border border-secondary-100 rounded-sm p-4">
        <div className="mb-3 text-center">
          <h2 className="text-2xl mb-2 font-semibold text-secondary">Signup</h2>
          <p className="text-sm text-secondary-100">
            Create an account on Tesarus
          </p>
        </div>

        <hr className="w-4/5 border-secondary mx-auto border-dotted mb-6" />

        <form
          className="rounded-md border w-full p-2 py-4 mb-3 space-y-5"
          style={{
            borderImage:
              "linear-gradient(var(--color-primary-100), var(--color-secondary))",
            borderImageSlice: 20,
          }}
          onSubmit={handleSubmit(signup)}
        >
          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="firstname"
                className="text-sm mb-1 block text-secondary"
              >
                Firstname:
              </label>

              <input
                type="text"
                placeholder="John"
                {...register("firstname", {
                  required: "First name is required",
                  onChange: () => error && clearError(),
                })}
                className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
              />
              {errors.firstname && (
                <span className="text-[10px] text-center text-red-500">
                  {errors.firstname.message}
                </span>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="lastname"
                className="text-sm mb-1 block text-secondary"
              >
                Lastname:
              </label>

              <input
                type="text"
                placeholder="Doe"
                {...register("lastname", {
                  required: "Last name is required",
                  onChange: () => error && clearError(),
                })}
                className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
              />
              {errors.lastname && (
                <span className="text-[10px] text-center text-red-500">
                  {errors.lastname.message}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
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

            <input
              type="password"
              placeholder="**********"
              {...register("password", {
                required: "Please input your password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                onChange: () => error && clearError(),
              })}
              className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
            />
            {errors.password && (
              <span className="text-[10px] text-center text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="text-sm mb-1 block text-secondary"
            >
              Confirm Password:
            </label>

            <input
              type="password"
              placeholder="**********"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
                onChange: () => error && clearError(),
              })}
              className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
            />
            {errors.confirmPassword && (
              <span className="text-[10px] text-center text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-start">
            <div className="mr-3">
              <input
                type="checkbox"
                placeholder="**********"
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                id="accept-term"
                className="accent-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <label
              htmlFor="accept-term"
              className="text-sm block text-secondary"
            >
              Do you agree to our terms and conditions?
            </label>
          </div>

          {/* Display Firebase auth errors */}
          {error && (
            <span className="text-xs text-center block text-red-500">
              {error}
            </span>
          )}

          <button
            type="submit"
            className="px-3 mt-4 w-full py-2 border rounded-md border-secondary text-secondary outline-none text-sm flex items-center justify-center gap-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary transition-colors duration-300 focus:ring-1 focus:ring-secondary"
            disabled={isLoading || !agreeToTerms}
          >
            {isLoading ? (
              <FaTicket className="animate-bounce" size={20} />
            ) : (
              "Signup"
            )}
          </button>
        </form>

        <div>
          <p className="text-xs text-secondary text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline" replace>
              Login
            </Link>{" "}
            to your account.
          </p>
        </div>
      </div>
    </section>
  );
}
