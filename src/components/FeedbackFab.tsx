import { MessageSquarePlus } from 'lucide-react';
import FeedbackDialog from '@/components/FeedbackDialog';

/** Fixed, floating feedback launcher pinned to the bottom-left of the viewport. */
const FeedbackFab = () => (
  <FeedbackDialog>
    <button
      type="button"
      aria-label="Send feedback"
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-all hover:bg-card hover:border-primary/50 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:left-6 sm:px-4"
    >
      <MessageSquarePlus className="h-4 w-4 text-primary" aria-hidden="true" />
      <span className="hidden sm:inline">Feedback</span>
    </button>
  </FeedbackDialog>
);

export default FeedbackFab;
