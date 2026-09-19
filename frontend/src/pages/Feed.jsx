import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { CATEGORIES } from "../utils/categories";
import PostCards from "../components/PostCards";

const PAGE_SIZE = 6;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    setError(false);

    try {
      const params = category === "all" ? {} : { category };
      const res = await api.get("/posts", { params });
      setPosts(res.data);
    } catch {
      setError(true);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.body?.toLowerCase().includes(query)
    );
  }, [posts, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
            All Blogs
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">
            Explore the Feed
          </h1>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
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
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-white py-24 text-center">
            <AlertCircle size={40} className="mx-auto text-red-400" />
            <p className="mt-3 text-slate-600">
              Something went wrong loading posts.
            </p>
            <button
              onClick={loadPosts}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-24 text-center text-slate-500">
            No posts found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <PostCards key={post._id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => value - 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="min-w-12 rounded-xl bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => value + 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
