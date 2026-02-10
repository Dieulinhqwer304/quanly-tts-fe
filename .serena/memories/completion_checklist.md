# Task Completion Checklist

When finishing a coding task in this project:

1. Run lint: `yarn lint` (script applies fixes)
2. Run formatter or format check as needed: `yarn format` or `yarn format:check`
3. Build for regression check: `yarn build`
4. If change touches API/data flows, ensure local mock API is available: `npx json-server --watch db.json --port 3000`
5. Manually verify affected routes/pages in dev server (`yarn dev`)

Notes:
- No dedicated `test` script is currently defined in `package.json`.
- If tests are introduced later, add them to this checklist.
