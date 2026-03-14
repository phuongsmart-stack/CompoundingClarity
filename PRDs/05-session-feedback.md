# Feature: Session Feedback & Rating

**Last updated:** February 2026

---

## Purpose

After every coaching session, the user is asked to rate their experience. This feedback helps measure the quality of the AI coaching and identify areas for improvement.

---

## What the User Sees

### Feedback Screen

After the user clicks "End Session" in the chat, they are taken to the feedback screen:

- **Eyebrow text:** "Session Complete"
- **Headline:** "How was your session?"
- **Supporting text:** "Your feedback helps us create better experiences"
- **Star rating:** Five stars displayed in a row
- **Submit button:** "Submit Feedback" (gold-colored)

### Star Rating Interaction

| Action | What Happens |
|---|---|
| Hover over a star | That star and all stars to its left light up in gold (preview) |
| Move mouse away | Stars return to their previous state (the selected rating, or empty if none selected) |
| Click a star | That star and all stars to its left become permanently gold (rating is set) |
| Click a different star | The rating updates to the newly clicked star |

### Dynamic Feedback Messages

Once the user selects a rating, a contextual message appears below the stars:

| Rating | Message |
|---|---|
| 1 star | "We'll work to do better." |
| 2 stars | "Thank you for your honesty." |
| 3 stars | "We appreciate your feedback." |
| 4 stars | "We're glad it was helpful." |
| 5 stars | "Wonderful! We're so glad." |

### Submit Button Behavior

| State | Button Text | Enabled? |
|---|---|---|
| No rating selected | "Submit Feedback" | Disabled (cannot click) |
| Rating selected | "Submit Feedback" | Enabled |
| Submitting | "Submitting..." | Disabled (processing) |

---

## After Submission

### Thank You Screen

Once the user submits their rating, the screen transitions to a confirmation view:

- **Icon:** A filled gold star
- **Headline:** "Thank you"
- **Message:** "Your feedback helps us improve. Wishing you clarity in your decision."
- **Redirect notice:** "Redirecting you home..."
- **Automatic redirect:** After **2 seconds**, the user is sent back to the landing page (home)

### What Gets Saved

The rating (1 through 5) is saved against the coaching session. This allows the team to track:
- Average session ratings over time
- Whether specific types of conversations correlate with higher or lower ratings

---

## Error Handling

| Scenario | What Happens |
|---|---|
| Rating saves successfully | Thank you screen is shown, user is redirected home |
| Rating fails to save (network error, server error) | The thank you screen is **still shown** and the user is **still redirected home**. The rating is lost but the user is not impacted. |

This "graceful failure" approach ensures the user always has a smooth exit from their session, even if the rating cannot be saved.

---

## Current Limitations

- **No text feedback** — the user can only rate with stars; there is no option to leave written comments
- **No skip option** — the user must submit a rating to proceed (there is no "Skip" or "No thanks" button)
- **Rating cannot be changed after submission** — once submitted, the rating is final
- **No feedback summary** — the user cannot see their past ratings or feedback history
- **Automatic redirect is not cancelable** — the 2-second redirect happens automatically; the user cannot stay on the thank you screen
