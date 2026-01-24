import { Brain, Compass, Shield } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Clarity, Not Confusion",
    description:
      "When your mind is racing with options, our AI coach helps you untangle the noise and find the signal that matters.",
  },
  {
    icon: Compass,
    title: "Your Values, Your Choice",
    description:
      "We don't impose frameworks. We surface what's already important to you—then help you act on it with conviction.",
  },
  {
    icon: Shield,
    title: "Confidential & Private",
    description:
      "Your deepest career dilemmas stay between you and the screen. No judgment, no record, no human ever sees your session.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm mb-4">
            Why Leaders Choose Us
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Decision-making, evolved.
          </h2>
        </div>

        {/* Value cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-accent/30 hover:shadow-elevated transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <value.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-4">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
