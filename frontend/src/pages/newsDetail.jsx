import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import {  comments } from "../data/commentsData";

function NewsDetail({item}) {
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const user = true;

  // useEffect(() => {
  //   api
  //     .get(`/news/${slug}`)
  //     .then((res) => {
  //       setItem(res.data);
  //       setComments(res.data.comments || []);
  //       setError("");
  //     })
  //     .catch(() => setError("This news item could not be found."))
  //     .finally(() => setLoading(false));
  // }, [slug]);

  // const handleComment = async (e) => {
  //   e.preventDefault();
  //   if (!commentText.trim()) return;
  //   setPosting(true);
  //   try {
  //     const res = await api.post(`/news/${item.id}/comments`, {
  //       body: commentText,
  //     });
  //     setComments((prev) => [res.data, ...prev]);
  //     setCommentText("");
  //     setError("");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Could not post comment.");
  //   } finally {
  //     setPosting(false);
  //   }
  // };

  return (
    <div className="containerNarrow rounded-xl border border-gray-200 bg-white shadow-sm my-5">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-[#1a73d3] hover:underline">
        <ArrowLeft className="size-4" /> Back to news
      </Link>

      {/* Basic Info */}
      <div>
        <span className="badge">{item.category || "Announcement"}</span>
        <h1 className="mt-2 text-3xl font-bold text-[#023166]">{item.title}</h1>
        <div className="mt-2 flex gap-4 text-sm text-gray-500">
          <span>By {item.author?.name || "Admin"}</span>
          <span>{item.published_at}</span>
        </div>
      </div>

      {/* Content */}
      <div
        className="my-6 space-y-4 leading-relaxed text-gray-800"
      >
        {item.content}
      </div>

      {/* Comments */}
      <section className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="mb-4 text-xl font-semibold text-[#023166]">
          Citizen Comments ({comments.length})
        </h2>

        {user ? (
          <form 
            className="mb-6 flex flex-col items-end gap-2" 
            // onSubmit={handleComment}
          >
            <textarea
              className="inputBox py-1.5"
              rows={6}
              placeholder={`Share your feedback on this ${item.category.toLowerCase()}`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={2000}
              required
            />
            <button className="btnPrimary" type="submit" disabled={posting}>
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="alertInfo">
            <Link to="/login" className="font-medium underline">Login</Link> as a citizen to leave a comment.
          </p>
        )}

        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="font-semibold text-gray-900">{c.user?.name || "Citizen"}</div>
              <p className="mt-1 text-gray-700">{c.body}</p>
              <span className="mt-2 block text-xs text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </li>
          ))}
          {comments.length === 0 && <p className="text-gray-500">Be the first to comment.</p>}
        </ul>
      </section>

      <ChevronDown 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none 
          w-7 h-7 text-gray-700 animate-bounce" 
      />

    </div>
  );
}

export default NewsDetail;
