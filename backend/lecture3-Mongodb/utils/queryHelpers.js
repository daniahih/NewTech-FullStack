/**
 * Helpers shared by the search / filter endpoints.
 *
 * The important lesson here: NEVER pass raw user input straight into
 * `new RegExp(...)`. A user could send `.*` (matches everything) or a
 * catastrophic pattern like `(a+)+$` and hang the whole Node process
 * (ReDoS). We escape every regex metacharacter first, then build the
 * pattern ourselves.
 */

const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

// "Sci-Fi (2019)?" -> "Sci\-Fi \(2019\)\?"
export const escapeRegex = (str = "") =>
  String(str).replace(REGEX_SPECIAL_CHARS, "\\$&");

/**
 * Build a safe, case-insensitive RegExp from user input.
 * mode: "contains" (default) | "startsWith" | "endsWith" | "exact"
 */
export const buildSafeRegex = (value, mode = "contains") => {
  const safe = escapeRegex(value.trim());

  switch (mode) {
    case "exact":
      return new RegExp(`^${safe}$`, "i");
    case "startsWith":
      return new RegExp(`^${safe}`, "i");
    case "endsWith":
      return new RegExp(`${safe}$`, "i");
    default:
      return new RegExp(safe, "i");
  }
};

/**
 * Normalise ?page= & ?limit= into safe numbers.
 * `limit` is capped so a client can't ask for 1,000,000 documents.
 */
export const parsePagination = ({ page, limit }, maxLimit = 100) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), maxLimit);

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

/**
 * Turn ?sortBy=rating&order=desc into { rating: -1 }.
 * Only whitelisted fields are allowed so a client cannot sort on an
 * unindexed / internal field.
 */
const SORTABLE_FIELDS = [
  "title",
  "rating",
  "year",
  "views",
  "releaseDate",
  "createdAt",
];

export const parseSort = ({ sortBy, order }) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const direction = order === "asc" ? 1 : -1;

  return { [field]: direction };
};

// "true"/"false" from a query string are strings, not booleans.
export const parseBoolean = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};
