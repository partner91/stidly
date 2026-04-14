import { create } from "zustand";
import { normalizeTodoInput } from "./todoTime";

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

function compareDateKeys(left, right) {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
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

const currentWeekStart = startOfWeekMonday(new Date());

function getWeekDate(offset) {
  const date = new Date(currentWeekStart);
  date.setDate(currentWeekStart.getDate() + offset);
  return toLocalDateKey(date);
}

const INITIAL_TODOS = normalizeTodosWithOrder([
  {
    id: "t1",
    title: "Dentist",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    todoDate: getWeekDate(0),
    order: 1,
  },
  {
    id: "t2",
    title: "Call bank",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2 + 1,
    todoDate: getWeekDate(0),
    order: 2,
  },
  {
    id: "t3",
    title: "Buy diapers",
    done: true,
    doneAt: Date.now() - 1000 * 60 * 60,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    todoDate: getWeekDate(0),
    order: 3,
  },
  {
    id: "t4",
    title: "Call plumber",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 22,
    todoDate: getWeekDate(1),
    order: 1,
  },
  {
    id: "t5",
    title: "Team meeting",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    todoDate: getWeekDate(1),
    order: 2,
  },
  {
    id: "t6",
    title: "Grocery shopping",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    todoDate: getWeekDate(2),
    order: 1,
  },
  {
    id: "t7",
    title: "Pay electricity bill",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 17,
    todoDate: getWeekDate(2),
    order: 2,
  },
  {
    id: "t8",
    title: "Finish React Native screen",
    done: true,
    doneAt: Date.now() - 1000 * 60 * 45,
    createdAt: Date.now() - 1000 * 60 * 60 * 16,
    todoDate: getWeekDate(3),
    order: 1,
  },
  {
    id: "t9",
    title: "Call mom",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 15,
    todoDate: getWeekDate(3),
    order: 2,
  },
  {
    id: "t10",
    title: "Buy groceries",
    done: true,
    doneAt: Date.now() - 1000 * 60 * 50,
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
    todoDate: getWeekDate(3),
    order: 3,
  },
  {
    id: "t11",
    title: "Review home screen",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 13,
    todoDate: getWeekDate(3),
    order: 4,
  },
  {
    id: "t12",
    title: "Send client update",
    done: true,
    doneAt: Date.now() - 1000 * 60 * 40,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    todoDate: getWeekDate(3),
    order: 5,
  },
  {
    id: "t13",
    title: "Coffee with Ana",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 11,
    todoDate: getWeekDate(4),
    order: 1,
  },
  {
    id: "u1",
    title: "Parking permit",
    done: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    todoDate: null,
    order: 1,
  },
]);

export const useTodosStore = create((set, get) => ({
  todos: INITIAL_TODOS,

  addTodo: (title, todoDate) => {
    const normalized = normalizeTodoInput(title);
    if (!normalized.title) return;

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
      title: normalized.title,
      timeText: normalized.timeText,
      carriedOver: false,
      carriedFromDate: null,
      done: false,
      createdAt: now,
      todoDate: targetDate,
      order: maxOrder + 1,
    };

    set((state) => ({ todos: [...state.todos, todo] }));
  },

  addUndatedTodo: (title) => {
    const normalized = normalizeTodoInput(title);
    if (!normalized.title) return;

    const now = Date.now();
    const sectionTodos = get().todos.filter((todo) => todo.todoDate === null);
    const maxOrder = sectionTodos.reduce(
      (max, todo) => (typeof todo.order === "number" && todo.order > max ? todo.order : max),
      0
    );

    const todo = {
      id: String(now) + "-" + Math.random().toString(16).slice(2),
      title: normalized.title,
      timeText: normalized.timeText,
      carriedOver: false,
      carriedFromDate: null,
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

  refreshCarriedTodos: () =>
    set((state) => {
      const todayKey = toLocalDateKey(new Date());
      const todos = [...state.todos];
      const overdueTodos = todos
        .filter(
          (todo) =>
            !todo.done &&
            typeof todo.todoDate === "string" &&
            compareDateKeys(todo.todoDate, todayKey) < 0
        )
        .sort((a, b) => {
          const dateCompare = compareDateKeys(a.todoDate, b.todoDate);
          if (dateCompare !== 0) return dateCompare;
          const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
          const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
          if (orderA !== orderB) return orderA - orderB;
          return a.createdAt - b.createdAt;
        });

      if (!overdueTodos.length) return state;

      let nextTodayOrder = todos.reduce((max, todo) => {
        if (todo.todoDate !== todayKey) return max;
        return typeof todo.order === "number" && todo.order > max ? todo.order : max;
      }, 0);

      const nextTodos = todos.map((todo) => {
        if (
          todo.done ||
          typeof todo.todoDate !== "string" ||
          compareDateKeys(todo.todoDate, todayKey) >= 0
        ) {
          return todo;
        }

        nextTodayOrder += 1;
        return {
          ...todo,
          todoDate: todayKey,
          carriedOver: true,
          carriedFromDate: todo.todoDate,
          order: nextTodayOrder,
        };
      });

      return { todos: normalizeTodosWithOrder(nextTodos) };
    }),

  getTodoById: (id) => get().todos.find((t) => t.id === id),

  updateTodoTitle: (id, title) =>
    set((state) => ({
      todos: state.todos.map((t) => {
        if (t.id !== id) return t;
        const normalized = normalizeTodoInput(title);
        return normalized.title
          ? { ...t, title: normalized.title, timeText: normalized.timeText }
          : t;
      }),
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
                carriedOver: false,
                carriedFromDate: null,
                order: maxOrder + 1,
              }
            : todo
        ),
      };
    }),
}));
