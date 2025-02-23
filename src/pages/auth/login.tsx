import { FaTicket } from "react-icons/fa6";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import React, { FormEvent, useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const { handleLogin, isLoading, error, setError, isAuthenticated } =
    useAuthContext();
  const location = useLocation();
  const { from } = (location.state as { from: string }) || { from: "/" };

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.password) setFormError("Please input your password");
    if (!form.email) setFormError("Please input your registered email");
    if (!form.email && !form.password)
      return setFormError("The email and password fields are required");

    handleLogin(form.email, form.password);
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
          onSubmit={login}
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
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setFormError("");
                setError({ login: { message: "" } });
              }}
              className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
            />
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
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                setFormError("");
                setError({ login: { message: "" } });
              }}
              className="px-3 w-full py-2 border rounded-md border-secondary placeholder:text-secondary-100 text-secondary outline-none text-sm"
            />
          </div>

          {error.login?.message && (
            <ErrorLabel title="Login Error" message={error.login.message} />
          )}

          {formError && <ErrorLabel message={formError} />}

          <button
            type="submit"
            className="px-3 mt-4 w-full py-2 border rounded-md border-secondary text-secondary outline-none text-sm flex items-center justify-center gap-4 cursor-pointer hover:bg-primary transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading && <FaTicket className="animate-bounce" size={20} />}
            Login
          </button>
        </form>

        <div>
          <p className="text-xs text-secondary text-center">
            Don&apos;t have an account yet?{" "}
            <Link to="/register" className="font-semibold hover:underline">
              Create
            </Link>{" "}
            a new account.
          </p>
        </div>
      </div>
    </section>
  );
}

const ErrorLabel: React.FC<{ title?: string; message: string }> = ({
  title,
  message,
}) => {
  return (
    <div className="border border-red-400 rounded-md bg-red-200 p-2">
      {title && (
        <p className="text-md mb-2 text-red-600 font-medium">{title}</p>
      )}
      <span className="text-xs text-red-500">{message}</span>
    </div>
  );
};
