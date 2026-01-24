import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate("/session");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-cream-dark opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/3 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="animate-fade-up text-muted-foreground uppercase tracking-[0.2em] text-sm mb-8">
          Executive Decision Coaching
        </p>
        
        {/* Main headline */}
        <h1 className="animate-fade-up font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-[1.1] mb-8 text-balance">
          Make the hard call with{" "}
          <span className="text-accent">confidence</span>,
          <br className="hidden md:block" />
          not regret.
        </h1>
        
        {/* Subheadline */}
        <p className="animate-fade-up-delay text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          We won't tell you what to do. We'll help you see what you already know.
        </p>
        
        {/* CTA Buttons */}
        <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="xl" onClick={handleStartSession}>
            Start Your Free Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="heroOutline" size="xl">
            See How It Works
          </Button>
        </div>
        
        {/* Social proof hint */}
        <p className="animate-fade-up-delay-2 text-muted-foreground text-sm mt-12">
          Trusted by executives at Fortune 500 companies
        </p>
      </div>
    </section>
  );
};

export default Hero;
