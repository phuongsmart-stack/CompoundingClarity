import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi } from "@/api";
import Navbar from "@/components/Navbar";
import SessionList from "@/components/history/SessionList";
import { Button } from "@/components/ui/button";

const SessionHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Fetch sessions
  const { data: sessions, isLoading, error, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { sessions } = await sessionsApi.getAll();
      return sessions;
    },
    enabled: !!user, // Only run query if user is authenticated
  });

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading sessions...</p>
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
          <p className="text-destructive mb-4">Failed to load sessions</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Render sessions list
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Past Sessions</h1>
          <p className="text-muted-foreground">
            View and continue your coaching sessions
          </p>
        </div>
        <SessionList sessions={sessions || []} />
      </div>
    </div>
  );
};

export default SessionHistory;
