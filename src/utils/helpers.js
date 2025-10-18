export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export const getAutoTitle = (altTitles = []) => {
  if (!Array.isArray(altTitles) || altTitles.length === 0) return null;

  // Extract all possible titles
  const englishTitles = altTitles
    .filter((t) => t.en)
    .map((t) => t.en.trim())
    .filter(Boolean);

  const japaneseTitle = altTitles.find((t) => t.ja)?.ja?.trim() || null;

  // Priority:
  // 1️⃣ First English title (main)
  // 2️⃣ Any other English title
  // 3️⃣ Japanese title
  return englishTitles[0] || englishTitles[1] || japaneseTitle;
};
