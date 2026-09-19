import React, { useEffect, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api, { getImageUrl } from "../utils/api";
import { CATEGORIES } from "../utils/categories";
import PostCards from "../components/PostCards";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch {
        toast.error("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const featured = posts[0];
  const query = search.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = category === "all" || post.category === category;
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.body?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const latestPosts = filteredPosts.slice(0, 6);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-4xl bg-slate-100 shadow-xl">
          {featured?.image && (
            <img
              src={getImageUrl(featured.image)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.42),transparent_35%),linear-gradient(110deg,#0F172A_20%,rgba(15,23,42,0.92)_60%,rgba(15,23,42,0.55))]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative grid min-h-[420px] items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-100 backdrop-blur">
                <Sparkles size={13} /> Vi Blog
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Ideas worth
                <span className="block text-indigo-400">sharing.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Discover thoughtful stories, practical guides, technology, and perspectives from the Vi Blog community.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-slate-400">
                <span>Technology</span>
                <span>•</span>
                <span>Ideas</span>
                <span>•</span>
                <span>Guides</span>
                <span>•</span>
                <span>Stories</span>
              </div>
            </div>

            {featured && (
              <Link
                to={`/post/${featured._id}`}
                className="group hidden overflow-hidden rounded-4xl border border-white/15 bg-white/10 p-6 backdrop-blur-md lg:block"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
                  Featured article
                </p>
                <h2 className="mt-4 line-clamp-3 text-2xl font-bold leading-tight text-white">
                  {featured.title}
                </h2>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">
                  {featured.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:gap-3">
                  Read story <ArrowRight size={16} />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Explore
            </p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">
              Latest Posts
            </h2>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm sm:min-w-[280px]">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {posts.length > 6 && (
              <Link
                to="/feed"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View all <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {latestPosts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center text-slate-500">
            No posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCards key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
