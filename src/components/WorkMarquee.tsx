// Repeats per half of the track — enough to overflow wide screens
const REPEATS = 4;

export default function WorkMarquee({ count }: { count: number }) {
  const label = `(${String(count).padStart(2, "0")})`;

  const group = (key: string, hidden: boolean) => (
    <div
      key={key}
      className="flex shrink-0 items-start pr-[0.075em]"
      aria-hidden={hidden || undefined}
    >
      <span>WORK</span>
      <span className="ml-[0.01em] text-[0.1565em] leading-none tracking-[-0.02em]">
        {label}
      </span>
    </div>
  );

  return (
    // Vertical padding + matching negative margin: keeps the cap-height box for
    // layout while leaving room for round-letter overshoot (O) above the clip.
    <section
      className="-my-[0.06em] overflow-hidden py-[0.06em] font-helvetica text-[clamp(96px,13.31vw,256px)]"
      aria-label={`Work ${label}`}
    >
      <div className="animate-marquee flex w-max whitespace-nowrap font-medium leading-[0.71] tracking-[-0.02em]">
        {Array.from({ length: REPEATS * 2 }, (_, i) => group(`g${i}`, i > 0))}
      </div>
    </section>
  );
}
