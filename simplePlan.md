# Simple Plan

## Done So Far

- [x] Scaffolded the Next.js app with App Router, Tailwind, linting, and build validation.
- [x] Added shared utilities and types in `lib/types.ts`, `lib/openai.ts`, `lib/stripe.ts`, and `lib/supabase/*`.
- [x] Built a demo-mode shell with persona switching in `app/layout.tsx`, `app/onboarding/page.tsx`, and `components/demo-user-picker.tsx`.
- [x] Implemented the question feed, question submission, question detail page, AI answer card, and complexity banner.
- [x] Added demo-first question APIs in `app/api/questions/*`, `app/api/ai/*`, `app/api/payments/checkout/route.ts`, and `app/api/webhooks/stripe/route.ts`.
- [x] Added community and expert answers, upvotes, consultant browsing, profile pages, private sessions, chat, and ratings.
- [x] Created an in-memory demo store and seeded data in `lib/mock-data.ts`, `lib/demo-store.ts`, and `lib/demo-user.ts`.
- [x] Polished the app into a light demo UI and verified the app with `npm run lint` and `npm run build`.

## Immigration Applier AI

- [x] Add the current completed app state to this file and keep it updated during implementation.
- [x] Add an `Immigration Applier AI` entry to the nav and create the new `/applier` page.
- [x] Add a demo-first intake wizard that matches a user goal to a supported IRCC application package.
- [x] Redesign the Applier into a chat-first assistant with a live structured side panel.
- [x] Add a Gemini-ready chat layer for application matching and conversational guidance, with local fallback when no key is set.
- [x] Support real file uploads while keeping extracted personal details mocked/local for the hackathon build.
- [x] Show a curated IRCC document checklist, submitted files, extracted details, and next steps in the structured panel.
- [x] Generate demo output documents for the user and show the payload that would be sent to the PDF/XFA worker.
- [x] Add a same-repo Python worker scaffold for the future PDFium/XFA path.
- [x] Re-run lint/build and validate the end-to-end applier demo flow.

## Notes

- The current app is intentionally hackathon-first and works without external API keys.
- The applier feature now uses a chat-plus-panel flow in Next.js, with optional Gemini chat via `GEMINI_API_KEY` and a same-repo worker seam for later real PDFium/XFA support.
- Supported demo-first application types are currently:
  - Work permit application (`IMM 1295`)
  - Study permit application (`IMM 1294`)
  - Spousal sponsorship application (`IMM 1344 / IMM 5532`)
- Real uploaded files are accepted in the browser, but extracted personal details are still mocked from file metadata and naming patterns.
- The worker scaffold now lives in `services/pdf-worker/` and exposes a placeholder `fill-xfa` contract for future PDFium/XFA work.
- Validation completed:
  - `npm run lint`
  - `npm run build`
  - Local `GET /applier`
  - Local `POST /api/applier/chat`
  - Local `POST /api/applier/upload`
  - Local `POST /api/applier/fill`
