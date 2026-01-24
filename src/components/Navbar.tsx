import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="font-serif text-xl text-foreground">Clarity</span>
        </a>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            About
          </a>
        </div>

        {/* CTA */}
        <Button variant="default" size="sm">
          Try Free Session
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
