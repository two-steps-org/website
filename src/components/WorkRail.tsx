import React, { useRef } from 'react';
import { m } from 'framer-motion';
import { pop, slide, slideItem } from '../utils/motion';

interface CaseCard {
  readonly slug: string;
  readonly sector: string;
  readonly line1: string;
  readonly line2: string;
  readonly before: string;
  readonly after: string;
  readonly logo: string;
  readonly image: string;
}

const CASE_CARDS: readonly CaseCard[] = [
  {
    slug: 'telecom',
    sector: 'Telecommunications',
    line1: '41% shorter handle time',
    line2: 'across every channel',
    before: 'Voice, chat and email on three separate stacks',
    after: 'One operating layer, one conversation',
    logo: 'MERIDIAN',
    image: '/work/case-telecom.svg',
  },
  {
    slug: 'collections',
    sector: 'Banking',
    line1: '18% higher recovery',
    line2: 'with fewer contacts per account',
    before: 'Dialler lists ordered by balance',
    after: 'Outreach sequenced by readiness to resolve',
    logo: 'NORTHBANK',
    image: '/work/case-collections.svg',
  },
  {
    slug: 'it',
    sector: 'Enterprise IT',
    line1: 'Days to minutes',
    line2: 'for access and provisioning',
    before: 'Ticket queue, two-day median wait',
    after: 'Policy-checked access in nine minutes',
    logo: 'ATLAS ONE',
    image: '/work/case-it.svg',
  },
  {
    slug: 'containment',
    sector: 'Retail',
    line1: '3.4M contacts a quarter',
    line2: 'closed without handoff',
    before: 'Seasonal hiring every peak',
    after: 'Same team, volume absorbed',
    logo: 'KESTREL',
    image: '/work/case-containment.svg',
  },
  {
    slug: 'billing',
    sector: 'Utilities',
    line1: 'One conversation',
    line2: 'to close a billing dispute',
    before: 'Three contacts per dispute on average',
    after: 'Repeat contacts down by a third',
    logo: 'VOLTWAY',
    image: '/work/case-billing.svg',
  },
];

const ArrowRightIcon = ({ className, stroke }: { className?: string; stroke?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke ?? 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

/**
 * Selected work — "Home / Case rail" in the design.
 *
 * A horizontal snap rail of square cards on the light band. `data-band="light"`
 * is what tells the Navbar to flip to its light treatment over this section.
 */
const WorkRail: React.FC = () => {
  const railRef = useRef<HTMLUListElement>(null);

  // Scroll by exactly one card plus the 16px gap, matching scrollRail() in the
  // artboard, so the snap points stay aligned.
  const scrollRail = (direction: 1 | -1) => () => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 16 : 400;
    rail.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <div
      id="work"
      data-theme="light"
      data-band="light"
      className="relative z-[1] text-[#0a0a0a] bg-[#fafafa]"
    >
      <section className="bg-[#fafafa] pb-[clamp(96px,10vw,128px)]">
        <div className="mx-auto w-full max-w-[1312px] px-[clamp(20px,3vw,32px)]">
          <m.div
            {...slide('left')}
            className="flex items-end justify-between gap-8 flex-wrap"
          >
            <div>
              <p className="text-[13px] text-[#6b6b6b] m-0 mb-4">Selected work</p>
              <h2 className="ts-h2 text-[#0a0a0a] max-w-[768px] text-[clamp(30px,3.9vw,54px)] m-0">
                Work that used to queue, now closing itself.
              </h2>
            </div>

            <div className="flex shrink-0 gap-2">
              <m.button
                {...pop(0, 0.3)}
                type="button"
                onClick={scrollRail(-1)}
                aria-label="Previous"
                className="flex w-10 h-10 items-center justify-center rounded-full border border-[#e6e6e6] bg-transparent text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white"
              >
                <ArrowRightIcon className="rotate-180" />
              </m.button>
              <m.button
                {...pop(1, 0.3)}
                type="button"
                onClick={scrollRail(1)}
                aria-label="Next"
                className="flex w-10 h-10 items-center justify-center rounded-full border border-[#e6e6e6] bg-transparent text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white"
              >
                <ArrowRightIcon />
              </m.button>
            </div>
          </m.div>
        </div>

        {/* The rail bleeds to the right edge but its first card aligns with the
            container, so the row reads as continuing off-screen. */}
        <div className="mt-10 pl-[max(clamp(20px,3vw,32px),calc((100vw-1312px)/2+32px))]">
          <ul
            ref={railRef}
            className="flex gap-4 overflow-x-auto pr-5 pb-2 m-0 list-none snap-x snap-mandatory scrollbar-hide"
          >
            {CASE_CARDS.map((card, i) => (
              <m.li
                key={card.slug}
                {...slideItem('right', i, 0.15)}
                className="relative aspect-[3/4] md:aspect-square w-[min(86vw,560px)] md:w-[min(78vw,560px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#141414]"
              >
                <div
                  role="img"
                  aria-label={`${card.line1} ${card.line2}`}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.05)_45%,rgba(0,0,0,0.7))]" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-3">
                      <span className="self-start text-xs px-2.5 py-1 rounded-full border border-white/25 text-white bg-black/25">
                        {card.sector}
                      </span>
                      <h3 className="font-tight font-normal text-[clamp(22px,2vw,26px)] leading-[1.14] tracking-[-0.014em] text-white max-w-[90%] m-0">
                        <span className="block">{card.line1}</span>
                        <span className="block">{card.line2}</span>
                      </h3>
                    </div>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </div>

                  <div className="flex items-end justify-between gap-3 md:gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-3 items-start md:items-end max-w-full md:max-w-[78%]">
                      <div>
                        <p className="text-[11px] tracking-[0.08em] uppercase text-white/55 m-0 mb-1.5">
                          Before
                        </p>
                        <p className="text-sm leading-[1.45] text-white/75 m-0">{card.before}</p>
                      </div>
                      <ArrowRightIcon className="hidden md:block mb-1" stroke="rgba(255,255,255,0.6)" />
                      <div>
                        {/* The one colour accent in the design's card. */}
                        <p className="text-[11px] tracking-[0.08em] uppercase text-[#0099ff] m-0 mb-1.5">
                          After
                        </p>
                        <p className="text-sm leading-[1.45] text-white m-0">{card.after}</p>
                      </div>
                    </div>
                    <p className="font-tight text-[13px] font-medium tracking-[0.16em] text-white/85 m-0 whitespace-nowrap">
                      {card.logo}
                    </p>
                  </div>
                </div>
              </m.li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default React.memo(WorkRail);
