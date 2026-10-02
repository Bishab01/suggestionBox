import { useEffect, useState } from "react";
import api from "../../api/axios";
import { decodeHtml, formatDateTime } from "../../utils/format";
import { SquareText } from "lucide-react";

function CommentsModeration() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComments = async () => {
    try {
      const res = await api.get("getAllComments.php");
      if (!res.data.success) {
        setError(res.data.message || "Could not load comments.");
        return;
      }
      setComments(res.data.comments);
      setError("");
    } catch {
      setError("Could not load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDelete = async (cid) => {
    if (!window.confirm("Remove this comment?")) return;
    try {
      const res = await api.post("deleteComment.php", { cid });
      if (!res.data.success) {
        setError(res.data.message || "Could not remove comment.");
        return;
      }
      await loadComments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove comment.");
    }
  };

  return (
    <div className="body responsiveM">
      <h1 className="mb-8 text-3xl font-bold text-[#023166]">Comment Moderation</h1>
      {loading && <p className="font-medium text-gray-500">Loading...</p>}
      {error && <div className="alertError">{error}</div>}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comments.map((c) => (
          <li key={c.cid} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="font-semibold text-gray-900">
              {c.user_name || "Citizen"} on{" "}
              <em className="font-normal">{c.news_title || "a news item"}</em>
            </div>
            <p className="mt-1 text-gray-700">{decodeHtml(c.body)}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {formatDateTime(c.created_at)}
              </span>
              <button 
                className="btnSmall btnDanger" 
                onClick={() => handleDelete(c.cid)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && !error && comments.length === 0 && (
        <div className="w-full h-90 border border-gray-100 bg-white rounded-lg shadow-lg
          flex flex-col items-center justify-center text-center text-gray-500"
        >
          <SquareText className="size-17 md:size-19"/>
          <p className="text-md md:text-lg font-medium tracking-wide pt-3">No comments yet.</p>
          <p className="text-sm md:text-md font-medium tracking-wide pt-1">Suggestions and Comments from the citizens will be displayed here.</p>
        </div>
      )}
    </div>
  );
}

export default CommentsModeration;
