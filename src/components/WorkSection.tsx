import Link from "next/link";

interface WorkItem {
  src: string;
  alt: string;
  href: string;
}

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
        <a
          href="#"
          className="font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
        >
          Show more
        </a>
      </div>

      {/* Grid — 2×2 on desktop, stacked on mobile */}
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
    </section>
  );
}
