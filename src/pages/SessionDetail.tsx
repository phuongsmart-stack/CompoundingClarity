import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi } from "@/api";
import Navbar from "@/components/Navbar";
import SessionHeader from "@/components/history/SessionHeader";
import SessionConversation from "@/components/history/SessionConversation";
import { Button } from "@/components/ui/button";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Redirect if no ID
  useEffect(() => {
    if (!id) {
      navigate("/history");
    }
  }, [id, navigate]);

  // Fetch session with messages
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      if (!id) throw new Error("No session ID");
      const { session, messages } = await sessionsApi.get(id);
      return { session, messages };
    },
    enabled: !!user && !!id,
  });

  const handleContinue = () => {
    navigate(`/session?continueId=${id}`);
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-destructive mb-4">Failed to load session</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Render session detail
  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SessionHeader session={data.session} onContinue={handleContinue} />
      <SessionConversation messages={data.messages} />
    </div>
  );
};

export default SessionDetail;
