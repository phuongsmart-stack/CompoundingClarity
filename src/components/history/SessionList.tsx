import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { ChatSession } from "@/api";
import SessionCard from "./SessionCard";
import { Button } from "@/components/ui/button";

interface SessionListProps {
  sessions: ChatSession[];
}

const SessionList = ({ sessions }: SessionListProps) => {
  const navigate = useNavigate();

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">No sessions yet</h2>
        <p className="text-muted-foreground mb-6">
          Start your first coaching session to begin your journey
        </p>
        <Button onClick={() => navigate("/session")}>Start Session</Button>
      </div>
    );
  }

  // Session cards grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 pb-12">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

export default SessionList;
