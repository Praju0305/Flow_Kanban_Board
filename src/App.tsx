import { useReducer, useEffect, useState } from 'react';
import type { Task, ColumnStatus } from './types';
import { columns } from './types';

type State = {
  columns: Record<ColumnStatus, Task[]>;
};

type Action =
  | { type: 'add'; task: Task }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; status: ColumnStatus }
  | { type: 'load'; state: State };

const initialState: State = {
  columns: {
    todo: [],
    inprogress: [],
    done: [],
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        columns: {
          ...state.columns,
          [action.task.status]: [
            ...state.columns[action.task.status],
            action.task,
          ],
        },
      };

    case 'delete': {
      const newColumns = { ...state.columns };
      for (const col in newColumns) {
        newColumns[col as ColumnStatus] =
          newColumns[col as ColumnStatus].filter(t => t.id !== action.id);
      }
      return { columns: newColumns };
    }

    case 'move': {
      let taskToMove: Task | null = null;
      const newColumns = { ...state.columns };

      for (const col in newColumns) {
        const found = newColumns[col as ColumnStatus].find(t => t.id === action.id);
        if (found) {
          taskToMove = found;
          newColumns[col as ColumnStatus] =
            newColumns[col as ColumnStatus].filter(t => t.id !== action.id);
        }
      }

      if (!taskToMove) return state;

      taskToMove.status = action.status;
      newColumns[action.status] = [...newColumns[action.status], taskToMove];

      return { columns: newColumns };
    }

    case 'load':
      return action.state;

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('kanban-state');
    if (saved) {
      dispatch({ type: 'load', state: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban-state', JSON.stringify(state));
  }, [state]);

  const handleAdd = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
    };

    dispatch({ type: 'add', task: newTask });
    setTitle('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'delete', id });
  };

  const handleMove = (id: string, status: ColumnStatus) => {
    dispatch({ type: 'move', id, status });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-slate-900">
        Flow Kanban Board
      </h1>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 p-6 md:p-8 rounded-xl bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">
            Add New Task
          </h2>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input flex-1"
            />

            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input flex-1"
              rows={3}
            />

            <button onClick={handleAdd} className="button-primary">
              Add Task
            </button>
          </div>
        </div>

        <div className="bg-white/40 p-4 rounded-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {columns.map(col => (
              <Column
                key={col.status}
                name={col.name}
                tasks={state.columns[col.status]}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ColumnProps {
  name: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onMove: (id: string, status: ColumnStatus) => void;
}

function Column({ name, tasks, onDelete, onMove }: ColumnProps) {
  const bg =
    name === "To Do"
      ? "bg-blue-50 border-blue-100"
      : name === "In Progress"
      ? "bg-yellow-50 border-yellow-100"
      : "bg-green-50 border-green-100";

  return (
    <div className={`p-5 min-h-[350px] flex flex-col rounded-xl border shadow-sm ${bg}`}>
      <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
        {name}
        <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm border">
          {tasks.length}
        </span>
      </h3>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks in this column</p>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} onMove={onMove} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onMove: (id: string, status: ColumnStatus) => void;
}

function TaskCard({ task, onDelete, onMove }: TaskCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
      <h4 className="font-semibold text-slate-900 text-sm">{task.title}</h4>

      <p className="text-sm text-gray-600 mt-2 min-h-[40px] leading-relaxed">
        {task.description || <span className="text-gray-400">No description</span>}
      </p>

      <div className="mt-4 flex gap-2 flex-wrap">
        {columns.map(col => (
          col.status !== task.status && (
            <button
              key={col.status}
              onClick={() => onMove(task.id, col.status)}
              className="button-move"
            >
              Move to {col.name}
            </button>
          )
        ))}

        <button
          onClick={() => onDelete(task.id)}
          className="button-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default App;