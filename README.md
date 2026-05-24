# THE IRON GARAGE

THE IRON GARAGE is a premium, local-first fitness web app built by **Rishi Bhardwaj**. It helps users generate workout plans, browse exercises, track progress, run workout sessions, and calculate BMI and calorie targets without login, payment, or a backend database.

## Features

- AI-style weekly workout generator with mock logic
- Workout session mode with set checkoffs, rest timer, and completed sessions
- Exercise library with search, filters, detail modal, and favorites
- Progress dashboard for weight, workouts, PRs, and measurements
- Live homepage dashboard snapshot
- BMI calculator with category and health suggestions
- Calorie calculator for maintenance, fat loss, and muscle gain targets
- Saved plan duplicate/copy/start actions
- Dark/light theme toggle with saved preference
- Responsive mobile-first UI
- Mobile bottom navigation
- PWA manifest and app icon
- LocalStorage persistence
- Loading skeletons, empty states, and SEO metadata

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion
- Recharts
- next-themes
- localStorage

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```bash
http://localhost:3000
```

If port `3000` is already in use, Next.js will start on another port such as `3001`.

## Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Structure

```text
app/
  about/
  bmi/
  calories/
  exercises/
  generator/
  progress/
  session/
  layout.tsx
  page.tsx
  globals.css

components/
  layout/
  sections/
  ui/

data/
  exercises.ts

lib/
  storage.ts
  session.ts
  utils.ts
  workout.ts
```

## Local Data

THE IRON GARAGE does not use authentication or a backend database. User data is saved in the browser with `localStorage`, including:

- saved workout plans
- favorite exercises
- active workout session
- completed workout sessions
- progress tracker data
- theme preference

Clearing browser storage will remove saved app data.

## Pages

- `/` - Landing page
- `/generator` - AI workout generator
- `/session` - Workout session mode
- `/exercises` - Exercise library
- `/progress` - Progress tracker
- `/bmi` - BMI calculator
- `/calories` - Calorie calculator
- `/about` - About page

## Deployment

The easiest deployment path is Vercel:

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Keep the default Next.js settings.
4. Deploy.

Recommended build command:

```bash
npm run build
```

Recommended install command:

```bash
npm install
```

## Author

Built by **Rishi Bhardwaj**.
