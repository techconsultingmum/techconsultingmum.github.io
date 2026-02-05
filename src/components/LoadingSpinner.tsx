 import { cn } from '@/lib/utils';
 
 interface LoadingSpinnerProps {
   size?: 'sm' | 'md' | 'lg';
   className?: string;
   label?: string;
 }
 
 const sizeClasses = {
   sm: 'w-4 h-4 border-2',
   md: 'w-8 h-8 border-3',
   lg: 'w-12 h-12 border-4',
 };
 
 const LoadingSpinner = ({
   size = 'md',
   className,
   label = 'Loading...',
 }: LoadingSpinnerProps) => {
   return (
     <div className={cn('flex items-center justify-center', className)} role="status" aria-label={label}>
       <div
         className={cn(
           'animate-spin rounded-full border-primary/20 border-t-primary',
           sizeClasses[size]
         )}
       />
       <span className="sr-only">{label}</span>
     </div>
   );
 };
 
 export default LoadingSpinner;