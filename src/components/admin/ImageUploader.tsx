"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { adminFetch, authHeaders } from "@/lib/admin-fetch";

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
  const dragCounter = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const [altValue, setAltValue] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  function hasFiles(e: React.DragEvent) {
    return Array.from(e.dataTransfer.types).includes("Files");
  }

  function handleDragEnter(e: React.DragEvent) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragCounter.current += 1;
    setIsDraggingFile(true);
  }

  function handleDragOverFiles(e: React.DragEvent) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeaveFiles(e: React.DragEvent) {
    if (!hasFiles(e)) return;
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDraggingFile(false);
  }

  function handleDropFiles(e: React.DragEvent) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingFile(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    uploadFiles(files);
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedImages: ProjectImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
        const pathname = `projects/${projectId}/img-${Date.now()}-${i}.${ext}`;

        const blob = await upload(pathname, file, {
          access: "public",
          contentType: file.type,
          handleUploadUrl: `/api/projects/${projectId}/images`,
          headers: authHeaders(),
        });

        const res = await adminFetch(`/api/projects/${projectId}/images/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: blob.url, alt: "" }),
        });

        if (!res.ok) throw new Error("Failed to save image");

        const newImage = await res.json();
        uploadedImages.push(newImage);
      }

      onImagesUpdate([...images, ...uploadedImages]);
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

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    uploadFiles(Array.from(files));
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function handleDeleteImage(imageId: number) {
    if (!confirm("¿Eliminar esta imagen?")) return;

    try {
      await adminFetch(`/api/projects/${projectId}/images/${imageId}`, {
        method: "DELETE",
      });
      onImagesUpdate(images.filter((img) => img.id !== imageId));
      setSelected((prev) => {
        if (!prev.has(imageId)) return prev;
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error al eliminar la imagen");
    }
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (
      !confirm(
        `¿Eliminar ${selected.size} imagen${selected.size !== 1 ? "es" : ""}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    const ids = Array.from(selected);

    try {
      const res = await adminFetch(`/api/projects/${projectId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) throw new Error("Failed to delete images");

      onImagesUpdate(images.filter((img) => !selected.has(img.id)));
      setSelected(new Set());
    } catch (error) {
      console.error("Error deleting images:", error);
      alert("Error al eliminar las imágenes");
    }
  }

  async function handleDeleteAll() {
    if (images.length === 0) return;
    if (
      !confirm(
        `¿Eliminar las ${images.length} imágenes? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      const res = await adminFetch(`/api/projects/${projectId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: images.map((img) => img.id) }),
      });

      if (!res.ok) throw new Error("Failed to delete images");

      onImagesUpdate([]);
      setSelected(new Set());
    } catch (error) {
      console.error("Error deleting images:", error);
      alert("Error al eliminar las imágenes");
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

  async function persistOrder(newImages: ProjectImage[]) {
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

  async function handleReorder(fromIndex: number, toIndex: number) {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);

    onImagesUpdate(newImages);
    await persistOrder(newImages);
  }

  async function handleDropOn(targetId: number) {
    const fromId = draggingId;
    setDraggingId(null);
    setDragOverId(null);

    if (fromId === null || fromId === targetId) return;

    const fromIndex = images.findIndex((img) => img.id === fromId);
    const toIndex = images.findIndex((img) => img.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);

    onImagesUpdate(newImages);
    await persistOrder(newImages);
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOverFiles}
      onDragLeave={handleDragLeaveFiles}
      onDrop={handleDropFiles}
      className={`relative space-y-4 transition-colors ${
        isDraggingFile ? "outline outline-1 outline-offset-4 outline-cream/40" : ""
      }`}
    >
      {isDraggingFile && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-negro/70">
          <p className="text-sm text-cream">Suelta las imágenes para subirlas</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm text-cream/50">
          Imágenes ({images.length})
        </h3>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          {images.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="px-4 py-2 text-sm border border-red-500/30 text-red-400 hover:border-red-500/50 transition-colors"
            >
              Eliminar todas
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm border border-cream/20 hover:border-cream/40 transition-colors disabled:opacity-50"
          >
            {uploading ? "Subiendo..." : "+ Subir imágenes"}
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between border border-cream/20 bg-cream/5 px-4 py-2">
          <span className="text-sm text-cream/70">
            {selected.size} seleccionada{selected.size !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearSelection}
              className="px-3 py-1.5 text-xs border border-cream/20 hover:border-cream/40 transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 hover:border-red-500/50 transition-colors"
            >
              Eliminar seleccionadas
            </button>
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-cream/10">
          <p className="text-cream/30">
            No hay imágenes todavía — arrastra archivos aquí o usa “Subir
            imágenes”
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {images.map((image, index) => {
            const isSelected = selected.has(image.id);
            const isDragOver = dragOverId === image.id && draggingId !== image.id;
            return (
              <div
                key={image.id}
                data-image-row
                onDragOver={(e) => {
                  if (draggingId === null) return;
                  e.preventDefault();
                  if (dragOverId !== image.id) setDragOverId(image.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOn(image.id);
                }}
                className={`group flex items-center gap-3 border px-2 py-2 transition-colors ${
                  isDragOver
                    ? "border-cream/60"
                    : isSelected
                      ? "border-cream/40"
                      : "border-cream/10 hover:border-cream/20"
                }`}
              >
                {/* Burger — drag handle */}
                <span
                  draggable
                  role="button"
                  aria-label="Arrastrar para reordenar"
                  title="Arrastrar para reordenar"
                  onDragStart={(e) => {
                    setDraggingId(image.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(image.id));
                    const thumb = (e.currentTarget as HTMLElement)
                      .closest("[data-image-row]")
                      ?.querySelector("img");
                    if (thumb) {
                      e.dataTransfer.setDragImage(thumb, 16, 16);
                    }
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDragOverId(null);
                  }}
                  className="cursor-grab select-none px-2 text-xl leading-none text-cream/40 hover:text-cream active:cursor-grabbing"
                >
                  ☰
                </span>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(image.id)}
                    aria-label={`Seleccionar imagen ${index + 1}`}
                    className="w-3.5 h-3.5 accent-cream cursor-pointer"
                  />
                </label>

                <div className="w-28 shrink-0 aspect-video bg-cream/5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
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
                        className="flex-1 px-2 py-1 text-xs bg-cream/5 border border-cream/20 outline-none min-w-0"
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

                <div className="flex shrink-0 items-center gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index - 1)}
                      className="w-7 h-7 bg-cream/10 text-cream text-xs flex items-center justify-center hover:bg-cream/20"
                      aria-label="Mover antes"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index + 1)}
                      className="w-7 h-7 bg-cream/10 text-cream text-xs flex items-center justify-center hover:bg-cream/20"
                      aria-label="Mover después"
                    >
                      →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="w-7 h-7 bg-red-500/80 text-cream text-xs flex items-center justify-center hover:bg-red-500"
                    aria-label="Eliminar imagen"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
