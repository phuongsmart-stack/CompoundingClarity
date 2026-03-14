# Feature: Landing Page & Marketing Website

**Last updated:** February 2026

---

## Purpose

The landing page is the first thing a visitor sees. Its job is to:

1. Clearly communicate what ClarityAI does
2. Build trust and credibility
3. Motivate the visitor to start their first coaching session

---

## Page Structure

The landing page is composed of the following sections, displayed in this order from top to bottom:

### 1. Navigation Bar

- **Position:** Fixed at the top of the screen (always visible as the user scrolls)
- **Left side:** ClarityAI logo (sparkle icon + "Clarity" text) — clicking it returns to the home page
- **Center (desktop only):** Navigation links
  - "How It Works" — scrolls to the How It Works section
  - "About" — scrolls to the About section
- **Right side:** "Try Free Session" button
- **Mobile behavior:** The center navigation links are hidden on smaller screens. The logo and button remain visible.

### 2. Hero Section

The hero is the large, visually prominent area at the top of the page.

- **Eyebrow text:** "Executive Decision Coaching" (small uppercase text above the headline)
- **Headline:** "Make the hard call with **confidence**, not regret."
- **Subheadline:** "We won't tell you what to do. We'll help you see what you already know."
- **Primary button:** "Start Your Free Session" — navigates to the session page
- **Secondary button:** "See How It Works" — scrolls down the page
- **Social proof line:** "Trusted by executives at Fortune 500 companies"
- **Visual effects:** Subtle background gradient and floating decorative circles with a warm gold accent

### 3. Value Propositions

Three cards displayed side by side (stacked on mobile), each highlighting a core benefit:

| Card | Title | Description |
|---|---|---|
| 1 | Clarity, Not Confusion | "When your mind is racing with options, our AI coach helps you untangle the noise and find the signal that matters." |
| 2 | Your Values, Your Choice | "We don't impose frameworks. We surface what's already important to you — then help you act on it with conviction." |
| 3 | Confidential & Private | "Your deepest career dilemmas stay between you and the screen. No judgment, no record, no human ever sees your session." |

- **Section header:** "Why Leaders Choose Us"
- **Section tagline:** "Decision-making, evolved."

### 4. How It Works

A three-step walkthrough of the coaching process:

| Step | Title | Description |
|---|---|---|
| 01 | Share your dilemma | "In your own words, describe the decision weighing on you. No forms, no structure — just speak freely." |
| 02 | Explore with precision | "Our AI asks the questions a great coach would — uncovering blind spots, fears, and hidden priorities you hadn't considered." |
| 03 | Arrive at clarity | "Walk away knowing not just what to do, but why it's right for you. The confidence stays long after the session ends." |

- **Section header:** "The Process"
- **Section tagline:** "Three steps to your answer."
- **Supporting line:** "A 15-minute session that could change everything."

### 5. Testimonial

A single featured testimonial to build trust:

- **Quote:** "I was stuck between two job offers for weeks. In one session, I understood what I really wanted — and why I'd been avoiding it."
- **Attribution:** Sarah M., VP of Product, Tech Company
- **Visual:** Quote icon, avatar initial, and a dark background for contrast

### 6. Final Call to Action

A closing section designed to convert visitors who have scrolled through the entire page:

- **Headline:** "The decision you've been avoiding? **Let's face it together.**"
- **Supporting text:** "Your first session is free. No credit card required. Just you, your thoughts, and the clarity you've been looking for."
- **Button:** "Begin Your Session Now"
- **Time estimate:** "Takes about 15 minutes"

### 7. Footer

- **Left:** ClarityAI logo
- **Center:** Links to Privacy, Terms, and Contact pages (currently placeholder links)
- **Right:** "© 2025 Clarity. All rights reserved."

---

## Key Behaviors

| Behavior | Details |
|---|---|
| Navigation bar stays fixed | The top bar remains visible as the user scrolls down the page |
| "Start Your Free Session" navigates to `/session` | Clicking the primary hero button takes the user to the coaching session page |
| Hover effects on cards | Value proposition cards have a subtle border glow and shadow when hovered |
| Animations on scroll | Headline and buttons fade up into view with staggered timing |
| Responsive design | All sections adjust gracefully between desktop, tablet, and mobile screen sizes |

---

## Current Limitations

- The "See How It Works" button in the hero does not currently scroll to the How It Works section (no scroll behavior linked)
- Footer links (Privacy, Terms, Contact) are placeholders and do not navigate to real pages
- Only one testimonial is displayed (no carousel or rotation)
- The "Try Free Session" button in the navbar does not navigate to the session page
