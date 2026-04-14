import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
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
      <Ionicons color={Theme.colors.textMuted} name="add" size={16} />
      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={submit}
        onBlur={submit}
        returnKeyType="done"
        placeholder={placeholder ?? `Add task...`}
        placeholderTextColor={Theme.colors.textSubtle}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    flexDirection: "row",
    marginHorizontal: 2,
    paddingBottom: 8,
    paddingTop: 4,
  },
  input: {
    color: Theme.colors.textMuted,
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    marginLeft: 12,
    padding: 0,
  },
});
