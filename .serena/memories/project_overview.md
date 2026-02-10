# Project Overview

- Name: `tts-learning` (package name: `base-project`)
- Purpose: React-based internship recruitment/training management app with role-based workflows (HR, Mentor, Director, Intern) and public job board.
- Domain notes: Includes recruitment planning, job posting, CV screening, interview scheduling, onboarding, internship learning path, task tracking, and evaluation flows.

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- UI: Ant Design (`antd`, `@ant-design/icons`, `@ant-design/pro-components`)
- Data/API: Axios, TanStack Query
- Routing: React Router DOM v7
- Validation/forms: React Hook Form + Zod
- i18n: i18next + react-i18next
- Styling: CSS + Tailwind packages present
- Mock/backend for local dev: `json-server` with `db.json` (base URL in `src/utils/http.ts` is `http://localhost:3000/`)

## High-Level Structure

- `src/App.tsx`: main route tree and layout composition
- `src/layouts/*`: Root/Auth/Dashboard layouts
- `src/pages/*`: feature pages split by authentication/public roles
- `src/services/*`: API service calls per domain
- `src/hooks/*`: react-query hooks per feature
- `src/constants/*`: route config and mock data
- `src/contexts/*`: auth and app contexts
- `src/utils/*`: HTTP client and shared utility types
- `public/locales/{en,vi}`: i18n translations
- Workflow docs: `WORKFLOW_SUMMARY.md`, `RECRUITMENT_WORKFLOW_GUIDE.md`, `COMPLETE_WORKFLOW.md`
