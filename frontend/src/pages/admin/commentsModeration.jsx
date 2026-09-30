import { useEffect, useState } from "react";
import api from "../../api/axios";

function CommentsModeration() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/comments")
      .then((res) => setComments(res.data.data))
      .catch(() => setError("Could not load comments."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this comment?")) return;
    try {
      await api.delete(`/admin/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold text-[#023166]">Comment Moderation</h1>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <div className="alertError">{error}</div>}

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="font-semibold text-gray-900">
              {c.user?.name || "Citizen"} on{" "}
              <em className="font-normal">{c.news?.title || "a news item"}</em>
            </div>
            <p className="mt-1 text-gray-700">{c.body}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </span>
              <button className="btnSmall btnDanger" onClick={() => handleDelete(c.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && comments.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}

export default CommentsModeration;
