export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
}

export type ColumnStatus = 'todo' | 'inprogress' | 'done';

export const columns: { status: ColumnStatus; name: string }[] = [
  { status: 'todo', name: 'To Do' },
  { status: 'inprogress', name: 'In Progress' },
  { status: 'done', name: 'Done' },
];