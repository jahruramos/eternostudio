import Link from "next/link";
import type { WorkItem } from "@/lib/work";

export default function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group relative block overflow-hidden"
          style={{ aspectRatio: "902.5 / 700" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </Link>
      ))}
    </div>
  );
}
