export function BookCallIntro({ durationMin }: { durationMin?: number }) {
  const points = [`${durationMin ?? 30} minutes`, 'No pitch deck', 'One clear next step'];
  return (
    <div className="flex shrink-0 flex-col justify-between gap-6 border-b border-line p-6 pr-14 sm:p-8 lg:w-[min(42%,420px)] lg:border-b-0 lg:border-r lg:p-10">
      <div>
        <p className="ts-eyebrow mb-4">Start a conversation</p>
        <h2 id="book-call-title" className="ts-display m-0 max-w-[10ch] text-[clamp(32px,4vw,52px)] text-ink">
          Tell us the <em className="sig">vision</em>.
        </h2>
        <p className="ts-body mt-5 mb-0 max-w-[34ch]">
          We look at the work together and whether we can help. No pitch. No deck.
        </p>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[13px] font-medium text-muted">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-3">
            <span className="h-1 w-1 shrink-0 rounded-full bg-ink" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
