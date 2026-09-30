import { useEffect, useState } from "react";
import api from "../../api/axios";
import { comments } from "../../data/commentsData";
import { SquareText } from "lucide-react";

function CommentsModeration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   api
  //     .get("/admin/comments")
  //     .then((res) => setComments(res.data.data))
  //     .catch(() => setError("Could not load comments."))
  //     .finally(() => setLoading(false));
  // }, []);

  // const handleDelete = async (id) => {
  //   if (!confirm("Remove this comment?")) return;
  //   try {
  //     await api.delete(`/admin/comments/${id}`);
  //     setComments((prev) => prev.filter((c) => c.id !== id));
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Delete failed.");
  //   }
  // };

  return (
    <div className="body responsiveM">
      <h1 className="mb-8 text-3xl font-bold text-[#023166]">Comment Moderation</h1>
      {loading && <p className="font-medium text-gray-500">Loading...</p>}
      {error && <div className="alertError">{error}</div>}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="font-semibold text-gray-900">
              {c.user?.name || "Citizen"} on{" "}
              <em className="font-normal">{c.news?.title || "a news item"}</em>
            </div>
            <p className="mt-1 text-gray-700">{c.body}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {c.created_at}
              </span>
              <button 
                className="btnSmall btnDanger" 
                // onClick={() => handleDelete(c.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && comments.length === 0 && (
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
