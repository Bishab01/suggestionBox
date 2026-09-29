import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const empty = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  image_url: "",
  status: "draft",
};

function NewsForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/news/${id}`).then((res) => setForm(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/admin/news/${id}`, form);
      } else {
        await api.post("/admin/news", form);
      }
      navigate("/admin");
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message ||
          (data?.errors && Object.values(data.errors).flat().join(" ")) ||
          "Could not save news item."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="containerNarrow">
      <h1 className="mb-6 text-3xl font-bold text-[#023166]">
        {isEdit ? "Edit News / Plan" : "Publish News / Plan"}
      </h1>
      {error && <div className="alertError">{error}</div>}
      <form
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <label className="formLabel">
          Title
          <input className="formInput" required value={form.title} onChange={handleChange("title")} />
        </label>
        <label className="formLabel">
          Category
          <input
            className="formInput"
            placeholder="e.g. Infrastructure, Health, Budget"
            value={form.category || ""}
            onChange={handleChange("category")}
          />
        </label>
        <label className="formLabel">
          Excerpt (short summary shown in the list)
          <textarea
            className="formInput"
            rows={2}
            value={form.excerpt || ""}
            onChange={handleChange("excerpt")}
          />
        </label>
        <label className="formLabel">
          Cover image URL
          <input className="formInput" value={form.image_url || ""} onChange={handleChange("image_url")} />
        </label>
        <label className="formLabel">
          Content
          <textarea
            className="formInput"
            rows={10}
            required
            value={form.content}
            onChange={handleChange("content")}
          />
        </label>
        <label className="formLabel">
          Status
          <select className="formInput" value={form.status} onChange={handleChange("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <button className="btnPrimary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default NewsForm;
