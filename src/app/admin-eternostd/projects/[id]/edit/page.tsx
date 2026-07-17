"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import ImageUploader from "@/components/admin/ImageUploader";

interface Project {
  id: number;
  slug: string;
  title: string;
  client: string;
  location: string;
  duration: string;
  services: string;
  overview: string;
  thumbnail: string;
  status: string;
  images: {
    id: number;
    src: string;
    alt: string;
    sortOrder: number;
  }[];
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (!res.ok) {
          router.push("/admin-eternostd");
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setProject(data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/admin-eternostd");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.id, router]);

  function handleImagesUpdate(images: Project["images"]) {
    setProject((prev) => (prev ? { ...prev, images } : null));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cream/50">Cargando...</p>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Editar proyecto</h1>
          <a
            href={`/work/${project.slug}`}
            target="_blank"
            className="text-sm text-cream/50 hover:text-cream transition-colors"
          >
            Ver en sitio →
          </a>
        </div>

        <ProjectForm
          mode="edit"
          initialData={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            client: project.client,
            location: project.location,
            duration: project.duration,
            services: project.services,
            overview: project.overview || "",
            thumbnail: project.thumbnail,
            status: project.status,
          }}
        />

        <div className="mt-12 pt-8 border-t border-cream/10">
          <ImageUploader
            projectId={project.id}
            images={project.images || []}
            onImagesUpdate={handleImagesUpdate}
          />
        </div>
      </div>
    </div>
  );
}
