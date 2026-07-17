import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Nuevo proyecto</h1>
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
