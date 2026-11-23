import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * AnimateOnScroll
 * A thin wrapper that applies scroll-reveal animation to its single child.
 *
 * Props:
 *  - animation: 'reveal' | 'reveal-left' | 'reveal-right' | 'reveal-scale' | 'reveal-fade' | 'reveal-flip'
 *  - delay: number (ms), e.g. 0, 75, 100, 150, 200, 300, 400, 500
 *  - threshold: fraction of element visible before triggering (0–1)
 *  - className: extra classes forwarded to the wrapper div
 *  - tag: HTML tag to render (default 'div')
 */
export const AnimateOnScroll = ({
  children,
  animation = 'reveal',
  delay = 0,
  threshold = 0.1,
  className = '',
  tag: Tag = 'div',
  style = {},
  ...rest
}) => {
  const ref = useScrollReveal({ threshold });

  const delayClass = delay > 0 ? `delay-${delay}` : 'delay-0';

  return (
    <Tag
      ref={ref}
      className={`${animation} ${delayClass} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

