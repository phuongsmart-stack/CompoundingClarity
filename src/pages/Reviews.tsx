import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { reviewsApi, CoachReview } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ChevronDown, ChevronUp, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Reviews = () => {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<CoachReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verdictFilter, setVerdictFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: { verdict?: string; limit?: number } = { limit: 200 };
        if (verdictFilter !== "all") {
          filters.verdict = verdictFilter;
        }
        const { reviews: data } = await reviewsApi.getAll(filters);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, verdictFilter]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to view reviews.</p>
          <Link to="/session">
            <Button variant="gold">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const passCount = reviews.filter((r) => r.verdict === "PASS").length;
  const nudgeCount = reviews.filter((r) => r.verdict === "NUDGE").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-xl text-foreground">
                Senior Coach Reviews
              </h1>
              <p className="text-sm text-muted-foreground">
                ICF compliance review for every coaching response
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats + Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">
                {passCount} passed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">
                {nudgeCount} nudged
              </span>
            </div>
          </div>

          <Select value={verdictFilter} onValueChange={setVerdictFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All reviews</SelectItem>
              <SelectItem value="PASS">Passed only</SelectItem>
              <SelectItem value="NUDGE">Nudged only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No reviews found. Reviews are created during coaching sessions.
          </div>
        )}

        {/* Review list */}
        {!loading && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review) => {
              const isExpanded = expandedId === review.id;
              const isNudge = review.verdict === "NUDGE";

              return (
                <div
                  key={review.id}
                  className={`border rounded-lg overflow-hidden ${
                    isNudge ? "border-amber-300 bg-amber-50/50" : "border-border bg-card"
                  }`}
                >
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : review.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={isNudge ? "destructive" : "secondary"}
                        className={
                          isNudge
                            ? "bg-amber-500 hover:bg-amber-500"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {review.verdict}
                      </Badge>
                      {isNudge && review.violations.length > 0 && (
                        <span className="text-sm text-muted-foreground truncate max-w-md">
                          {review.violations[0]}
                          {review.violations.length > 1 &&
                            ` (+${review.violations.length - 1} more)`}
                        </span>
                      )}
                      {!isNudge && (
                        <span className="text-sm text-muted-foreground">
                          No violations
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {review.revised && (
                        <Badge variant="outline" className="text-xs">
                          Revised
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-border px-4 py-4 space-y-4">
                      {/* Violations */}
                      {isNudge && review.violations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Violations
                          </h4>
                          <ul className="space-y-1">
                            {review.violations.map((v, i) => (
                              <li
                                key={i}
                                className="text-sm text-muted-foreground flex items-start gap-2"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Feedback */}
                      {isNudge && review.feedback && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Supervisor Feedback
                          </h4>
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                            {review.feedback}
                          </p>
                        </div>
                      )}

                      {/* Original response (for nudged reviews) */}
                      {isNudge && review.revised && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Original Response (before revision)
                          </h4>
                          <div className="text-sm text-muted-foreground bg-red-50 border border-red-200 rounded-lg px-3 py-2 whitespace-pre-wrap">
                            {review.original_response}
                          </div>
                        </div>
                      )}

                      {/* Session / Message ID */}
                      <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                        <span>
                          Session:{" "}
                          <code className="bg-muted px-1 py-0.5 rounded">
                            {review.session_id.slice(0, 8)}...
                          </code>
                        </span>
                        <span>
                          Message:{" "}
                          <code className="bg-muted px-1 py-0.5 rounded">
                            {review.message_id.slice(0, 8)}...
                          </code>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
