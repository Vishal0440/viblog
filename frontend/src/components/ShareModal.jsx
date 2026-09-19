import React, { useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { FaWhatsapp, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export default function ShareModal({ post, onClose }) {
  const [copied, setCopied] = useState(false);

  const link = `${window.location.origin}/post/${post._id}`;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);

      setCopied(true);
      toast.success("Link copied");

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const shareNative = async () => {
    if (!navigator.share) {
      return copyLink();
    }

    try {
      await navigator.share({
        title: post.title,
        text: post.body?.slice(0, 120),
        url: link,
      });
    } catch {
      // User cancelled native sharing.
    }
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(
    `${post.title}\n${link}`,
  )}`;

  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    link,
  )}`;

  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    post.title,
  )}&url=${encodeURIComponent(link)}`;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Share
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Share this post
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Post Preview */}
          <div className="flex gap-4 rounded-2xl bg-slate-50 p-3">
            {post.image ? (
              <img
                src={post.image}
                alt=""
                className="h-20 w-24 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl font-black text-indigo-600">
                Vi
              </div>
            )}

            <div className="min-w-0 py-1">
              <h3 className="line-clamp-2 font-semibold text-slate-900">
                {post.title}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {post.body}
              </p>
            </div>
          </div>

          {/* Copy Link */}
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
            <LinkIcon size={17} className="ml-2 shrink-0 text-slate-400" />

            <input
              readOnly
              value={link}
              className="min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-600 outline-none"
            />

            <button
              onClick={copyLink}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}

              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Social Sharing */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {/* WhatsApp */}
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-xs font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-700"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <FaWhatsapp size={20} />
              </span>
              WhatsApp
            </a>

            {/* Facebook */}
            <a
              href={facebook}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <FaFacebookF size={18} />
              </span>
              Facebook
            </a>

            {/* X */}
            <a
              href={x}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                <FaXTwitter size={17} />
              </span>
              X
            </a>

            {/* Native Share */}
            <button
              onClick={shareNative}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <LinkIcon size={18} />
              </span>
              More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
