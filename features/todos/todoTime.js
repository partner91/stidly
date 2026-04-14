export function normalizeTodoInput(rawValue) {
  const trimmed = String(rawValue || "").trim();
  if (!trimmed) return { title: "", timeText: null };

  const match = trimmed.match(/^(.*?)(?:\s+)(\d{1,2})(?::(\d{2}))?$/);
  if (!match) {
    return { title: trimmed, timeText: null };
  }

  const [, rawTitle, rawHour, rawMinute] = match;
  const title = rawTitle.trim();
  const hour = Number(rawHour);
  const minute = rawMinute === undefined ? 0 : Number(rawMinute);

  if (!title || Number.isNaN(hour) || Number.isNaN(minute)) {
    return { title: trimmed, timeText: null };
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return { title: trimmed, timeText: null };
  }

  return {
    title,
    timeText: `${hour}:${String(minute).padStart(2, "0")}`,
  };
}

export function getTodoInputValue(todo) {
  const title = String(todo?.title || "").trim();
  const timeText = String(todo?.timeText || "").trim();
  if (!timeText) return title;
  return `${title} ${timeText}`.trim();
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTimeTone(todo) {
  const timeText = String(todo?.timeText || "").trim();
  if (!timeText) return null;

  const [rawHour, rawMinute] = timeText.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "info";

  const now = new Date();
  const todayKey = getDateKey(now);
  const todoDate = todo?.todoDate || todayKey;

  if (todoDate !== todayKey) {
    return todoDate < todayKey ? "danger" : "success";
  }

  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);

  const diffMinutes = Math.round((target.getTime() - now.getTime()) / (1000 * 60));
  if (diffMinutes < 0) return "danger";
  if (diffMinutes <= 90) return "warning";
  return "info";
}

export function getTodoTimeLabel(todo) {
  if (todo?.timeText) {
    return { text: todo.timeText, tone: getTimeTone(todo) };
  }
  return null;
}
