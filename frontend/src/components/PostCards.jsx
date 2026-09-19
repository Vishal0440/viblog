import React from "react";
import { ArrowUpRight, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/api";

const readTime = (body = "") => Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));

export default function PostCards({ post }) {
  return (
    <Link to={`/post/${post._id}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {post.image ? (
          <img src={getImageUrl(post.image)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-indigo-50 to-slate-100 text-4xl font-black text-indigo-600">Vi</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">{post.category}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-xl font-bold leading-snug text-slate-950 transition group-hover:text-indigo-700">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{post.body}</p>

        <div className="mt-auto pt-5">
          <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100"><User size={15} className="text-slate-500" /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold capitalize text-slate-800">{post.author?.name || "Unknown"}</p>
              <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · {readTime(post.body)} min read</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-slate-400"><Heart size={14} /> {post.likes?.length || 0}</span>
            <ArrowUpRight size={18} className="text-indigo-600" />
          </div>
        </div>
      </div>
    </Link>
  );
}
