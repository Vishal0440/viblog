import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword, validateName, hasErrors } from "../utils/validation";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = (nextForm = form) => {
    const nextErrors = {
      name: validateName(nextForm.name),
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
      await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success("Account created 🎉 Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-12">
      <form noValidate onSubmit={submit} className="mx-auto w-full max-w-md">
        <div className="mb-9 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Vi Blog</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Create your account</h1>
          <p className="mt-3 text-slate-500">Join Vi Blog and start sharing your ideas.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5">
            <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-slate-800">Name</label>
            <input id="signup-name" type="text" value={form.name} placeholder="Your name" onChange={(e) => change("name", e.target.value)} className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.name ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
            <input id="signup-email" type="text" inputMode="email" value={form.email} placeholder="you@email.com" onChange={(e) => change("email", e.target.value)} className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.email ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
            <div className="relative">
              <input id="signup-password" type={showPassword ? "text" : "password"} value={form.password} placeholder="At least 6 characters" onChange={(e) => change("password", e.target.value)} className={`w-full rounded-xl border px-4 py-3.5 pr-12 outline-none transition ${errors.password ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}</button>
            </div>
            {errors.password ? <p className="mt-2 text-sm text-red-500">{errors.password}</p> : <p className="mt-2 text-xs text-slate-400">Use at least 6 characters.</p>}
          </div>

          <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
