 import { motion, Variants } from 'framer-motion';
 
 interface StaggeredListProps {
   children: React.ReactNode[];
   className?: string;
   staggerDelay?: number;
   initialDelay?: number;
 }
 
 const containerVariants: Variants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.1,
       delayChildren: 0.1,
     },
   },
 };
 
 const itemVariants: Variants = {
   hidden: { opacity: 0, y: 20 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
       duration: 0.5,
       ease: [0.22, 1, 0.36, 1],
     },
   },
 };
 
 const StaggeredList = ({
   children,
   className = '',
   staggerDelay = 0.1,
   initialDelay = 0.1,
 }: StaggeredListProps) => {
   return (
     <motion.div
       initial="hidden"
       animate="visible"
       variants={{
         ...containerVariants,
         visible: {
           ...containerVariants.visible,
           transition: {
             staggerChildren: staggerDelay,
             delayChildren: initialDelay,
           },
         },
       }}
       className={className}
     >
       {children.map((child, index) => (
         <motion.div key={index} variants={itemVariants}>
           {child}
         </motion.div>
       ))}
     </motion.div>
   );
 };
 
 export default StaggeredList;