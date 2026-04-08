import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTodosStore } from "../todo.store";
import { Theme } from "../../shared/constants/Theme";

export default function NewTodoRow({ day, dateKey, placeholder, onSubmit }) {
  const addTodo = useTodosStore((state) => state.addTodo);
  const [value, setValue] = useState("");
  const isSubmittingRef = useRef(false);

  const submit = () => {
    if (isSubmittingRef.current) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    isSubmittingRef.current = true;
    if (onSubmit) {
      onSubmit(trimmed);
    } else {
      addTodo(trimmed, dateKey);
    }
    setValue("");
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 0);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={submit}
        onBlur={submit}
        returnKeyType="done"
        placeholder={placeholder ?? `Add todo for ${day}`}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderBottomColor: Theme.colors.divider,
    borderBottomWidth: 1,
    marginHorizontal: 24,
    paddingVertical: 10,
  },
  input: {
    color: Theme.colors.accentStrong,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    padding: 0,
  },
});
