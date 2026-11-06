import { useState } from "react";

const EMPTY = { title: "", tagline: "", description: "", tech: [], github: "", live: "" };

// One form for both adding and editing. The limits match the server's checks.
export default function ProjectForm({ project, onSave, onCancel }) {
  const start = project ?? EMPTY;
  const [values, setValues] = useState({ ...start, tech: start.tech.join(", ") });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field) => (event) => setValues({ ...values, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await onSave({ ...values, tech: values.tech.split(",").map((item) => item.trim()).filter(Boolean) });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-night px-3 py-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-surface p-6">
      <h2 className="font-display text-3xl">{project ? `Edit ${project.title}` : "Add a project"}</h2>

      <label className="block text-sm">
        Title
        <input required maxLength={80} value={values.title} onChange={update("title")} className={inputClass} />
      </label>

      <label className="block text-sm">
        Tagline
        <input required maxLength={60} value={values.tagline} onChange={update("tagline")} className={inputClass} />
      </label>

      <label className="block text-sm">
        Description
        <textarea
          required
          maxLength={500}
          rows={4}
          value={values.description}
          onChange={update("description")}
          className={inputClass}
        />
      </label>

      <label className="block text-sm">
        Technologies, separated by commas
        <input value={values.tech} onChange={update("tech")} placeholder="React, Node.js" className={inputClass} />
      </label>

      <label className="block text-sm">
        GitHub link (optional)
        <input type="url" value={values.github} onChange={update("github")} className={inputClass} />
      </label>

      <label className="block text-sm">
        Live link (optional)
        <input type="url" value={values.live} onChange={update("live")} className={inputClass} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-md bg-white px-5 py-2 font-semibold text-night transition-colors hover:bg-white/80 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-md bg-white/15 px-5 py-2 font-semibold transition-colors hover:bg-white/25"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}