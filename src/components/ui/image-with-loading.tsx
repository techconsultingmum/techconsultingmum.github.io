import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithLoadingProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const ImageWithLoading = ({ 
  className, 
  alt, 
  src, 
  fallback = '/placeholder.svg',
  ...props 
}: ImageWithLoadingProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={hasError ? fallback : src}
        alt={alt || ''}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoading;
