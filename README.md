# THE IRON GARAGE

THE IRON GARAGE is a premium, local-first fitness web app built by **Rishi Bhardwaj**. It helps users generate workout plans, browse exercises, track progress, and calculate BMI and calorie targets without login, payment, or a backend database.

## Features

- AI-style weekly workout generator with mock logic
- Exercise library with search, filters, detail modal, and favorites
- Progress dashboard for weight, workouts, PRs, and measurements
- BMI calculator with category and health suggestions
- Calorie calculator for maintenance, fat loss, and muscle gain targets
- Dark/light theme toggle with saved preference
- Responsive mobile-first UI
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
  utils.ts
  workout.ts
```

## Local Data

THE IRON GARAGE does not use authentication or a backend database. User data is saved in the browser with `localStorage`, including:

- saved workout plans
- favorite exercises
- progress tracker data
- theme preference

Clearing browser storage will remove saved app data.

## Pages

- `/` - Landing page
- `/generator` - AI workout generator
- `/exercises` - Exercise library
- `/progress` - Progress tracker
- `/bmi` - BMI calculator
- `/calories` - Calorie calculator
- `/about` - About page

## Author

Built by **Rishi Bhardwaj**.
