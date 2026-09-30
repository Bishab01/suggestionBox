import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

function NewsForm() {
  // const { id } = useParams();
  // const isEdit = Boolean(id);
  const isEdit = false;
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

  // useEffect(() => {
  //   if (isEdit) {
  //     api.get(`/admin/news/${id}`).then((res) => setForm(res.data));
  //   }
  // }, [id, isEdit]);

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
    setMsg("News/Plan saved");
    setMsgType("success");
    // setSubmitting(true);

    // try {
    //   if (isEdit) {
    //     await api.put(`/admin/news/${id}`, form);
    //   } else {
    //     await api.post("/admin/news", form);
    //   }
    //   navigate("/admin");
    // } catch (err) {
    //   const data = err.response?.data;
    //   setError(
    //     data?.message ||
    //       (data?.errors && Object.values(data.errors).flat().join(" ")) ||
    //       "Could not save news item."
    //   );
    // } finally {
    //   setSubmitting(false);
    // }
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
