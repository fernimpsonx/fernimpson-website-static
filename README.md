# Fern Impson website

## Structure
- `site/`  – the website (Netlify publishes this folder)
  - `links.html` main links page · `quiz.html` 12-question quiz (scoring + gate form inside)
  - `results-mind.html`, `results-heart.html`, `results-body.html` – results pages
  - `next-step.html` – coaching/challenge choice shown after results
  - `challenge.html` – 7-Day Confidence Challenge page + waitlist form
  - `coaching.html` – 1:1 coaching page (should be live at /coaching) · `index.html` – older version of the same page using `assets/`
  - `privacy.html` – privacy policy (served at /privacy via `_redirects`)
  - `assets/` – images
- `netlify/functions/submission-created.js` – runs after every form submission and adds the person to MailerLite (needs env var `MAILERLITE_TOKEN`)
- `netlify.toml` – publish folder = `site`, functions = `netlify/functions`
- `not-for-deploy/` – unused pages (book.html, thanks.html); not published

## Forms (Netlify Forms, detected automatically on deploy)
1. `confidence-quiz` (in quiz.html): first-name, email, result (Mind/Heart/Body), submitted-at, marketing-consent, consent-wording, bot-field
2. `confidence-challenge-waitlist` (in challenge.html): first-name, email, submitted-at, consent-wording, bot-field

## MailerLite
Groups used: "Quiz – Mind", "Quiz – Heart", "Quiz – Body", "Challenge waitlist" (created automatically if missing).
Setup: Netlify > Site configuration > Environment variables > add `MAILERLITE_TOKEN` (MailerLite > Integrations > API). Never commit the token.
Not yet done: welcome emails/automations in MailerLite, and live testing after deploy.

## Notes
- Do not change approved copy, design, quiz questions or scoring.
- No email consent tick-box by design: a notice sits under each form button.
- Social email icon address is still empty (`window.FERN_SOCIAL.email`).
- Booking buttons link to https://calendar.app.google/CAFQKzYxdLgJ6Akx8
