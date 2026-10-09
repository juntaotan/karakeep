# Authentication and Session Compatibility

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

## Authentication, Authorization, and Session Compatibility

Authentication, authorization, and session management must be migrated to Python while preserving existing security and compatibility requirements.

- Python must become the authoritative backend for authentication, authorization, and session management.
- Preserve existing authentication methods, authorization rules, permission scopes, and user access behaviour.
- Maintain compatibility with existing valid sessions so that users are not required to log in again solely because of the migration.
- Preserve existing cookie contracts, token validation behaviour, session expiration rules, and authentication configuration.
- Maintain compatibility with existing API keys, permission scopes, and external authentication integrations.
- Next.js may forward authentication credentials when required for server-side rendering, but authentication and authorization decisions must be performed by Python.

Existing session data and authentication credentials must remain valid according to their original lifecycle and security rules.

## Approved Existing-Behaviour Compatibility

The user approved F03 and explicitly requires unchanged business logic, with only the backend rewritten in Python. Use the current implementation as the authentication reference; preserve password-plus-salt verification, custom OAuth PKCE/state, email verification/reset, scoped API keys and existing authorization behaviour.

- Implement and verify NextAuth v4-compatible encrypted JWE sessions, including key derivation, secure/non-secure cookie names, chunking, expiry/renewal and credential-selection behaviour. Do not assume these sessions are conventional signed JWTs.
- Verify legacy-generated controlled fixtures for sessions, passwords, ak1/ak2 API keys, missing-scope defaults, session-only procedures and admin/scope restrictions before claiming compatibility.
- Implement authentication/session primitives in the isolated backend stage. Implement authentication HTTP endpoints and candidate Web/SSR integration during the later API stage, as required by [the approved sequence](core-migration.md).
- Preserve the original authentication service and live cookies during preparation. Transfer authority only through the reviewed module integration/cutover; design approval is not evidence of implementation or a live switch.
