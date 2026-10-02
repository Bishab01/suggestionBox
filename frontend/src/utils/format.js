// The PHP side stores excerpt, content and comment bodies through htmlspecialchars(),
// so they come back as "&lt;", "&amp;", "&#039;" ... React already escapes text on
// render, so we turn them back into plain text here. The result is only ever used as
// text (never as HTML), and the textarea trick never runs scripts.
export const decodeHtml = (str) => {
  if (!str) return "";
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
};

// MySQL returns "YYYY-MM-DD HH:MM:SS" in the server timezone (+05:45, see db.php).
// Safari can't parse that format, so make it ISO 8601 with the offset.
export const parseDbDate = (str) => {
  if (!str) return null;
  const d = new Date(str.replace(" ", "T") + "+05:45");
  return isNaN(d) ? null : d;
};

export const formatDate = (str) => {
  const d = parseDbDate(str);
  return d ? d.toLocaleDateString() : "—";
};

export const formatDateTime = (str) => {
  const d = parseDbDate(str);
  return d ? d.toLocaleString() : "";
};
