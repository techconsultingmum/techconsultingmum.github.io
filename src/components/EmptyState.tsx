 import { LucideIcon } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { cn } from '@/lib/utils';
 
 interface EmptyStateProps {
   icon: LucideIcon;
   title: string;
   description?: string;
   action?: {
     label: string;
     onClick: () => void;
   };
   className?: string;
 }
 
 const EmptyState = ({
   icon: Icon,
   title,
   description,
   action,
   className,
 }: EmptyStateProps) => {
   return (
     <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
       <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
         <Icon className="w-8 h-8 text-muted-foreground" />
       </div>
       <h3 className="text-xl font-display font-semibold text-foreground mb-2">
         {title}
       </h3>
       {description && (
         <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
       )}
       {action && (
         <Button onClick={action.onClick} variant="default">
           {action.label}
         </Button>
       )}
     </div>
   );
 };
 
 export default EmptyState;