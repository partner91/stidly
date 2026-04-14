import React, { useEffect, useMemo, useRef } from "react";
import { SectionList, StyleSheet } from "react-native";
import TodoItem from "./TodoItem";
import TodoHeader from "./TodoHeader";
import { useTodosStore } from "../todo.store";
import NewTodoRow from "./NewTodoRow";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDayMonthLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return {
    dayNumber: date.getDate(),
    dayName: date.toLocaleString("en-US", { weekday: "long" }),
  };
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export default function TodoList({ selectedWeek, scrollResetToken = 0 }) {
  const todos = useTodosStore((state) => state.todos ?? []);
  const refreshCarriedTodos = useTodosStore((state) => state.refreshCarriedTodos);
  const listRef = useRef(null);
  const pendingScrollTokenRef = useRef(null);

  useEffect(() => {
    refreshCarriedTodos();
  }, [refreshCarriedTodos, todos]);

  const sections = useMemo(() => {
    const grouped = new Map();
    const weekStart = startOfWeekMonday(selectedWeek ?? new Date());
    const todayKey = toLocalDateKey(new Date());

    const weekDates = DAY_ORDER.map((title, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return { title, dateKey: toLocalDateKey(date) };
    });
    const weekDateSet = new Set(weekDates.map((item) => item.dateKey));

    for (const todo of todos) {
      const todoDate =
        todo.todoDate === null
          ? null
          : typeof todo.todoDate === "string"
            ? todo.todoDate
            : toLocalDateKey(todo.createdAt);
      if (!todoDate) continue;
      if (!weekDateSet.has(todoDate)) continue;

      if (!grouped.has(todoDate)) grouped.set(todoDate, []);
      grouped.get(todoDate).push(todo);
    }

    for (const items of grouped.values()) {
      items.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;

        if (a.done && b.done) {
          const doneAtA = a.doneAt ?? a.createdAt;
          const doneAtB = b.doneAt ?? b.createdAt;
          if (doneAtA !== doneAtB) return doneAtA - doneAtB;
        }

        const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return a.createdAt - b.createdAt;
      });
    }

    return weekDates.map(({ title, dateKey }) => {
      const sectionTodos = grouped.get(dateKey) ?? [];
      const completedCount = sectionTodos.filter((todo) => todo.done).length;
      const totalCount = sectionTodos.length;

      return {
        title,
        dateKey,
        isToday: dateKey === todayKey,
        completedCount,
        totalCount,
        dateLabel: toDayMonthLabel(dateKey),
        data: [...sectionTodos, { __type: "input", dateKey, day: title }],
      };
    });
  }, [selectedWeek, todos]);

  function scrollToTargetSection() {
    if (!sections.length) return;

    const todaySectionIndex = sections.findIndex((section) => section.isToday);
    const targetSectionIndex = todaySectionIndex >= 0 ? todaySectionIndex : 0;
    listRef.current?.scrollToLocation({
      animated: false,
      itemIndex: 0,
      sectionIndex: targetSectionIndex,
      viewOffset: 0,
      viewPosition: 0,
    });
    pendingScrollTokenRef.current = null;
  }

  useEffect(() => {
    if (!sections.length) return;
    pendingScrollTokenRef.current = scrollResetToken;

    const timer = setTimeout(() => {
      scrollToTargetSection();
    }, 0);

    return () => clearTimeout(timer);
  }, [scrollResetToken, sections]);

  return (
    <SectionList
      ref={listRef}
      contentContainerStyle={styles.listContent}
      sections={sections}
      onContentSizeChange={() => {
        if (pendingScrollTokenRef.current !== null) {
          scrollToTargetSection();
        }
      }}
      onScrollToIndexFailed={() => {}}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <TodoHeader
          title={section.title}
          completedCount={section.completedCount}
          totalCount={section.totalCount}
          dateLabel={section.dateLabel}
          isToday={section.isToday}
        />
      )}
      renderItem={({ item }) => {
        if (item.__type === "input") {
          return <NewTodoRow dateKey={item.dateKey} day={item.day} />;
        }

        return <TodoItem todo={item} />;
      }}
      keyExtractor={(item) => {
        if (item.__type === "input") return `input-${item.dateKey}`;
        return item.id;
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 164,
    paddingTop: 2,
  },
});
