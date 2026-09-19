import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { title, body, image, category } = req.body;

    const post = await Post.create({
      title: title?.trim(),
      body: body?.trim(),
      image: image?.trim() || undefined,
      category,
      author: req.userId,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.author) filter.author = req.query.author;
    if (req.query.category) filter.category = req.query.category;

    const posts = await Post.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");

    if (!post) return res.status(404).json({ message: "Not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, body, image, category } = req.body;

    if (title !== undefined) post.title = title.trim();
    if (body !== undefined) post.body = body.trim();
    if (image !== undefined) post.image = image.trim() || undefined;
    if (category !== undefined) post.category = category;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await post.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Not found" });

    const index = post.likes.findIndex(
      (id) => id.toString() === req.userId,
    );

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      liked: index === -1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
