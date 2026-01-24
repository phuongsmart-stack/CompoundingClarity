const steps = [
  {
    number: "01",
    title: "Share your dilemma",
    description:
      "In your own words, describe the decision weighing on you. No forms, no structure—just speak freely.",
  },
  {
    number: "02",
    title: "Explore with precision",
    description:
      "Our AI asks the questions a great coach would—uncovering blind spots, fears, and hidden priorities you hadn't considered.",
  },
  {
    number: "03",
    title: "Arrive at clarity",
    description:
      "Walk away knowing not just what to do, but why it's right for you. The confidence stays long after the session ends.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm mb-4">
            The Process
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Three steps to your answer.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A 15-minute session that could change everything.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start gap-8 group"
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <span className="font-serif text-6xl md:text-7xl text-accent/20 group-hover:text-accent/40 transition-colors duration-500">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="pt-4">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
