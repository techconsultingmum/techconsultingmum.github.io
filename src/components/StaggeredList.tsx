import AnimatedSection from './AnimatedSection';

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

const StaggeredList = ({
  children,
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0.1,
}: StaggeredListProps) => (
  <div className={className}>
    {children.map((child, index) => (
      <AnimatedSection key={index} delay={initialDelay + index * staggerDelay} duration={0.5}>
        {child}
      </AnimatedSection>
    ))}
  </div>
);

export default StaggeredList;
