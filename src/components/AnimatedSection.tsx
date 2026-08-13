import { useEffect, useRef, useState } from 'react';

type Animation = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  /** seconds */
  delay?: number;
  /** seconds */
  duration?: number;
  animation?: Animation;
  once?: boolean;
}

const hiddenTransform: Record<Animation, string> = {
  fadeUp: 'translate3d(0, 40px, 0)',
  fadeIn: 'none',
  slideLeft: 'translate3d(-60px, 0, 0)',
  slideRight: 'translate3d(60px, 0, 0)',
  scale: 'scale(0.9)',
};

/**
 * Zero-dependency scroll reveal. Uses IntersectionObserver + CSS transitions
 * instead of a full animation runtime, which keeps the main-thread cost near zero.
 */
const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  animation = 'fadeUp',
  once = true,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: '-100px 0px', threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform[animation],
        transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: visible ? undefined : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
