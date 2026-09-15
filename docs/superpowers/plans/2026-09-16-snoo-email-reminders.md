# SNOO Email Reminder Implementation Plan

**Goal:** Add a secure, idempotent one-day-before event reminder system using Vercel Cron, Resend, Firestore status fields, and Admin test/status UI without changing the public registration flow.

**Architecture:** Centralize provisional event metadata and email rendering in server-only helpers. A daily Vercel Cron endpoint checks whether today in Europe/Bucharest is exactly one calendar day before the event, then sends only unsent registrations with valid email addresses. Each send uses a stable Resend idempotency key and persists success/error metadata. Admin data exposes reminder status and a session-protected test endpoint sends a preview to an arbitrary test address without changing participant reminder state.

**Tech Stack:** CommonJS Vercel Functions, firebase-admin, Resend Node SDK, static Admin HTML/JS, Firestore.

### Task 1: Reminder core and cron
- Create tests for event-day gating, email rendering, idempotency, sent/error persistence, and cron authorization.
- Add `api/_event.js`, `api/_reminder.js`, and `api/cron/reminders.js`.
- Add `resend` dependency and daily UTC cron in `vercel.json`.

### Task 2: Admin reminder status and test send
- Create tests for reminder fields in Admin data and protected test-send endpoint.
- Add `api/admin/reminder-test.js`.
- Extend `api/admin/data.js` with reminder state fields and stats.
- Extend `admin/index.html` with reminder summary, filter/status column, and test-send action.

### Task 3: Verification and packaging
- Run new tests, existing Admin/auth/form tests, JS syntax checks, and ZIP integrity check.
- Package the complete project without modifying public registration behavior.
