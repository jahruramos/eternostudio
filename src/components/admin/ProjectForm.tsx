"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProjectFormData {
  title: string;
  slug: string;
  client: string;
  location: string;
  duration: string;
  services: string;
  overview: string;
  thumbnail: string;
  status: string;
}

interface ProjectFormProps {
  initialData?: ProjectFormData & { id?: number };
  mode: "create" | "edit";
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    client: initialData?.client || "",
    location: initialData?.location || "",
    duration: initialData?.duration || "",
    services: initialData?.services || "",
    overview: initialData?.overview || "",
    thumbnail: initialData?.thumbnail || "",
    status: initialData?.status || "draft",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title
    if (name === "title" && mode === "create") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        overview: formData.overview.trim(),
      };

      const url =
        mode === "create"
          ? "/api/projects"
          : `/api/projects/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save project");
      }

      const project = await res.json();
      router.push(`/admin-eternostd/projects/${project.id}/edit`);
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error al guardar el proyecto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm text-cream/50 mb-2">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-cream/50 mb-2">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            pattern="[a-z0-9-]+"
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-cream/50 mb-2">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-cream/50 mb-2">Cliente</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-cream/50 mb-2">Ubicación</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-cream/50 mb-2">Duración</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-cream/50 mb-2">Servicios</label>
          <input
            type="text"
            name="services"
            value={formData.services}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-cream/50 mb-2">Thumbnail</label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm border border-cream/20 hover:border-cream/40 transition-colors"
          >
            Seleccionar imagen
          </button>
          {formData.thumbnail && (
            <div className="flex items-center gap-2">
              <img
                src={formData.thumbnail}
                alt="Thumbnail"
                className="w-12 h-12 object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, thumbnail: "" }))}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-cream/50 mb-2">Descripción</label>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-cream/5 border border-cream/10 focus:border-cream/30 outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-cream text-negro font-medium hover:bg-cream/90 transition-colors disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : mode === "create"
            ? "Crear proyecto"
            : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-cream/20 hover:border-cream/40 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
