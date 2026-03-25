# Kanban Board Assessment

A simplified, functional Kanban-style task board built with React 18+, TypeScript, and Tailwind CSS.

## Features

- **Three Columns**: To Do, In Progress, Done
- **Task Management**: Create, delete, and move tasks between columns
- **Data Persistence**: Tasks are saved to localStorage
- **Empty States**: Placeholder messages when columns are empty
- **Responsive Design**: Clean UI with Tailwind CSS

## Tech Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- useReducer for state management
- localStorage for persistence

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5174](http://localhost:5173) in your browser.

## Building for Production

```bash
npm run build
```

## Usage

- Add a new task by filling in the title and description, then clicking "Add Task".
- Tasks start in the "To Do" column.
- Use the "Move to" buttons to move tasks between columns.
- Click "Delete" to remove a task.
- All changes are automatically saved to localStorage.

## Project Structure

- `src/App.tsx`: Main application component
- `src/types.ts`: TypeScript interfaces and constants
- `src/index.css`: Tailwind CSS imports
- `src/main.tsx`: Application entry point
