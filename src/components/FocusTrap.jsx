import { useEffect, useRef } from 'react';

/**
 * FocusTrap - Traps keyboard focus inside a modal/dialog.
 * Wraps children in a div that captures Tab key navigation.
 */
export default function FocusTrap({ children, active = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;
    const focusable = () => el.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    // Save previously focused element
    const previouslyFocused = document.activeElement;

    // Focus first focusable element
    const elements = focusable();
    if (elements.length > 0) elements[0].focus();

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const els = focusable();
      if (els.length === 0) return;

      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Escape key closes (handled by parent onClick usually)
    el.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [active]);

  return <div ref={ref}>{children}</div>;
}
