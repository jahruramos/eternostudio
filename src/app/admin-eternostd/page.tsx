"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: number;
  slug: string;
  title: string;
  client: string;
  status: string;
  sortOrder: number;
  thumbnail: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (!cancelled) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id: number, slug: string) {
    if (!confirm(`¿Eliminar "${slug}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error al eliminar el proyecto");
    }
  }

  async function handleStatusToggle(id: number, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setProjects(
        projects.map((p) =>
          p.id === id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cream/50">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-bold">Proyectos</h1>
            <p className="text-cream/50 text-sm mt-1">
              {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin-eternostd/projects/new"
            className="px-4 py-2 bg-cream text-negro text-sm font-medium hover:bg-cream/90 transition-colors"
          >
            + Nuevo proyecto
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/50 mb-4">No hay proyectos todavía</p>
            <Link
              href="/admin-eternostd/projects/new"
              className="text-cream underline underline-offset-4 hover:text-cream/70"
            >
              Crear primer proyecto
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 border border-cream/10 hover:border-cream/20 transition-colors"
              >
                <div className="w-16 h-16 bg-cream/5 flex-shrink-0 overflow-hidden">
                  {project.thumbnail && (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium truncate">{project.title}</h2>
                    <button
                      onClick={() =>
                        handleStatusToggle(project.id, project.status)
                      }
                      className={`text-xs px-2 py-0.5 ${
                        project.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-cream/10 text-cream/50"
                      }`}
                    >
                      {project.status}
                    </button>
                  </div>
                  <p className="text-sm text-cream/50 truncate">
                    /work/{project.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin-eternostd/projects/${project.id}/edit`}
                    className="px-3 py-1.5 text-sm border border-cream/20 hover:border-cream/40 transition-colors"
                  >
                    Editar
                  </Link>
                  <a
                    href={`/work/${project.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 text-sm border border-cream/20 hover:border-cream/40 transition-colors"
                  >
                    Ver
                  </a>
                  <button
                    onClick={() => handleDelete(project.id, project.slug)}
                    className="px-3 py-1.5 text-sm border border-red-500/30 text-red-400 hover:border-red-500/50 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-cream/10">
          <Link
            href="/"
            className="text-sm text-cream/50 hover:text-cream transition-colors"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
