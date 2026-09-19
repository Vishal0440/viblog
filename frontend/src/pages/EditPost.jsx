import React, { useEffect, useState } from "react";
import { ArrowLeft, ImageIcon, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { CATEGORIES } from "../utils/categories";
import { validatePost, hasErrors } from "../utils/validation";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ title: "", body: "", image: "", category: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => setForm({
        title: res.data.title || "",
        body: res.data.body || "",
        image: res.data.image || "",
        category: res.data.category || "",
      }))
      .catch(() => {
        toast.error("Failed to load post.");
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

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

    setSaving(true);
    try {
      await api.put(`/posts/${id}`, {
        title: form.title.trim(),
        body: form.body.trim(),
        image: form.image.trim(),
        category: form.category,
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Post updated.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" /></div>;

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} /> Back</button>

        <form noValidate onSubmit={submit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-6 sm:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Editor</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">Edit post</h1>
            </div>
            <button type="submit" disabled={saving || hasErrors(errors)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
              <Save size={16} /> {saving ? "Saving..." : "Save changes"}
            </button>
          </div>

          <div className="space-y-7 px-6 py-7 sm:px-10">
            <div>
              <label htmlFor="edit-title" className="mb-2 block text-sm font-semibold text-slate-800">Title</label>
              <input id="edit-title" value={form.title} onChange={(e) => change("title", e.target.value)} className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.title ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
              {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="edit-category" className="mb-2 block text-sm font-semibold text-slate-800">Category</label>
              <select id="edit-category" value={form.category} onChange={(e) => change("category", e.target.value)} className={`w-full rounded-xl border px-4 py-3.5 outline-none transition ${errors.category ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`}>
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
              {errors.category && <p className="mt-2 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="edit-image" className="mb-2 block text-sm font-semibold text-slate-800">Cover image URL <span className="font-normal text-slate-400">(optional)</span></label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${errors.image ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50"}`}>
                <ImageIcon size={18} className="text-slate-400" />
                <input id="edit-image" type="text" value={form.image} onChange={(e) => change("image", e.target.value)} className="w-full bg-transparent text-sm outline-none" />
              </div>
              {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
              {form.image && !errors.image && <img src={form.image} alt="Preview" className="mt-3 h-56 w-full rounded-2xl object-cover" />}
            </div>

            <div>
              <label htmlFor="edit-body" className="mb-2 block text-sm font-semibold text-slate-800">Story</label>
              <textarea id="edit-body" rows={12} value={form.body} onChange={(e) => change("body", e.target.value)} className={`w-full resize-y rounded-2xl border p-5 text-base leading-7 outline-none transition ${errors.body ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"}`} />
              {errors.body && <p className="mt-2 text-sm text-red-500">{errors.body}</p>}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
