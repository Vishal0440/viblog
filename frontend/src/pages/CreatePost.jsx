import React, { useState } from "react";
import { ArrowLeft, ImageIcon, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { CATEGORIES } from "../utils/categories";
import { validatePost, hasErrors } from "../utils/validation";
import { useNavigate } from "react-router-dom";

const initialForm = { title: "", body: "", image: "", category: "" };

export default function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const wordCount = form.body.trim() ? form.body.trim().split(/\s+/).length : 0;

  const change = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setErrors(validatePost(nextForm));
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validatePost(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);
    try {
      await api.post("/posts", {
        title: form.title.trim(),
        body: form.body.trim(),
        image: form.image.trim() || undefined,
        category: form.category,
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Post published 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={16} /> Back
        </button>

        <form noValidate onSubmit={submit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-7 sm:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Create</p>
                <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Create a new post</h1>
                <p className="mt-2 text-sm text-slate-500">Share your ideas with the Vi Blog community.</p>
              </div>
              <button type="submit" disabled={loading || hasErrors(errors)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                <Send size={16} /> {loading ? "Publishing..." : "Publish post"}
              </button>
            </div>
          </div>

          <div className="space-y-7 px-6 py-7 sm:px-10 sm:py-9">
            <div>
              <div className="mb-2 flex justify-between">
                <label htmlFor="post-title" className="text-sm font-semibold text-slate-800">Title</label>
                <span className="text-xs text-slate-400">{form.title.length}/100</span>
              </div>
              <input id="post-title" value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="Enter an interesting title" className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.title ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
              {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="post-category" className="mb-2 block text-sm font-semibold text-slate-800">Category</label>
              <select id="post-category" value={form.category} onChange={(e) => change("category", e.target.value)} className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.category ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`}>
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
              {errors.category && <p className="mt-2 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="post-image" className="mb-2 block text-sm font-semibold text-slate-800">
                Cover image URL <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${errors.image ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50"}`}>
                <ImageIcon size={18} className="text-slate-400" />
                <input id="post-image" type="text" value={form.image} onChange={(e) => change("image", e.target.value)} placeholder="https://example.com/image.jpg" className="w-full bg-transparent text-sm outline-none" />
              </div>
              {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
              {form.image && !errors.image && <div className="mt-3 h-56 overflow-hidden rounded-2xl border border-slate-200"><img src={form.image} alt="Cover preview" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} /></div>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="post-body" className="text-sm font-semibold text-slate-800">Story</label>
                <span className="text-xs text-slate-400">{wordCount} words</span>
              </div>
              <textarea id="post-body" rows={10} value={form.body} onChange={(e) => change("body", e.target.value)} placeholder="Start writing your story..." className={`w-full resize-y rounded-2xl border p-5 text-base leading-7 outline-none transition ${errors.body ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
              {errors.body && <p className="mt-2 text-sm text-red-500">{errors.body}</p>}
              {!errors.body && <p className="mt-2 text-xs text-slate-400">Write at least 50 characters.</p>}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
