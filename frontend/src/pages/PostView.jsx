import React, { useEffect, useState } from "react";
import api, { getImageUrl } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Heart, Share2, User } from "lucide-react";
import { toast } from "react-hot-toast";
import ShareModal from "../components/ShareModal";
import { getCategoryLabel } from "../utils/categories";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};
const readTime = (body = "") =>
  Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  useEffect(() => {
    setPost(null);
    setError(false);
    api
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLiked(Boolean(user?._id && res.data.likes?.includes(user._id)));
      })
      .catch(() => setError(true));
  }, [id]);

  const toggleLike = async () => {
    if (!token) return toast.error("Please login first");
    const wasLiked = liked;
    setLiked(!wasLiked);
    try {
      await api.post(
        `/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setLiked(Boolean(user?._id && res.data.likes?.includes(user._id)));
    } catch {
      setLiked(wasLiked);
      toast.error("Failed to update like");
    }
  };

  if (error)
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <AlertCircle size={44} className="text-red-400" />
        <p className="mt-4 text-slate-600">
          This post couldn't be found or failed to load.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} /> Back to Feed
        </button>
      </div>
    );
  if (!post)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );

  const paragraphs = post.body?.split(/\n\s*\n/).filter(Boolean) || [];
  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <article className="mx-auto max-w-5xl px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} /> Back to Feed
        </button>
        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
          <header className="px-6 pb-8 pt-8 sm:px-10 sm:pt-10 lg:px-14">
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
              {getCategoryLabel(post.category)}
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <User size={18} />
              </div>
              <div>
                <p className="font-semibold capitalize text-slate-900">
                  {post.author?.name || "Unknown"}
                </p>
                <p>
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {readTime(post.body)} min read
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5">
              <button
                onClick={toggleLike}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${liked ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600"}`}
              >
                <Heart size={17} fill={liked ? "currentColor" : "none"} />{" "}
                {post.likes?.length || 0}
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Share2 size={17} /> Share
              </button>
            </div>
          </header>
          {post.image && (
            <div className="px-3 sm:px-6 lg:px-8">
              <img
                src={getImageUrl(post.image)}
                alt={post.title}
                className="h-[280px] w-full rounded-3xl object-cover sm:h-[430px]"
              />
            </div>
          )}
          <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-14 lg:px-0">
            <div className="space-y-7 text-[18px] leading-[1.9] text-slate-700 sm:text-[19px]">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </article>
      {shareOpen && (
        <ShareModal post={post} onClose={() => setShareOpen(false)} />
      )}
    </main>
  );
}
