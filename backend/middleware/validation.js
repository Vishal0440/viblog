const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const categories = new Set([
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
]);

export const validateAuth = (req, res, next) => {
  const { name, email, password } = req.body || {};
  const errors = {};

  if (req.path === "/signup") {
    if (!name?.trim()) errors.name = "Name is required.";
    else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    else if (name.trim().length > 50) errors.name = "Name must be 50 characters or less.";
  }

  if (!email?.trim()) errors.email = "Email is required.";
  else if (!emailRegex.test(email.trim())) errors.email = "Enter a valid email address.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Please fix the highlighted fields.", errors });
  }

  next();
};

export const validatePost = (req, res, next) => {
  const { title, body, image, category } = req.body || {};
  const errors = {};

  if (!title?.trim()) errors.title = "Title is required.";
  else if (title.trim().length < 5) errors.title = "Title must be at least 5 characters.";
  else if (title.trim().length > 100) errors.title = "Title must be 100 characters or less.";

  if (!body?.trim()) errors.body = "Story is required.";
  else if (body.trim().length < 50) errors.body = "Story must be at least 50 characters.";

  if (!category) errors.category = "Category is required.";
  else if (!categories.has(category)) errors.category = "Select a valid category.";

  if (image?.trim()) {
    try {
      const url = new URL(image.trim());
      if (!["http:", "https:"].includes(url.protocol)) errors.image = "Image URL must use http:// or https://.";
    } catch {
      errors.image = "Enter a valid image URL.";
    }
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Please fix the highlighted fields.", errors });
  }

  next();
};
