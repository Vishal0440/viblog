import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api, { setAuthHeader } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword, hasErrors } from "../utils/validation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = (nextForm = form) => {
    const nextErrors = {
      email: validateEmail(nextForm.email),
      password: validatePassword(nextForm.password),
    };
    setErrors(nextErrors);
    return nextErrors;
  };

  const change = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    validate(nextForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();

    if (hasErrors(nextErrors)) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setAuthHeader(res.data.token);
      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-12">
      <form noValidate onSubmit={submit} className="mx-auto w-full max-w-md">
        <div className="mb-9 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Vi Blog</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Welcome back</h1>
          <p className="mt-3 text-slate-500">Sign in to write and manage your posts.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5">
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
            <input
              id="login-email"
              type="text" inputMode="email"
              value={form.email}
              placeholder="you@email.com"
              onChange={(e) => change("email", e.target.value)}
              className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.email ? "border-red-300 bg-red-50/40 focus:border-red-400" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`}
            />
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Enter your password"
                onChange={(e) => change("password", e.target.value)}
                className={`w-full rounded-xl border px-4 py-3.5 pr-12 outline-none transition ${errors.password ? "border-red-300 bg-red-50/40 focus:border-red-400" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`}
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-7 text-center text-sm text-slate-500">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
