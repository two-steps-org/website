export function smoothScrollTo(element: HTMLElement | null, offset = 0) {
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

export function getScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementHeight = rect.height;

  // Calculate how much of the element is visible
  const visiblePx = Math.min(
    windowHeight,
    Math.max(0, windowHeight + rect.top),
    Math.max(0, windowHeight - (rect.bottom - elementHeight))
  );

  return visiblePx / elementHeight;
}

export function preventScroll(prevent: boolean) {
  if (prevent) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.touchAction = '';
  }
}