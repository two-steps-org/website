import type { ElementType } from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  icon: ElementType;
  onClose: () => void;
}

export default function ModalHeader({ title, icon: Icon, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 border-b border-line">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-nested border border-line-strong bg-surface-2 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-ink" />
        </div>
        <h3 className="ts-h3 text-ink truncate">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ts-icon-btn flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-ink/10"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
