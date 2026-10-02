import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { decodeHtml } from "../../utils/format";

function NewsForm() {
  const { nid } = useParams();
  const isEdit = Boolean(nid);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    author: "",
    excerpt: "",
    content: "",
    status: "draft",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success"); //success or error
  const [submitting, setSubmitting] = useState(false);

  const titleRegexp = /^[a-zA-Z\s]+$/;

  // Edit mode: there is no "get one news" endpoint, so load the list (admins get
  // drafts too) and pick the one being edited. excerpt/content are stored HTML-escaped.
  useEffect(() => {
    if (!isEdit) return;
    api
      .get("getNews.php")
      .then((res) => {
        const item = res.data.success && res.data.news.find((n) => n.nid === Number(nid));
        if (!item) {
          setMsg("News not found.");
          setMsgType("error");
          return;
        }
        setForm({
          title: item.title,
          // getNews.php sends fallbacks for empty category/author; don't put them in the form
          category: item.category === "Uncategorized" ? "" : item.category,
          author: item.author === "Anonymous" ? "" : item.author,
          excerpt: decodeHtml(item.excerpt),
          content: decodeHtml(item.content),
          status: item.status,
        });
      })
      .catch(() => {
        setMsg("Could not load the news item.");
        setMsgType("error");
      });
  }, [nid, isEdit]);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!titleRegexp.test(form.title))
    {
      setMsg("Title shouldn't contain numbers or special characters");
      setMsgType("error");
      return;
    }

    setSubmitting(true);
    setMsg("");
    try {
      const response = isEdit
        ? await api.post("editNews.php", { ...form, nid: Number(nid) })
        : await api.post("addNews.php", form);

      if (!response.data.success) {
        setMsg(response.data.message);
        setMsgType("error");
        return;
      }

      setMsg(response.data.message);
      setMsgType("success");

      // Short pause so the success message is visible, then back to the dashboard
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1200);
    } catch (error) {
      setMsg(
        error.response
          ? error.response.data?.message || "Could not save news item."
          : "Cannot reach the server. Please try again."
      );
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="containerNarrow">
      <h1 className="mb-6 text-3xl font-bold text-[#023166]">
        {isEdit ? "Edit News / Plan" : "Publish News / Plan"}
      </h1>

      <form
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-lg font-semibold text-[#023166]">
            Basic Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide the basic details of the news or development plan.
          </p>
        </div>
        <p className="formLabel">Note: All fields with * are required.</p>
        
        <label className="formLabel">
          Title*
        </label>
        <input 
          className="inputBox" 
          required 
          value={form.title} 
          placeholder="e.g. New Public Service Portal Launched"
          onChange={handleChange("title")} 
        />

        <label className="formLabel">
          Category
        </label>
        <input
          className="inputBox"
          placeholder="e.g. Infrastructure, Health, Budget"
          value={form.category || ""}
          onChange={handleChange("category")}
        />

        <label className="formLabel">
          Author
        </label>
        <input 
          className="inputBox" 
          value={form.author || ""} 
          placeholder="Enter name of author(s)"
          onChange={handleChange("author")} 
        />
        
        <label className="formLabel">
          Excerpt (short summary shown in the list)
        </label>
        <textarea
          className="inputBox py-1.5"
          rows={2}
          maxLength={500}
          value={form.excerpt || ""}
          onChange={handleChange("excerpt")}
        />
  
        <label className="formLabel">
          Content* (full details of the news/plan)
        </label>
        <textarea
          className="inputBox py-1.5"
          rows={10}
          required
          value={form.content}
          onChange={handleChange("content")}
        />
        
        <label className="formLabel">
          Status
        </label>
        <select 
          className="inputBox text-sm text-gray-800" 
          value={form.status} 
          onChange={handleChange("status")}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {msg && (
          <p
            className={`mt-2 mb-4 font-medium rounded-md text-center px-3 py-1 border
              ${
                  msgType === "success"
                      ? "text-green-700 bg-white/95 border-green-300"
                      : "text-red-600 bg-white/95 border-red-300"
              }`}
          >
              {msg}
          </p>
        )}

        <button className="btnPrimary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default NewsForm;
