---
name: frontend-master
description: 'Plan, design, build, and polish production-ready frontend features. Use for UI implementation, responsive layouts, accessibility, performance tuning, and final quality checks in React/Next.js or Vanilla HTML/CSS/JS.'
argument-hint: 'Goal, stack (React/Next.js or Vanilla), target devices, design constraints, accessibility/performance requirements'
user-invocable: true
disable-model-invocation: false
---

# Frontend Master

## Outcome
Deliver a complete frontend feature from brief to validated result, with clear decisions on UX, implementation approach, quality, and release readiness.

## When to Use
- Building a new UI feature from scratch
- Refactoring an existing screen without regressions
- Turning design requirements into responsive production code
- Running a final quality pass before merge/release

## Inputs
- Feature goal and user value
- Tech stack and framework constraints (React/Next.js or Vanilla HTML/CSS/JS)
- Design references (if any)
- Browser/device targets
- Accessibility and performance expectations

## Workflow
1. Clarify the brief
- Restate scope, user journey, constraints, and acceptance criteria.
- Identify unknowns before coding.
- Produce a compact implementation plan.

2. Choose implementation strategy
- Decide whether this is a new component, composition of existing components, or a refactor.
- Reuse existing design system patterns when available.
- Pick the simplest architecture that satisfies requirements.
- For React/Next.js: prefer composable components, clear props contracts, and minimal client-side state.
- For Vanilla HTML/CSS/JS: prefer progressive enhancement, semantic HTML, and modular CSS/JS organization.

Decision points:
- If design system coverage is sufficient: compose existing primitives.
- If missing primitives are required: introduce a new reusable component with clear API.
- If deadline is tight: prioritize robust baseline UX first, then enhancements.

3. Build structure first
- Implement semantic markup and component boundaries.
- Ensure content and interaction flows work before styling details.
- Keep props/state model minimal and explicit.

4. Apply visual design intentionally
- Define or reuse design tokens (spacing, color, typography, radius, shadows).
- Avoid generic boilerplate look; establish a deliberate visual direction.
- Implement responsive behavior for small, medium, and large breakpoints.

5. Add interaction and motion
- Implement meaningful transitions only where they improve comprehension.
- Respect reduced-motion preferences.
- Keep animations performant (transform/opacity first).

6. Enforce accessibility
- Validate keyboard navigation, focus visibility, and logical tab order.
- Ensure semantic labels/roles and proper heading hierarchy.
- Check contrast and non-text cues for state.

7. Optimize performance
- Remove unnecessary re-renders and oversized bundles.
- Lazy-load heavy sections/assets when appropriate.
- Optimize image and font loading strategy.

8. Validate and harden
- Run lint/type checks/tests.
- Test key flows on target viewports and browsers.
- Verify empty/loading/error states.
- Capture what changed and known trade-offs.

## Completion Checklist
- Requirements mapped to delivered behavior
- Responsive layouts verified on target breakpoints
- Accessibility checks passed for keyboard/focus/labels/contrast
- No major layout shift or interaction jank
- Code is readable, component API is clear, and dead code removed
- Tests/checks pass (or deviations are explicitly documented)

## Output Format
Provide:
- Summary of implemented UI behavior
- Key decisions and why they were chosen
- Risks, limitations, and follow-up tasks
- Validation results (lint/tests/manual checks)

## Example Prompts
- /frontend-master Build a pricing page hero and feature grid in React with mobile-first layout, WCAG AA contrast, and subtle motion.
- /frontend-master Create a landing page section in Vanilla HTML/CSS/JS with responsive cards, accessible keyboard interactions, and optimized images.
- /frontend-master Refactor the checkout summary card for better readability and accessibility without changing backend contracts.
- /frontend-master Implement a dashboard empty/loading/error state system consistent with our existing design tokens.