import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock, ChevronRight, Star } from "lucide-react";
import { ChatSession } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SessionCardProps {
  session: ChatSession;
}

const SessionCard = ({ session }: SessionCardProps) => {
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

  const handleClick = () => {
    navigate(`/history/${session.id}`);
  };

  return (
    <Card
      className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(session.created_at), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{getDuration()}</span>
            </div>
          </div>
          <Badge variant={session.status === "active" ? "default" : "secondary"}>
            {session.status === "active" ? "Active" : "Ended"}
          </Badge>
        </div>

        {session.rating && (
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= session.rating!
                    ? "fill-accent text-accent"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
