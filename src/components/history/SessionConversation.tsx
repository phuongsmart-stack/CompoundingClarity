import { Message } from "@/api";

interface SessionConversationProps {
  messages: Message[];
}

const SessionConversation = ({ messages }: SessionConversationProps) => {
  return (
    <div className="px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";

          return (
            <div
              key={message.id}
              className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
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

        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No messages in this session
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionConversation;
