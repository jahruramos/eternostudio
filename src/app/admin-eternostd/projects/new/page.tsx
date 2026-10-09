import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin-eternostd"
            className="text-sm text-cream/50 hover:text-cream transition-colors"
          >
            ← Volver
          </Link>
          <h1 className="text-2xl font-bold">Nuevo proyecto</h1>
        </div>
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
