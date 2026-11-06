import { useEffect, useState } from "react";
import { projects as backupProjects } from "../data/projects";

// Show the backup projects straight away, then swap in the database's if they differ.
export function useProjects() {
  const [projects, setProjects] = useState(backupProjects);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", { signal: controller.signal });
        if (!response.ok) throw new Error(`API error ${response.status}`);

        const data = await response.json();
        setProjects((current) =>
          JSON.stringify(current) === JSON.stringify(data) ? current : data,
        );
      } catch {
        // API offline or too slow: the visitor simply keeps seeing the backup projects.
      } finally {
        clearTimeout(timer);
      }
    }

    loadProjects();

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return projects;
}