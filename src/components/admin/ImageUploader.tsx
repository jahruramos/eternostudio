"use client";

import { useState, useRef } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface ProjectImage {
  id: number;
  src: string;
  alt: string;
  sortOrder: number;
}

interface ImageUploaderProps {
  projectId: number;
  images: ProjectImage[];
  onImagesUpdate: (images: ProjectImage[]) => void;
}

export default function ImageUploader({
  projectId,
  images,
  onImagesUpdate,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const [altValue, setAltValue] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
      formData.append("alts", "");
    }

    try {
      const res = await adminFetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const newImages = await res.json();
      onImagesUpdate([...images, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error al subir las imágenes");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!confirm("¿Eliminar esta imagen?")) return;

    try {
      await adminFetch(`/api/projects/${projectId}/images/${imageId}`, {
        method: "DELETE",
      });
      onImagesUpdate(images.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error al eliminar la imagen");
    }
  }

  async function handleAltSave(imageId: number) {
    try {
      await adminFetch(`/api/projects/${projectId}/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: altValue }),
      });
      onImagesUpdate(
        images.map((img) =>
          img.id === imageId ? { ...img, alt: altValue } : img
        )
      );
      setEditingAlt(null);
    } catch (error) {
      console.error("Error updating alt:", error);
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);

    onImagesUpdate(newImages);

    try {
      await adminFetch(`/api/projects/${projectId}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newImages.map((img) => img.id),
        }),
      });
    } catch (error) {
      console.error("Error reordering:", error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-cream/50">
          Imágenes ({images.length})
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 text-sm border border-cream/20 hover:border-cream/40 transition-colors disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "+ Subir imágenes"}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-cream/10">
          <p className="text-cream/30">No hay imágenes todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative border border-cream/10 hover:border-cream/20 transition-colors"
            >
              <div className="aspect-[4/3] bg-cream/5 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-2 left-2 right-2 flex items-start justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index - 1)}
                      className="w-7 h-7 bg-negro/80 text-cream text-xs flex items-center justify-center hover:bg-negro"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index + 1)}
                      className="w-7 h-7 bg-negro/80 text-cream text-xs flex items-center justify-center hover:bg-negro"
                    >
                      →
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="w-7 h-7 bg-red-500/80 text-cream text-xs flex items-center justify-center hover:bg-red-500"
                >
                  ×
                </button>
              </div>

              <div className="p-2">
                {editingAlt === image.id ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={altValue}
                      onChange={(e) => setAltValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAltSave(image.id);
                        if (e.key === "Escape") setEditingAlt(null);
                      }}
                      className="flex-1 px-2 py-1 text-xs bg-cream/5 border border-cream/20 outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleAltSave(image.id)}
                      className="px-2 py-1 text-xs bg-cream/10 hover:bg-cream/20"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <p
                    className="text-xs text-cream/50 truncate cursor-pointer hover:text-cream/70"
                    onClick={() => {
                      setEditingAlt(image.id);
                      setAltValue(image.alt);
                    }}
                  >
                    {image.alt || "Click para agregar descripción"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
