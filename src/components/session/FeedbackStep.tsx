import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { sessionsApi } from "@/api";

interface FeedbackStepProps {
  sessionId: string;
  onComplete: () => void;
}

const FeedbackStep = ({ sessionId, onComplete }: FeedbackStepProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating > 0 && !submitting) {
      setSubmitting(true);
      try {
        await sessionsApi.update(sessionId, { rating });
        setSubmitted(true);
        setTimeout(onComplete, 2000);
      } catch (err) {
        console.error("Failed to submit rating:", err);
        // Still show success UI even if rating fails to save
        setSubmitted(true);
        setTimeout(onComplete, 2000);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8">
            <Star className="w-10 h-10 text-accent fill-accent" />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Thank you
          </h1>
          <p className="text-muted-foreground mb-8">
            Your feedback helps us improve. Wishing you clarity in your decision.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting you home...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <p className="text-accent uppercase tracking-[0.2em] text-sm mb-4">
          Session Complete
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          How was your session?
        </h1>
        <p className="text-muted-foreground mb-12">
          Your feedback helps us create better experiences
        </p>

        {/* Star rating */}
        <div className="flex justify-center gap-3 mb-12">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoveredRating || rating);
            return (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded-full"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    isFilled
                      ? "text-accent fill-accent"
                      : "text-border hover:text-accent/50"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Rating label */}
        {rating > 0 && (
          <p className="text-foreground mb-8 animate-fade-up">
            {rating === 1 && "We'll work to do better."}
            {rating === 2 && "Thank you for your honesty."}
            {rating === 3 && "We appreciate your feedback."}
            {rating === 4 && "We're glad it was helpful."}
            {rating === 5 && "Wonderful! We're so glad."}
          </p>
        )}

        {/* Submit button */}
        <Button
          variant="gold"
          size="xl"
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </div>
  );
};

export default FeedbackStep;
