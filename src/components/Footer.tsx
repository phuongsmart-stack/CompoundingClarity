import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent" />
          </div>
          <span className="font-serif text-lg text-foreground">Clarity</span>
        </a>

        {/* Links */}
        <div className="flex items-center gap-8 text-sm">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground text-sm">
          © 2025 Clarity. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
