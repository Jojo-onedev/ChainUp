---
name: gsap-master
description: 'Design and implement production-ready GSAP animations. Use for timeline architecture, scroll-driven motion, performant transitions, accessibility-safe animation, and final quality checks.'
argument-hint: 'Animation goal, framework/stack, trigger type (load/hover/scroll), target devices, performance and accessibility constraints'
user-invocable: true
disable-model-invocation: false
---

# GSAP Master

## Outcome
Deliver robust, intentional, and performant GSAP animations with clear structure, controllable timelines, and validated behavior across devices.

## When to Use
- Building complex UI motion beyond basic CSS transitions
- Creating orchestrated timelines for entrances, state changes, or storytelling sections
- Implementing scroll-based interactions with ScrollTrigger
- Refactoring inconsistent or janky motion systems into maintainable animation code

## Inputs
- Animation intent and UX purpose
- Stack context (React/Next.js, Vanilla JS, or other frontend framework)
- Trigger model (on load, on interaction, on scroll)
- Target browsers/devices and motion constraints
- Accessibility requirements (especially reduced motion)

## Workflow
1. Clarify animation intent
- Define what the animation should communicate (focus, hierarchy, feedback, continuity).
- Separate decorative effects from functional motion.
- Confirm acceptance criteria: smoothness, timing feel, interruptibility, and fallback behavior.

2. Choose motion architecture
- Select timeline strategy: single master timeline, per-component timelines, or hybrid.
- Define trigger model: immediate, event-driven, or scroll-driven.
- Decide where state ownership lives to avoid animation/UI state conflicts.

Decision points:
- If sequence has multiple dependent steps: use a GSAP timeline.
- If animation is reused in many places: wrap in reusable function/hook.
- If scroll controls progression: use ScrollTrigger with explicit start/end rules.
- If user may interrupt frequently: prefer reversible/killable timelines.

3. Build stable targets first
- Ensure DOM structure and selectors/refs are stable before animating.
- In React/Next.js, scope animations and cleanup properly on unmount.
- Avoid brittle selectors; prefer explicit refs and local scoping.

4. Implement base animation
- Start with minimal transforms and opacity to prove behavior.
- Establish timing tokens (duration, stagger, easing) and keep them consistent.
- Use timeline labels for readability and maintainability.

5. Add scroll and interaction logic
- For scroll animations, configure ScrollTrigger start/end/scrub/pin intentionally.
- For interaction-driven motion, ensure repeated enter/leave/click behavior is deterministic.
- Prevent animation stacking by managing play/restart/reverse/kill rules.

6. Accessibility and user preferences
- Respect prefers-reduced-motion with alternate behavior (reduced or no motion).
- Preserve focus visibility and keyboard flow during animated transitions.
- Avoid motion that causes disorientation (large unexpected shifts, excessive parallax).

7. Performance hardening
- Animate transform and opacity first; avoid layout-thrashing properties.
- Minimize heavy filters/shadows during motion.
- Batch DOM reads/writes and clean up unused triggers/timelines.

8. Validate and finalize
- Test on target breakpoints and lower-powered devices.
- Verify no memory leaks or orphaned ScrollTriggers after navigation.
- Run lint/type checks and document edge cases, limits, and follow-ups.

## Completion Checklist
- Animation purpose is clear and tied to UX intent
- Timelines/triggers are deterministic and maintainable
- Reduced-motion behavior is implemented and verified
- Performance is smooth on target devices (no obvious jank)
- Cleanup is correct (no leaked timelines/triggers)
- Validation steps completed and trade-offs documented

## Output Format
Provide:
- Summary of implemented animation behavior
- Timeline and trigger strategy used
- Accessibility and performance decisions
- Validation results and known limitations

## Example Prompts
- /gsap-master Build a hero entrance sequence with staggered text and image reveals in React, with reduced-motion fallback.
- /gsap-master Implement ScrollTrigger-driven section transitions for a storytelling landing page in Vanilla JS.
- /gsap-master Refactor existing GSAP animations to remove jank, improve cleanup, and unify easing/duration tokens.