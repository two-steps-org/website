import React from 'react';
import { m } from 'framer-motion';
import SplitText from './common/SplitText';
import { draw, pop, reveal } from '../utils/motion';

/**
 * The operators we have shipped alongside, mirroring the `client` values in
 * `CaseStudies/data.ts`.
 *
 * Kept as a local list rather than derived from that module on purpose: Home is
 * under a gzip perf budget and importing the case-study records here would pull
 * every implementation step into the initial bundle for five short labels.
 * If you add a case study, add its client here too.
 *
 * The design fills this grid with twelve wordmarks; those are placeholder brand
 * names, so real client descriptors stand in until logo permissions land. The
 * grid is `auto-fit`, so swapping in real marks needs no structural change.
 */
const OPERATORS = [
  'Internal Team',
  'Independent Barber',
  'Leads Manager',
  'Logistics Company',
  'Accounting Firm',
] as const;

/**
 * Proof strip — "Home / Logos" in the design.
 *
 * This is the site's light band. `data-band="light"` is load-bearing: the
 * Navbar watches for it and flips to its light treatment while it is under the
 * nav, which is what keeps the nav readable over #fafafa.
 */
const ProofStrip: React.FC = () => (
  <div
    data-theme="light"
    data-band="light"
    className="relative z-[1] text-[#0a0a0a] bg-[#fafafa] border-t border-[#e6e6e6]"
  >
    <section className="bg-[#fafafa] py-[clamp(80px,8vw,112px)]">
      <div className="mx-auto w-full max-w-[1312px] px-[clamp(20px,3vw,32px)]">
        <div className="text-center">
          <m.p {...reveal()} className="text-[13px] text-[#6b6b6b] m-0">
            The operators we build alongside
          </m.p>
          <SplitText
            as="h2"
            delay={0.1}
            className="ts-h2 text-[#0a0a0a] max-w-[640px] mx-auto mt-4 mb-0"
            text="Trusted where the work cannot fail."
          />
        </div>

        {/* The grid draws open from the left edge, then each mark pops into its cell. */}
        <m.ul
          {...draw(0.35)}
          className="mt-12 mb-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] border-t border-l border-[#e6e6e6]"
        >
          {OPERATORS.map((name, i) => (
            <li
              key={name}
              className="flex h-[88px] items-center justify-center border-r border-b border-[#e6e6e6] px-4"
            >
              <m.span
                {...pop(i, 0.7)}
                className="font-tight text-[15px] font-medium uppercase tracking-[0.14em] text-[#8a8a8a] transition-colors duration-300 hover:text-[#0a0a0a] text-center"
              >
                {name}
              </m.span>
            </li>
          ))}
        </m.ul>
      </div>
    </section>
  </div>
);

export default React.memo(ProofStrip);
