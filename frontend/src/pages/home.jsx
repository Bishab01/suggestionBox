import { useEffect, useState } from "react";
import { MessageSquare, Newspaper } from "lucide-react";
import api from "../api/axios";
import { decodeHtml, formatDate } from "../utils/format";
import NewsDetail from "./newsDetail";

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    api
      .get("getNews.php")
      .then((res) => {
        if (!res.data.success) {
          setError(res.data.message || "Could not load news and plans.");
          return;
        }
        setNews(res.data.news);
        setError("");
      })
      .catch(() => setError("Could not load news and plans."))
      .finally(() => setLoading(false));
  }, []);

  if (selectedNews) {
    return (
      <NewsDetail
        item={selectedNews}
        onBack={() => setSelectedNews(null)}
      />
    );
  }

  return (
    <div className="body responsiveM">
      <h1 className="text-3xl font-bold text-[#023166]">Government News &amp; Plans</h1>
      <p className="mt-2 mb-8 text-gray-600">
        Browse published announcements and development plans, and share your
        feedback.
      </p>

      {loading && <p className="text-gray-500 font-medium">Loading...</p>}
      {error && <div className="alertError">{error}</div>}

      <div className="newsGrid">
        {news
        .filter((item) => item.status === "published")
        .map((item) => (
          <div
            onClick={()=>setSelectedNews(item)}
            key={item.nid}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="self-start">{item.category}</span>
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-600">{decodeHtml(item.excerpt)}</p>
              <div className="mt-auto flex items-center justify-between pt-2 text-xs text-gray-500">
                <span>{formatDate(item.published_at)}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3.5" />
                  {item.comments_count} comments
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && news.length === 0 && (
        <div className="w-full h-90 border border-gray-100 bg-white rounded-lg shadow-lg
          flex flex-col items-center justify-center text-center text-gray-500"
        >
          <Newspaper className="size-17 md:size-19"/>
          <p className="text-md md:text-lg font-medium tracking-wide pt-3">No news has been published yet.</p>
          <p className="text-sm md:text-md font-medium tracking-wide pt-1">We’ll share the latest updates as soon as they’re verified.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
