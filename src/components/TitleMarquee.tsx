// Repeats per half of the track — enough to overflow wide screens
const REPEATS = 4;

export default function TitleMarquee({
  text,
  count,
}: {
  text: string;
  count?: number;
}) {
  const label =
    count === undefined ? null : `(${String(count).padStart(2, "0")})`;

  const group = (key: string, hidden: boolean) => (
    <div
      key={key}
      className={`flex shrink-0 items-start ${label ? "pr-[0.075em]" : "pr-[0.06em]"}`}
      aria-hidden={hidden || undefined}
    >
      <span>{text}</span>
      {label && (
        <span className="ml-[0.01em] text-[0.1565em] leading-none tracking-[-0.02em]">
          {label}
        </span>
      )}
    </div>
  );

  return (
    // Vertical padding + matching negative margin: keeps the cap-height box for
    // layout while leaving room for round-letter overshoot (O) above the clip.
    <section
      className="-my-[0.06em] overflow-hidden py-[0.06em] font-helvetica text-[clamp(96px,13.31vw,256px)]"
      aria-label={label ? `${text} ${label}` : text}
    >
      <div className="animate-marquee flex w-max whitespace-nowrap font-medium leading-[0.71] tracking-[-0.02em]">
        {Array.from({ length: REPEATS * 2 }, (_, i) => group(`g${i}`, i > 0))}
      </div>
    </section>
  );
}
