import { supabase } from "../auth/supabase.client";

function mapTodo(row) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    doneAt: row.done_at ? new Date(row.done_at).getTime() : null,
    todoDate: row.todo_date,
    order: row.display_order,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    userId: row.user_id,
  };
}

export async function fetchTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("todo_date", { ascending: true, nullsFirst: true })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapTodo);
}

export async function createTodo({ title, todoDate = null, displayOrder = 0, done = false }) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("You must be signed in to create todos.");

  const { data, error } = await supabase
    .from("todos")
    .insert({
      user_id: user.id,
      title,
      todo_date: todoDate,
      done,
      display_order: displayOrder,
      done_at: done ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapTodo(data);
}

export async function updateTodo(id, patch) {
  const updates = {};

  if (typeof patch.title === "string") updates.title = patch.title;
  if ("todoDate" in patch) updates.todo_date = patch.todoDate;
  if ("done" in patch) {
    updates.done = patch.done;
    updates.done_at = patch.done ? new Date().toISOString() : null;
  }
  if ("displayOrder" in patch) updates.display_order = patch.displayOrder;

  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapTodo(data);
}

export async function removeTodo(id) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
}
