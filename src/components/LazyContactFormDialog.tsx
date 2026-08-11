import { Suspense, lazy, useState } from 'react';

const ContactFormDialog = lazy(() => import('./ContactFormDialog'));

/**
 * Renders the consultation form trigger without pulling the form (and its
 * validation + backend client dependencies) into the initial bundle.
 */
const LazyContactFormDialog = ({ children }: { children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <span
        className="contents"
        onClick={() => setLoaded(true)}
        onMouseEnter={() => setLoaded(true)}
        onFocus={() => setLoaded(true)}
      >
        {children}
      </span>
    );
  }

  return (
    <Suspense fallback={<span className="contents">{children}</span>}>
      <ContactFormDialog defaultOpen>{children}</ContactFormDialog>
    </Suspense>
  );
};

export default LazyContactFormDialog;