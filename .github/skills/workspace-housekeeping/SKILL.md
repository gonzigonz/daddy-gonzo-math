---
name: workspace-housekeeping
description: "Run recurring workspace housekeeping for Node.js projects: check Node and npm versions, inspect dependency vulnerabilities, run lint/typecheck/build checks, make minimal evidence-based maintenance updates, and submit all changes through a pull request. Use for housekeeping, dependency health, security audit, Node version, npm audit, or project baseline requests."
argument-hint: "Optionally describe a specific maintenance concern or package"
user-invocable: true
disable-model-invocation: false
---

# Workspace Housekeeping

Use this skill for small, repeatable maintenance passes. Keep each pass focused and leave broader upgrades for a separate request.

## Procedure

1. Inspect the repository before editing:
   - Check the current branch, default branch, remote, and worktree status.
   - Read the package manifest, lockfile, version declarations, scripts, CI workflows, and relevant documentation.
   - Identify the package manager from the committed lockfile. For this project, use npm and `package-lock.json`.
   - Record the current Node.js and npm versions and compare them with the repository baseline.
2. Protect unrelated work:
   - Do not modify or commit unrelated uncommitted changes.
   - If the worktree contains changes that could be mixed into housekeeping, stop and ask for a clean branch or explicit guidance.
   - Never work directly on the default branch and never push housekeeping changes directly to it.
3. Make only narrowly justified changes:
   - Prefer updating version declarations, scripts, documentation, CI checks, or lockfile entries directly related to the finding.
   - Do not perform broad dependency upgrades, refactors, formatting sweeps, or automatic fixes without evidence that they are needed.
   - Treat the lockfile as authoritative and update it with the repository package manager when package metadata changes.
4. Run the project checks:
   - Install reproducibly with `npm ci`.
   - Check high and critical dependency findings with `npm audit --audit-level=high`.
   - Run the available lint, typecheck, test, and production build commands.
   - Report lower-severity or unresolved transitive advisories when they do not justify a change in the current pass.
5. Review the result:
   - Inspect the final diff and verify that only the requested housekeeping files changed.
   - Re-run focused checks after each substantive repair.
   - Do not claim the work is complete when a required check fails.
6. Always deliver through a pull request:
   - Create or use a dedicated non-default branch.
   - Commit only the housekeeping changes with a focused message.
   - Push the branch and open a normal, non-draft pull request targeting the repository default branch.
   - Include the checks run, audit results, remaining risks, and any deferred maintenance in the pull request body.
   - Use the GitHub pull request creation capability when available.
   - If authentication, push access, branch state, or pull request creation is unavailable, stop and report the blocker. Do not merge, force-push, or bypass the pull request.

## Completion Criteria

A housekeeping pass is complete only when the requested checks have been run, the diff is focused, and a pull request has been opened or a concrete external blocker has been reported. Never merge the pull request as part of this skill.
