export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  const value = email.trim();
  if (!value) return "Email is required.";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return "";
};

export const validateName = (name) => {
  const value = name.trim();
  if (!value) return "Name is required.";
  if (value.length < 2) return "Name must be at least 2 characters.";
  if (value.length > 50) return "Name must be 50 characters or less.";
  return "";
};

export const validatePost = (form) => {
  const errors = {};

  const title = form.title.trim();
  const body = form.body.trim();

  if (!title) errors.title = "Title is required.";
  else if (title.length < 5) errors.title = "Title must be at least 5 characters.";
  else if (title.length > 100) errors.title = "Title must be 100 characters or less.";

  if (!form.category) errors.category = "Please select a category.";

  if (form.image.trim()) {
    try {
      const url = new URL(form.image.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.image = "Image URL must start with http:// or https://.";
      }
    } catch {
      errors.image = "Enter a valid image URL.";
    }
  }

  if (!body) errors.body = "Story is required.";
  else if (body.length < 50) errors.body = "Story must be at least 50 characters.";

  return errors;
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
