# Specification

## Summary
**Goal:** Make the Admin Dashboard access flow clear and explicit: admin access requires Internet Identity login only, and the UI must not suggest or collect username/email/phone + password credentials.

**Planned changes:**
- Replace the unauthenticated/indefinite “Loading...” gate on `/admin` with a clear login-required screen/state when the user is not authenticated.
- Add English user-facing copy on `/admin` instructing users to log in using Internet Identity (via the existing site Login button) to access the admin dashboard.
- Add English guidance clarifying the admin access model: admin access is granted only to the configured Internet Identity Principal, and the app does not support username/email/phone + password admin login.
- Ensure no UI displays, collects, stores, or persists any credential-like strings (e.g., username/email/phone/password) for admin access.

**User-visible outcome:** Visiting `/admin` while logged out shows a clear “login required” message with instructions to use Internet Identity and a clear next step to log in; the admin page explicitly clarifies that only Internet Identity Principal-based authorization is used (no password login).
