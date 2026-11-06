import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import LoginForm from "./LoginForm";
import ProjectForm from "./ProjectForm";

export default function Admin() {
  const [email, setEmail] = useState(null);
  const [checking, setChecking] = useState(true);

  // Ask the server who is logged in. A 401 just means nobody is.
  const checkLogin = useCallback(async () => {
    try {
      const me = await api("/me");
      setEmail(me.email);
    } catch {
      setEmail(null);
    } finally {
      setChecking(false);
    }
  }, []);

  // useCallback keeps this the same function between renders, so the list doesn't reload.
  const loggedOut = useCallback(() => setEmail(null), []);

  useEffect(() => {
    document.title = "Admin | Portfolio";
    checkLogin();
  }, [checkLogin]);

  if (checking) return <p className="p-8 text-muted">Loading…</p>;
  if (!email) return <LoginForm onLogin={checkLogin} />;

  return <Dashboard email={email} onLoggedOut={loggedOut} />;
}

function Dashboard({ email, onLoggedOut }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null); // null, "new", or the project being edited
  const [error, setError] = useState("");

  // If the session has expired, go back to the login form instead of showing an error.
  const handleError = useCallback(
    (err) => (err.status === 401 ? onLoggedOut() : setError(err.message)),
    [onLoggedOut],
  );

  const loadProjects = useCallback(async () => {
    try {
      setProjects(await api("/projects"));
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const saveProject = async (values) => {
    try {
      if (editing === "new") await api("/projects", { method: "POST", body: values });
      else await api(`/projects/${editing.id}`, { method: "PUT", body: values });
    } catch (err) {
      if (err.status === 401) return onLoggedOut();
      throw err; // The form shows this message next to the Save button.
    }

    setEditing(null);
    loadProjects();
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;

    try {
      await api(`/projects/${project.id}`, { method: "DELETE" });
      loadProjects();
    } catch (err) {
      handleError(err);
    }
  };

  const logOut = async () => {
    await api("/logout", { method: "POST" }).catch(() => {});
    onLoggedOut();
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">My Projects</h1>
          <p className="text-sm text-muted">Logged in as {email}</p>
        </div>

        <div className="flex gap-3">
          <a href="/" className="rounded-md bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
            View site
          </a>
          <button
            type="button"
            onClick={logOut}
            className="cursor-pointer rounded-md bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
          >
            Log out
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="mt-6 text-sm text-accent">
          {error}
        </p>
      )}

      <div className="mt-8">
        {editing ? (
          <ProjectForm
            key={editing === "new" ? "new" : editing.id}
            project={editing === "new" ? null : editing}
            onSave={saveProject}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="cursor-pointer rounded-md bg-white px-5 py-2 font-semibold text-night hover:bg-white/80"
          >
            + Add project
          </button>
        )}
      </div>

      <ul className="mt-8 space-y-3">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center justify-between gap-4 rounded-xl bg-surface p-4">
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-muted">{project.tagline}</p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setEditing(project)}
                className="cursor-pointer rounded-md bg-white/15 px-3 py-1 text-sm hover:bg-white/25"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteProject(project)}
                className="cursor-pointer rounded-md px-3 py-1 text-sm text-accent hover:bg-accent/10"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}