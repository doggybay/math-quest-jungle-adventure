# P1 progression implementation plan

Goal: turn the current cosmetic level flow into a coherent progression loop without overbuilding.

Scope for this wave:
1. Define five real levels with per-level topic mix, question count targets, and unlock requirements.
2. Persist adventure progress locally so refresh/revisit retains unlocked levels, stars, bananas, and best results.
3. Route level selection through real game state instead of cosmetic buttons.
4. End each level with a result screen that shows level outcome, stars earned, bananas earned, and next action.
5. Keep implementation data-driven enough to expand later, but small enough to ship on the current CRA stack.

Acceptance criteria:
- Level buttons display locked/unlocked/completed state.
- Selecting different unlocked levels changes the question pool/objective.
- Completing a level unlocks the next level and records stars/bananas.
- Reloading the app restores progress from localStorage.
- Tests cover progression persistence and a completed-level reward flow.
- Browser validation confirms level selection, gameplay, and result flow.

Non-goals for this wave:
- Practice/adventure mode split
- New encounter map layer
- Full question-content overhaul
- Vite migration

Key design decisions:
- Use a centralized level config object in the game context.
- Store one versioned progress blob in localStorage for future migration.
- Keep reward math legible: stars from accuracy/attempt pressure, bananas from completion + performance bonus.
- Treat practice mode as future work rather than pretending it exists in this slice.
