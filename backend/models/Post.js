import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "technology",
        "mobile-connectivity",
        "5g-networks",
        "entertainment",
        "digital-lifestyle",
        "tips-guides",
        "news-updates",
        "gaming",
        "ai-innovation",
        "business",
        "education",
        "trending",
      ],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
