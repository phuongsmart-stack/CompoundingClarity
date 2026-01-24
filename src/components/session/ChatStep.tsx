import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, LogOut } from "lucide-react";
import { chatApi, Message } from "@/api";

interface ChatStepProps {
  sessionId: string;
  onEndSession: () => void;
}

const ChatStep = ({ sessionId, onEndSession }: ChatStepProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageSent = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send initial greeting from AI when chat starts
  useEffect(() => {
    if (!initialMessageSent.current && sessionId) {
      initialMessageSent.current = true;
      // Add a greeting message
      setMessages([
        {
          id: "greeting",
          session_id: sessionId,
          role: "assistant",
          content: "Welcome. I'm here to help you examine your thoughts and find clarity. What's been on your mind lately? Is there a belief or situation you'd like to explore together?",
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userContent = input.trim();
    setInput("");
    setIsTyping(true);
    setError(null);

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      role: "user",
      content: userContent,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const { userMessage, assistantMessage } = await chatApi.sendMessage(
        sessionId,
        userContent
      );

      // Replace temp message with real ones
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMessage.id);
        return [...filtered, userMessage, assistantMessage];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove the temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get the latest exchange (current turn) to highlight
  const currentTurnStart = Math.max(0, messages.length - 2);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-foreground">
              Clarity<span className="text-accent">AI</span>
            </h1>
            <p className="text-sm text-muted-foreground">Your session is private</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onEndSession}>
            <LogOut className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-6 py-3 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => {
            const isCurrentTurn = index >= currentTurnStart;
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={message.id}
                className={`flex ${isAssistant ? "justify-start" : "justify-end"} ${
                  !isCurrentTurn ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`max-w-[80%] px-5 py-4 rounded-2xl ${
                    isAssistant
                      ? "bg-card border border-border"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isAssistant && (
                    <p className="text-xs text-accent font-medium mb-2 uppercase tracking-wider">
                      Clarity AI
                    </p>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-5 py-4 rounded-2xl bg-card border border-border">
                <p className="text-xs text-accent font-medium mb-2 uppercase tracking-wider">
                  Clarity AI
                </p>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts..."
              className="min-h-[52px] max-h-32 resize-none bg-card"
              rows={1}
            />
            <Button
              variant="gold"
              size="icon"
              className="h-[52px] w-[52px] flex-shrink-0"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatStep;
