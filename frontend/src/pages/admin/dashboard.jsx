import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { formatDate } from "../../utils/format";
import {Plus, Newspaper} from "lucide-react";

function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNews = async () => {
    try {
      const res = await api.get("getNews.php");
      if (!res.data.success) {
        setError(res.data.message || "Could not load news.");
        return;
      }
      setNews(res.data.news);
      setError("");
    } catch {
      setError("Could not load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // toggleStatus.php expects the CURRENT status and flips it
  const togglePublish = async (item) => {
    try {
      const res = await api.post("toggleStatus.php", { nid: item.nid, nStatus: item.status });
      if (!res.data.success) {
        setError(res.data.message || "Could not change status.");
        return;
      }
      await loadNews();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change status.");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? Its comments will be deleted too.`)) return;
    try {
      const res = await api.post("deleteNews.php", { nid: item.nid });
      if (!res.data.success) {
        setError(res.data.message || "Could not delete news.");
        return;
      }
      await loadNews();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete news.");
    }
  };

  return (
    <div className="body responsiveM">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-[#023166]">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin/publish_news" className="btnPrimary gap-1">
            <Plus className="size-4"/>
            Publish News
          </Link>
          <Link to="/admin/comments" className="btnOutline">
            Moderate Comments
          </Link>
        </div>
      </div>

      {loading && <p className="text-gray-500 font-medium">Loading...</p>}
      {error && <div className="alertError">{error}</div>}

      <div className="overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">

          <thead className="bg-[#023166] text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden md:block px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Comments</th>
              <th className="hidden md:block px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {news.map((item) => (
              <tr key={item.nid} className="hover:bg-gray-50">
                
                <td>
                  {/* status for small screen */}
                  <div className="md:hidden px-4 pt-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  
                  {/* title */}
                  <div className="px-4 py-3 font-medium text-gray-900">{item.title}</div>
                </td>

                {/* status: published or draft */}
                <td className="hidden md:block px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* comment count */}
                <td className="px-4 py-3">{item.comments_count}</td>

                {/* published date */}
                <td className="hidden md:block px-4 py-3 whitespace-nowrap">
                  {formatDate(item.published_at)}
                </td>

                {/* action button */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="btnSmall" 
                    onClick={() => togglePublish(item)}
                    >
                      {item.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <Link 
                      className="btnSmall" 
                      to={`/admin/news/${item.nid}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btnSmall btnDanger"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Dashboard;
