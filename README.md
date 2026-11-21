# Task Manager

A task management web app with a board, calendar and analytics, built with React, TypeScript and Tailwind CSS.

**Live demo:** https://task-manager-bice-six-58.vercel.app

## Features

- **Task board** with backlog, active and done statuses, priorities and due dates.
- **Create, edit, move and delete** tasks, with optional notes and assignee.
- **Calendar view** of tasks by due date.
- **Analytics and statistics** pages with charts.
- **Dashboard** overview and a settings page.
- **Persistent**: tasks are saved in the browser's `localStorage`. There is no backend, so data stays on your device.

## Tech stack

| Area | Tools |
|---|---|
| UI | React 19, TypeScript, React Router |
| Styling | Tailwind CSS, Lucide icons |
| Charts | Recharts |
| Tooling | Create React App (`react-scripts`), Jest, Testing Library |

## Project structure

```
src/
  components/   layout, sidebar, top bar
  context/      TaskContext: task state and persistence
  pages/        Dashboard, Tasks, Calendar, Analytics, Statistics, Settings
  types.ts      shared types
```

## Getting started

Requires Node.js 18 or later.

```bash
npm install
npm start        # http://localhost:3000
```

Other scripts:

```bash
npm test         # run tests
npm run build    # production build in build/
```

## Limitations

- Data lives in one browser's `localStorage`: no accounts, sync or sharing.
- Clearing site data deletes your tasks.
