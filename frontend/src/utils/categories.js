export const CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "mobile-connectivity", label: "Mobile & Connectivity" },
  { value: "5g-networks", label: "5G & Networks" },
  { value: "entertainment", label: "Entertainment" },
  { value: "digital-lifestyle", label: "Digital Lifestyle" },
  { value: "tips-guides", label: "Tips & Guides" },
  { value: "news-updates", label: "News & Updates" },
  { value: "gaming", label: "Gaming" },
  { value: "ai-innovation", label: "AI & Innovation" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "trending", label: "Trending" },
];

export const getCategoryLabel = (value) =>
  CATEGORIES.find((category) => category.value === value)?.label || value;
