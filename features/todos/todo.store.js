import { create } from "zustand";

function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getSectionKey(todoDate) {
  return todoDate ?? "__undated__";
}

function normalizeTodosWithOrder(todos) {
  const grouped = new Map();

  for (const todo of todos) {
    const todoDate =
      todo.todoDate === null
        ? null
        : typeof todo.todoDate === "string"
          ? todo.todoDate
          : toLocalDateKey(todo.createdAt);
    const key = getSectionKey(todoDate);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push({ ...todo, todoDate });
  }

  const normalized = [];

  for (const items of grouped.values()) {
    const hasCustomOrder = items.some((item) => typeof item.order === "number");
    const sorted = hasCustomOrder
      ? [...items].sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
      : [...items].sort((a, b) => a.createdAt - b.createdAt);

    sorted.forEach((item, index) => {
      normalized.push({
        ...item,
        doneAt:
          item.doneAt ??
          (item.done ? item.createdAt : null),
        order: index + 1,
      });
    });
  }

  return normalized;
}

const INITIAL_TODOS = normalizeTodosWithOrder([
  {
    id: "t1",
    title: "Buy groceries",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "t2",
    title: "Finish React Native screen",
    done: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: "t3",
    title: "Call mom",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
]);

export const useTodosStore = create((set, get) => ({
  todos: INITIAL_TODOS,

  addTodo: (title, todoDate) => {
    const trimmed = String(title || "").trim();
    if (!trimmed) return;

    const now = Date.now();
    const targetDate = todoDate || toLocalDateKey(now);
    const targetKey = getSectionKey(targetDate);
    const sectionTodos = get().todos.filter((todo) => getSectionKey(todo.todoDate) === targetKey);
    const maxOrder = sectionTodos.reduce(
      (max, todo) => (typeof todo.order === "number" && todo.order > max ? todo.order : max),
      0
    );

    const todo = {
      id: String(now) + "-" + Math.random().toString(16).slice(2),
      title: trimmed,
      done: false,
      createdAt: now,
      todoDate: targetDate,
      order: maxOrder + 1,
    };

    set((state) => ({ todos: [...state.todos, todo] }));
  },

  addUndatedTodo: (title) => {
    const trimmed = String(title || "").trim();
    if (!trimmed) return;

    const now = Date.now();
    const sectionTodos = get().todos.filter((todo) => todo.todoDate === null);
    const maxOrder = sectionTodos.reduce(
      (max, todo) => (typeof todo.order === "number" && todo.order > max ? todo.order : max),
      0
    );

    const todo = {
      id: String(now) + "-" + Math.random().toString(16).slice(2),
      title: trimmed,
      done: false,
      createdAt: now,
      todoDate: null,
      order: maxOrder + 1,
    };

    set((state) => ({ todos: [...state.todos, todo] }));
  },

  toggleTodo: (id) => {
    set((state) => {
      const target = state.todos.find((todo) => todo.id === id);
      if (!target) return state;

      const toggledDone = !target.done;
      const now = Date.now();

      if (!toggledDone) {
        return {
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, done: false, doneAt: null } : todo
          ),
        };
      }

      const sectionKey = getSectionKey(target.todoDate);
      const sectionTodos = state.todos.filter(
        (todo) => getSectionKey(todo.todoDate) === sectionKey
      );
      const maxOrder = sectionTodos.reduce(
        (max, todo) => (typeof todo.order === "number" && todo.order > max ? todo.order : max),
        0
      );

      return {
        todos: state.todos.map((todo) =>
          todo.id === id
            ? { ...todo, done: true, doneAt: now, order: maxOrder + 1 }
            : todo
        ),
      };
    });
  },

  removeTodo: (id) => {
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
  },

  clearDone: () => {
    set((state) => ({ todos: state.todos.filter((t) => !t.done) }));
  },

  getTodoById: (id) => get().todos.find((t) => t.id === id),

  updateTodoTitle: (id, title) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, title } : t)),
    })),

  assignTodoDate: (id, todoDate) =>
    set((state) => {
      const target = state.todos.find((todo) => todo.id === id);
      if (!target || !todoDate) return state;

      const sectionTodos = state.todos.filter((todo) => todo.todoDate === todoDate);
      const maxOrder = sectionTodos.reduce(
        (max, todo) => (typeof todo.order === "number" && todo.order > max ? todo.order : max),
        0
      );

      return {
        todos: state.todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                todoDate,
                order: maxOrder + 1,
              }
            : todo
        ),
      };
    }),
}));
