import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi, ChatSession } from "@/api";
import LoginStep from "@/components/session/LoginStep";
import PreparationStep from "@/components/session/PreparationStep";
import ChatStep from "@/components/session/ChatStep";
import FeedbackStep from "@/components/session/FeedbackStep";

type SessionStep = "login" | "preparation" | "chat" | "feedback";

const Session = () => {
  const { user, loading, error: authError } = useAuth();
  const [step, setStep] = useState<SessionStep>("login");
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync step with auth state
  useEffect(() => {
    if (!loading) {
      if (user && step === "login") {
        setStep("preparation");
      } else if (!user && step !== "login") {
        setStep("login");
        setChatSession(null);
      }
    }
  }, [user, loading, step]);

  // Show auth errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleCommit = async () => {
    try {
      setError(null);
      const { session } = await sessionsApi.create();
      setChatSession(session);
      setStep("chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session");
    }
  };

  const handleEndSession = async () => {
    if (chatSession) {
      try {
        await sessionsApi.update(chatSession.id, { status: "ended" });
      } catch (err) {
        console.error("Failed to end session:", err);
      }
    }
    setStep("feedback");
  };

  const handleFeedbackComplete = () => {
    window.location.href = "/";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg shadow-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-destructive-foreground/80 hover:text-destructive-foreground"
          >
            ✕
          </button>
        </div>
      )}
      {step === "login" && <LoginStep />}
      {step === "preparation" && <PreparationStep onCommit={handleCommit} />}
      {step === "chat" && chatSession && (
        <ChatStep sessionId={chatSession.id} onEndSession={handleEndSession} />
      )}
      {step === "feedback" && chatSession && (
        <FeedbackStep sessionId={chatSession.id} onComplete={handleFeedbackComplete} />
      )}
    </div>
  );
};

export default Session;
