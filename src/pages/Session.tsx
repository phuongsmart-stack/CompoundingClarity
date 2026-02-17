import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi, ChatSession, Message } from "@/api";
import LoginStep from "@/components/session/LoginStep";
import ActiveSessionsStep from "@/components/session/ActiveSessionsStep";
import PreparationStep from "@/components/session/PreparationStep";
import ChatStep from "@/components/session/ChatStep";
import FeedbackStep from "@/components/session/FeedbackStep";

type SessionStep = "login" | "active-sessions" | "preparation" | "chat" | "feedback";

const Session = () => {
  const { sessionId: urlSessionId } = useParams<{ sessionId?: string }>();
  const { user, loading, error: authError } = useAuth();
  const [step, setStep] = useState<SessionStep>("login");
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resumeAttempted = useRef(false);

  // Sync step with auth state
  useEffect(() => {
    if (!loading) {
      if (user && step === "login") {
        // If URL has a sessionId, try to resume it directly
        if (urlSessionId && !resumeAttempted.current) {
          resumeAttempted.current = true;
          handleResumeSession(urlSessionId);
        } else {
          setStep("active-sessions");
        }
      } else if (!user && step !== "login") {
        setStep("login");
        setChatSession(null);
        setInitialMessages(null);
      }
    }
  }, [user, loading, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show auth errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleResumeSession = async (sessionId: string) => {
    try {
      setError(null);
      const { session, messages } = await sessionsApi.get(sessionId);
      if (session.status !== "active") {
        setError("That session has already ended.");
        setStep("active-sessions");
        return;
      }
      setChatSession(session);
      setInitialMessages(messages);
      setStep("chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resume session");
      setStep("active-sessions");
    }
  };

  const handleCommit = async () => {
    try {
      setError(null);
      const { session } = await sessionsApi.create();
      setChatSession(session);
      setInitialMessages(null);
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
      {step === "active-sessions" && (
        <ActiveSessionsStep
          onResume={handleResumeSession}
          onStartNew={() => setStep("preparation")}
        />
      )}
      {step === "preparation" && <PreparationStep onCommit={handleCommit} />}
      {step === "chat" && chatSession && (
        <ChatStep
          sessionId={chatSession.id}
          onEndSession={handleEndSession}
          initialMessages={initialMessages}
        />
      )}
      {step === "feedback" && chatSession && (
        <FeedbackStep sessionId={chatSession.id} onComplete={handleFeedbackComplete} />
      )}
    </div>
  );
};

export default Session;
