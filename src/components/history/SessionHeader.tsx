import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { ChatSession } from "@/api";
import { Button } from "@/components/ui/button";

interface SessionHeaderProps {
  session: ChatSession;
  onContinue?: () => void;
}

const SessionHeader = ({ session, onContinue }: SessionHeaderProps) => {
  const navigate = useNavigate();

  const getDuration = () => {
    if (session.ended_at) {
      const start = new Date(session.created_at);
      const end = new Date(session.ended_at);
      const minutes = Math.floor((end.getTime() - start.getTime()) / 60000);
      return `${minutes} min`;
    }
    return "In progress";
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/history")}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Session info */}
          <div className="text-center flex-1">
            <p className="text-sm font-medium">
              {format(new Date(session.created_at), "MMMM dd, yyyy - h:mm a")}
            </p>
            <p className="text-xs text-muted-foreground">{getDuration()}</p>
          </div>

          {/* Continue button */}
          <div className="w-[100px]">
            {onContinue && (
              <Button size="sm" onClick={onContinue}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;
