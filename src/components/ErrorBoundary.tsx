 import { Component, ReactNode } from 'react';
 import { Button } from '@/components/ui/button';
 import { AlertTriangle, RefreshCw } from 'lucide-react';
 
 interface Props {
   children: ReactNode;
   fallback?: ReactNode;
 }
 
 interface State {
   hasError: boolean;
   error: Error | null;
 }
 
 class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
     super(props);
     this.state = { hasError: false, error: null };
   }
 
   static getDerivedStateFromError(error: Error): State {
     return { hasError: true, error };
   }
 
   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
     console.error('ErrorBoundary caught an error:', error, errorInfo);
   }
 
   handleRetry = () => {
     this.setState({ hasError: false, error: null });
   };
 
   render() {
     if (this.state.hasError) {
       if (this.props.fallback) {
         return this.props.fallback;
       }
 
       return (
         <div className="min-h-[400px] flex items-center justify-center p-8">
           <div className="text-center max-w-md">
             <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
               <AlertTriangle className="w-8 h-8 text-destructive" />
             </div>
             <h2 className="text-2xl font-display font-bold text-foreground mb-3">
               Something went wrong
             </h2>
             <p className="text-muted-foreground mb-6">
               We encountered an unexpected error. Please try refreshing the page.
             </p>
             <div className="flex gap-4 justify-center">
               <Button onClick={this.handleRetry} variant="default">
                 <RefreshCw className="w-4 h-4 mr-2" />
                 Try Again
               </Button>
               <Button
                 onClick={() => window.location.reload()}
                 variant="outline"
               >
                 Refresh Page
               </Button>
             </div>
           </div>
         </div>
       );
     }
 
     return this.props.children;
   }
 }
 
 export default ErrorBoundary;