import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to the returned `ref`.
 * When the element enters the viewport it gets the class `is-visible`,
 * which triggers whichever reveal-* CSS transition is applied.
 *
 * @param {object} options
 * @param {number} options.threshold  – 0–1, fraction of element visible (default 0.12)
 * @param {string} options.rootMargin – IntersectionObserver rootMargin (default '0px')
 * @param {boolean} options.once     – if true, stop observing after first reveal (default true)
 */
export function useScrollReveal({ threshold = 0.12, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('is-visible');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * useScrollRevealGroup
 * Observes a *container* ref and stagger-reveals all children
 * that have a `data-reveal` attribute.
 *
 * @param {object} options
 * @param {number} options.stagger   – ms delay between each child (default 80)
 * @param {number} options.threshold – same as above (default 0.08)
 */
export function useScrollRevealGroup({ stagger = 80, threshold = 0.08, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = Array.from(container.querySelectorAll('[data-reveal]'));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('is-visible');
            }, i * stagger);
          });
          observer.unobserve(container);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [stagger, threshold, rootMargin]);

  return ref;
}

