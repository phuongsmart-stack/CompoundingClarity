import { Quote } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-24 px-6 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <Quote className="w-12 h-12 text-accent mx-auto mb-8 opacity-60" />
        
        <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary-foreground leading-relaxed mb-10">
          "I was stuck between two job offers for weeks. In one session, I understood what I really wanted—and why I'd been avoiding it."
        </blockquote>
        
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="font-serif text-accent text-lg">S</span>
          </div>
          <div className="text-left">
            <p className="text-primary-foreground font-medium">Sarah M.</p>
            <p className="text-primary-foreground/60 text-sm">VP of Product, Tech Company</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
