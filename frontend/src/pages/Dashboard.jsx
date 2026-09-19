import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Edit3,
  FileText,
  Heart,
  Plus,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api, { getImageUrl } from "../utils/api";
import ShareModal from "../components/ShareModal";
import { getCategoryLabel } from "../utils/categories";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};
const truncate = (text = "", max = 140) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [shareBlog, setShareBlog] = useState(null);

  const loadPosts = () => {
    if (!token || !user?._id) return navigate("/login");
    setLoading(true);
    setError(false);
    api
      .get("/posts", {
        params: { author: user._id },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setPosts(res.data.filter((p) => p.author?._id === user._id)),
      )
      .catch(() => {
        setError(true);
        toast.error("Failed to load posts");
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    loadPosts();
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((p) => p.filter((x) => x._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-4xl bg-linear-to-br from-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-600/15 sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-100">
                Writer dashboard
              </p>
              <h1 className="mt-2 text-3xl font-black capitalize sm:text-4xl">
                Hello, {user?.name} 👋
              </h1>
              <p className="mt-2 text-indigo-100">
                Manage your published articles from one place.
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg hover:bg-indigo-50"
            >
              <Plus size={17} /> Write Post
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <FileText size={18} />
              <p className="mt-3 text-2xl font-black">{posts.length}</p>
              <p className="text-xs text-indigo-100">Published</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <Heart size={18} />
              <p className="mt-3 text-2xl font-black">
                {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}
              </p>
              <p className="text-xs text-indigo-100">Total likes</p>
            </div>
            <div className="hidden rounded-2xl bg-white/10 p-4 sm:block">
              <User size={18} />
              <p className="mt-3 text-lg font-black capitalize">{user?.name}</p>
              <p className="text-xs text-indigo-100">Author</p>
            </div>
          </div>
        </section>

        <div className="mb-6 mt-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Your writing
            </p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">
              My Posts
            </h2>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-white py-20 text-center">
            <p className="text-slate-600">
              Something went wrong loading your posts.
            </p>
            <button
              onClick={loadPosts}
              className="mt-4 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center">
            <FileText className="mx-auto text-slate-300" size={44} />
            <p className="mt-4 text-slate-500">
              You haven't written any posts yet.
            </p>
            <Link
              to="/create"
              className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row">
                  <Link
                    to={`/post/${post._id}`}
                    className="h-52 shrink-0 sm:h-auto sm:w-52"
                  >
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                          {getCategoryLabel(post.category)}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-950">
                          {post.title}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {truncate(post.body)}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-5">
                      <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Read <ArrowUpRight size={14} />
                      </button>
                      <button
                        onClick={() => setShareBlog(post)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                        title="Share"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/edit/${post._id}`)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deletePost(post._id)}
                        disabled={deletingId === post._id}
                        className="ml-auto rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {shareBlog && (
        <ShareModal post={shareBlog} onClose={() => setShareBlog(null)} />
      )}
    </main>
  );
}
