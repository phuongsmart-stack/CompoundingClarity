import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { sessionsApi, ChatSession } from "@/api";

interface ActiveSessionsStepProps {
  onResume: (sessionId: string) => void;
  onStartNew: () => void;
}

const ActiveSessionsStep = ({ onResume, onStartNew }: ActiveSessionsStepProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { sessions: allSessions } = await sessionsApi.getAll();
        const active = allSessions.filter((s) => s.status === "active");
        if (active.length === 0) {
          onStartNew();
          return;
        }
        setSessions(active);
      } catch {
        // If fetching fails, just proceed to new session
        onStartNew();
        return;
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking for active sessions...</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-accent uppercase tracking-[0.2em] text-sm mb-4">
            Welcome back
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Your Sessions
          </h1>
          <p className="text-muted-foreground">
            Continue where you left off, or start a new session
          </p>
        </div>

        {/* Session list */}
        <div className="space-y-4 mb-8">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onResume(session.id)}
              className="w-full flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors text-left"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium">
                  Session from {formatDate(session.created_at)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Started {formatTimeAgo(session.created_at)}
                </p>
              </div>
              <span className="text-accent text-sm font-medium flex-shrink-0">
                Continue
              </span>
            </button>
          ))}
        </div>

        {/* Start new */}
        <div className="text-center">
          <Button variant="gold" size="xl" onClick={onStartNew} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionsStep;
