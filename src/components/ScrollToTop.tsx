 import { useState, useEffect } from 'react';
 import { ArrowUp } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 const ScrollToTop = () => {
   const [isVisible, setIsVisible] = useState(false);
 
   useEffect(() => {
     const toggleVisibility = () => {
       // Show button when page is scrolled more than 400px
       setIsVisible(window.scrollY > 400);
     };
 
     window.addEventListener('scroll', toggleVisibility, { passive: true });
     return () => window.removeEventListener('scroll', toggleVisibility);
   }, []);
 
   const scrollToTop = () => {
     window.scrollTo({
       top: 0,
       behavior: 'smooth',
     });
   };
 
   if (!isVisible) return null;
 
   return (
     <Button
       onClick={scrollToTop}
       size="icon"
       className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300"
       aria-label="Scroll to top"
     >
       <ArrowUp className="w-5 h-5" />
     </Button>
   );
 };
 
 export default ScrollToTop;