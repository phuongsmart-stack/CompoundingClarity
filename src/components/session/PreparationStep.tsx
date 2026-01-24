import { Button } from "@/components/ui/button";
import { Shield, Brain, RefreshCw } from "lucide-react";

interface PreparationStepProps {
  onCommit: () => void;
}

const PreparationStep = ({ onCommit }: PreparationStepProps) => {
  const guidelines = [
    {
      icon: Shield,
      text: "Be honest with yourself throughout the session. There is no judgement, nor can any human read your session.",
    },
    {
      icon: Brain,
      text: "You can think while talking. Take your time to process your thoughts.",
    },
    {
      icon: RefreshCw,
      text: "You can change what you say. It's okay to revise and refine your thoughts.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-accent uppercase tracking-[0.2em] text-sm mb-4">
            Before we begin
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Mental Preparation
          </h1>
          <p className="text-muted-foreground">
            A few things to keep in mind for your session
          </p>
        </div>

        {/* Guidelines */}
        <div className="space-y-6 mb-12">
          {guidelines.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-foreground leading-relaxed pt-2">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Commit CTA */}
        <div className="text-center">
          <Button variant="gold" size="xl" onClick={onCommit} className="w-full sm:w-auto">
            I commit to being honest with myself
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreparationStep;
