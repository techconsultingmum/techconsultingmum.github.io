 import { useRef } from 'react';
 import { motion, useInView, Variants } from 'framer-motion';
 
 interface AnimatedSectionProps {
   children: React.ReactNode;
   className?: string;
   delay?: number;
   duration?: number;
   animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
   once?: boolean;
 }
 
 const animations: Record<string, Variants> = {
   fadeUp: {
     hidden: { opacity: 0, y: 40 },
     visible: { opacity: 1, y: 0 },
   },
   fadeIn: {
     hidden: { opacity: 0 },
     visible: { opacity: 1 },
   },
   slideLeft: {
     hidden: { opacity: 0, x: -60 },
     visible: { opacity: 1, x: 0 },
   },
   slideRight: {
     hidden: { opacity: 0, x: 60 },
     visible: { opacity: 1, x: 0 },
   },
   scale: {
     hidden: { opacity: 0, scale: 0.9 },
     visible: { opacity: 1, scale: 1 },
   },
 };
 
 const AnimatedSection = ({
   children,
   className = '',
   delay = 0,
   duration = 0.6,
   animation = 'fadeUp',
   once = true,
 }: AnimatedSectionProps) => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once, margin: '-100px' });
 
   return (
     <motion.div
       ref={ref}
       initial="hidden"
       animate={isInView ? 'visible' : 'hidden'}
       variants={animations[animation]}
       transition={{
         duration,
         delay,
         ease: [0.22, 1, 0.36, 1],
       }}
       className={className}
     >
       {children}
     </motion.div>
   );
 };
 
 export default AnimatedSection;