import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Newspaper } from "lucide-react";
import { mockNews } from "../data/newsData";

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

//   useEffect(() => {
//     api
//       .get(`/news?page=${page}`)
//       .then((res) => {
//         setNews(res.data.data);
//         setLastPage(res.data.last_page || 1);
//         setError("");
//       })
//       .catch(() => setError("Could not load news and plans."))
//       .finally(() => setLoading(false));
//   }, [page]);

  return (
    <div className="body responsiveM">
      <h1 className="text-3xl font-bold text-[#023166]">Government News &amp; Plans</h1>
      <p className="mt-2 mb-8 text-gray-600">
        Browse published announcements and development plans, and share your
        feedback.
      </p>

      {loading && <p className="text-gray-500 font-medium">Loading...</p>}
      {/* {error && <div className="alertError">{error}</div>} */}

      <div className="newsGrid">
        {mockNews.map((item) => (
          <div
            key={item.id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="self-start">{item.category || "Announcement"}</span>
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.excerpt}</p>
              <div className="mt-auto flex items-center justify-between pt-2 text-xs text-gray-500">
                <span>{new Date(item.published_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3.5" />
                  {item.comments_count} comments
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && mockNews.length === 0 && (
        <div className="w-full h-90 border border-gray-100 bg-white rounded-lg shadow-lg
          flex flex-col items-center justify-center text-center text-gray-500"
        >
          <Newspaper className="size-17 md:size-19"/>
          <p className="text-md md:text-lg font-medium tracking-wide pt-3">No news has been published yet.</p>
          <p className="text-sm md:text-md font-medium tracking-wide pt-1">We’ll share the latest updates as soon as they’re verified.</p>
        </div>
      )}

      {/* {lastPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            className="btnOutline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {lastPage}
          </span>
          <button
            className="btnOutline"
            disabled={page >= lastPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )} */}
    </div>
  );
}

export default Home;
