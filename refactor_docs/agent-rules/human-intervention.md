# Human Intervention and Blocker Handling

Read when assessing a blocker, considering a clarification/approval request, or resuming work with a pending human dependency. These procedures were approved by the user after the original document was split. They supplement W3 without changing the migration target or choosing a technical stack.

## Decide by dependency, not difficulty

| Situation | Required action |
| --- | --- |
| Ordinary implementation problem, compilation/test failure, or unfamiliar library behaviour within the authorised scope | Investigate, implement and verify autonomously; record actual results |
| Missing information discoverable from source, configuration, history, documentation or appropriate checks | Gather evidence; distinguish assumptions from facts; do not immediately ask the human |
| An unresolved technical dependency does not require human input | Investigate autonomously or preserve an early handover; do not label it a human dependency solely because it is difficult |
| Progress requires changing a binding requirement, or material user intent cannot be resolved from available evidence | Stop session development, persist the paused step/report, and request the human's decision |
| Progress requires access, credentials or external information only the human can provide | Stop session development, persist the paused step/report, and request the necessary resource through an appropriate secure channel |
| An irreversible action is outside existing authorisation, such as deleting real data or production cutover | Present the authorised preparation as a concrete reviewable action; stop session development, persist the paused step/report, and request approval before execution |

For example, inability to preserve valid sessions, a proposal to change the existing database schema, or a proposal to replace queue infrastructure requires a human decision about the existing migration constraint. Do not silently weaken compatibility or replace infrastructure to make implementation easier.

The original checkout is protected during isolated development. If the candidate passed applicable checks but no explicit instruction authorises integration, stop and request that instruction using the same report/progress/handover procedure. Follow [isolated-development.md](isolated-development.md); a successful candidate test is not permission to change the original checkout.

Routine implementation choices consistent with the requirements do not automatically require approval. A framework or library choice is not by itself a reason to escalate when it falls within authorised discretion. Reuse existing explicit authorisation and accepted decisions; ask again only when the relevant scope or assumptions materially change. Respect tool-enforced approval boundaries and never bypass them.

## Investigation and stopping conditions

Use relevant evidence to identify the cause, evaluate plausible remedies, and perform appropriate checks. There is no fixed retry count or time threshold: an unsuccessful attempt, a difficult task, or a failing test alone is insufficient grounds to shift the problem to the human. Avoid repeating the same failed approach without new evidence.

When the next meaningful step needs a human choice, resource or authorisation, stop development for the entire current session, including otherwise independent implementation tasks. Preserve current work and prepare the report/request promptly rather than switching to another task or carrying the dependency through further development sessions. Do not assume away a material uncertainty. If no human input is needed but the session cannot reasonably continue, preserve an early handover for further investigation.

Context exhaustion triggers handover, not a request for a technical decision. Distinguish unresolved technical investigation from Waiting for Human; a new session does not remove a human dependency.

## Make a concrete intervention request

Before escalating, carry out the authorised investigation/preparation needed to make the choice reviewable. Once human intervention is determined to be necessary, only preserve state and assemble existing evidence, options and the concrete request/report; do not continue feature development or unrelated investigation. Ask only for the decision, resource or action actually needed.

The request must contain:

1. Issue ID, affected component/task, problem and impact.
2. Supporting evidence and what remains uncertain.
3. Relevant attempts and actual results.
4. Viable options and their compatibility/data/operational consequences, when applicable.
5. Recommended option with its rationale, when applicable.
6. The precise decision, resource or approval needed, and what can resume after it arrives.

State which requirement or authorisation boundary makes the request necessary. A resource request need not invent several alternatives. Do not ask for secrets in a committed document or include them in the evidence.

## Persist, wait and resume

- In known-issues.md record Intervention State: Waiting for Human, the Step ID, required input, request/evidence references, stopped work and resumption condition.
- In migration-status.md mark the current step Paused — Awaiting Human, with Stopped at UTC/time source, a brief reason, required input, issue/request references and a link to the actual session report. Keep component migration status unchanged unless implementation evidence supports a separate update.
- In the session report record Task Status: Blocked, Stop Reason: Human Intervention Required, Step ID, stopped time/time source, evidence, attempts, options/recommendation, exact required input and resumption condition. Leave unfinished commands' completion time unset. Then update the handover with the same Step ID, brief reason and report/request references. A Complete handover means the report was saved, not that the task succeeded or waiting ended.
- While waiting, do not start another migration implementation task or continue independent development in the current session. Only saving/reporting the state and preparing the request are allowed. Do not substitute an assumption for the required input; silence, elapsed time and an unsubmitted default option are not approval.
- At the next session, check whether the required answer/resource/approval arrived and remains applicable. If it is absent or insufficient, keep the step paused, report the pending condition and stop development. Preserve the request without duplicating an unchanged question by default; revise it only when material new information or changed scope warrants this.
- After an applicable answer/resource/approval, record the actual wording or faithful summary, provenance, time when known, approved scope and consequences in decisions.md. Update issues/handover and the step to In Progress with resumption time/evidence before development; recheck the actual checkout. Receiving an answer does not itself resolve the technical issue: implement within the decision and resolve the issue only with appropriate evidence.
- A newly authorised exception to a binding requirement must be explicit and reflected in the affected current rules/decisions before dependent implementation. Do not treat an unrelated answer or a proposed option as approval of the exception.

The rule requires making and preserving the request; it does not itself schedule future sessions or send messages through an external service.
