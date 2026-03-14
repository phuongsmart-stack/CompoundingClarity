import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi, ChatSession, Message } from "@/api";
import LoginStep from "@/components/session/LoginStep";
import PreparationStep from "@/components/session/PreparationStep";
import ChatStep from "@/components/session/ChatStep";
import FeedbackStep from "@/components/session/FeedbackStep";

type SessionStep = "login" | "preparation" | "chat" | "feedback";

const Session = () => {
  const { user, loading, error: authError } = useAuth();
  const [searchParams] = useSearchParams();
  const continueId = searchParams.get("continueId");
  const [step, setStep] = useState<SessionStep>("login");
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingContinue, setLoadingContinue] = useState(false);

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

  // Handle continue session
  useEffect(() => {
    const loadContinueSession = async () => {
      if (user && continueId && !chatSession) {
        setLoadingContinue(true);
        try {
          const { session, messages } = await sessionsApi.get(continueId);

          // Reactivate session if it was ended
          if (session.status === "ended") {
            await sessionsApi.update(continueId, { status: "active" });
            session.status = "active";
          }

          setChatSession(session);
          setInitialMessages(messages);
          setStep("chat");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load session");
        } finally {
          setLoadingContinue(false);
        }
      }
    };

    loadContinueSession();
  }, [user, continueId, chatSession]);

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
  if (loading || loadingContinue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {loadingContinue ? "Loading session..." : "Loading..."}
          </p>
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
        <ChatStep
          sessionId={chatSession.id}
          onEndSession={handleEndSession}
          initialMessages={initialMessages.length > 0 ? initialMessages : undefined}
        />
      )}
      {step === "feedback" && chatSession && (
        <FeedbackStep sessionId={chatSession.id} onComplete={handleFeedbackComplete} />
      )}
    </div>
  );
};

export default Session;
