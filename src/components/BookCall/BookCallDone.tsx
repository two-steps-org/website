import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import { fade } from '../../utils/motion';
import { formatSlot } from './calendar';

export function BookCallDone({
  bookedStart,
  email,
  timezone,
  hour24,
  onClose,
}: {
  bookedStart: string;
  email: string;
  timezone: string;
  hour24: boolean;
  onClose: () => void;
}) {
  return (
    <m.div {...fade} className="flex h-full min-h-[280px] max-w-[360px] flex-col justify-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg">
        <Check className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <p className="ts-h3 mt-6 mb-0 text-ink">You're booked.</p>
      <p className="ts-body mt-3 mb-2">{formatSlot(bookedStart, timezone, hour24)}</p>
      <p className="mb-2 text-[13px] text-muted">Times shown in {timezone}</p>
      <p className="mb-8 max-w-[34ch] text-[14px] leading-[1.5] text-muted">
        It is on our calendar. We will email {email} to confirm. If nothing arrives within a day, write to{' '}
        <a className="underline underline-offset-4" href="mailto:yoni.insell@twosteps.ai">yoni.insell@twosteps.ai</a>.
      </p>
      <button type="button" onClick={onClose} className="ts-pill h-12 w-fit px-8 text-[15px]">
        Close
      </button>
    </m.div>
  );
}
