## Python Backend Migration Workflow

For an authorised Python backend migration task in this candidate checkout, read `refactor_docs/README.md` before implementation or mutable verification. Follow its mandatory reading order and task-specific rule triggers; the file paths are relative to the repository root after this section is merged into the root `AGENTS.md`.

Use one agent and a separate candidate checkout. Confirm the protected source, writable candidate and isolated runtime/data locations according to `refactor_docs/agent-rules/isolated-development.md`. Keep migration context and real session records under the candidate's `refactor_docs/agent-context/`; preserve the original source and intervening work.

Write all project-authored prompts and agent instruction/context files in English, including future session records and handovers. Translate recorded non-English user instructions faithfully and label them as translations; preserve their authority and approval scope.

Read `refactor_docs/design-confirmations.md` and relevant candidate context before relying on prior choices. Proposed or pending solutions are not approved decisions. Do not infer implementation or verification success from a template or a design approval.

Read `refactor_docs/agent-rules/human-intervention.md` when assessing a dependency on a human decision, resource or approval. Prepare the concrete authorised result before requesting a necessary approval, and reuse applicable existing authorisation. Candidate test success alone does not authorise integration or production cutover.

An explicitly authorised documentation review or design-document correction follows the scope described in the migration README and does not initialise a migration implementation session. Preserve the existing project instructions when installing this additive section.
