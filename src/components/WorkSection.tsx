import Link from "next/link";
import WorkGrid from "@/components/WorkGrid";
import type { WorkItem } from "@/lib/work";

export default function WorkSection({
  pad,
  items,
}: {
  pad: string;
  items: WorkItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section
      id="work"
      className="flex flex-col gap-[50px]"
      style={{ paddingInline: pad }}
    >
      {/* Header — title + show more */}
      <div className="flex items-center justify-between">
        <h2 className="font-helvetica text-[clamp(32px,3.6vw,48px)] font-medium uppercase leading-none tracking-[-0.02em]">
          Work
        </h2>
        <Link
          href="/work"
          className="font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
        >
          Show more
        </Link>
      </div>

      {/* Grid — 2×2 on desktop, stacked on mobile */}
      <WorkGrid items={items} />
    </section>
  );
}
