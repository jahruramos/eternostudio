import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eterno Studio™ — Admin",
  description: "Panel de administración de Eterno Studio",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-panel">{children}</div>;
}
