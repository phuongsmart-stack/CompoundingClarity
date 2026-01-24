import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 text-balance">
          The decision you've been avoiding?
          <br />
          <span className="text-accent">Let's face it together.</span>
        </h2>
        
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Your first session is free. No credit card required. Just you, your thoughts, and the clarity you've been looking for.
        </p>
        
        <Button variant="gold" size="xl" className="mb-8">
          Begin Your Session Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" />
          <span>Takes about 15 minutes</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
