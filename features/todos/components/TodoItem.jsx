import { Animated, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodosStore } from "../todo.store";
import { Theme } from "../../shared/constants/Theme";

export default function TodoItem({ todo, onAssignDate }) {
  const updateTodoTitle = useTodosStore((state) => state.updateTodoTitle);
  const toggleTodo = useTodosStore((state) => state.toggleTodo);
  const removeTodo = useTodosStore((state) => state.removeTodo);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const isSubmittingRef = useRef(false);
  const swipeRef = useRef(null);
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isEditing) setValue(todo.title);
  }, [todo.title, isEditing]);

  function animatePressIn() {
    Animated.timing(pressScale, {
      toValue: 0.98,
      duration: 90,
      useNativeDriver: true,
    }).start();
  }

  function animatePressOut() {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }

  function submit() {
    if (isSubmittingRef.current) return;
    const trimmed = value.trim();
    if (!trimmed) {
      setValue(todo.title);
      setIsEditing(false);
      return;
    }

    isSubmittingRef.current = true;
    if (trimmed !== todo.title) {
      updateTodoTitle(todo.id, trimmed);
    }
    setIsEditing(false);
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 0);
  }

  const hasAssignDate = typeof onAssignDate === "function";

  return (
    <Swipeable
      ref={swipeRef}
      enabled={!isEditing && !hasAssignDate}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={() => (
        <View style={styles.deleteAction}>
          <Text style={styles.actionText}>Delete</Text>
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (hasAssignDate) return;
        if (direction === "right") {
          removeTodo(todo.id);
        }
      }}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: pressScale }] }]}>
        {isEditing ? (
          <TextInput
            value={value}
            onChangeText={setValue}
            autoFocus
            onBlur={submit}
            onSubmitEditing={submit}
            returnKeyType="done"
            style={styles.input}
          />
        ) : (
          <View style={styles.row}>
            <Pressable
              onPress={() => setIsEditing(true)}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              style={[styles.pressable, styles.textContainer]}
            >
              <Text style={[styles.text, todo.done && styles.textDone]}>{todo.title}</Text>
            </Pressable>
            <View style={styles.actions}>
              <Pressable onPress={() => toggleTodo(todo.id)} style={styles.toggleButton}>
                <Ionicons
                  name={todo.done ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={todo.done ? Theme.colors.accentStrong : Theme.colors.textSubtle}
                />
              </Pressable>
              {hasAssignDate ? (
                <Pressable onPress={() => onAssignDate(todo)} style={styles.iconButton}>
                  <Ionicons name="calendar-outline" size={18} color={Theme.colors.accentStrong} />
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
      </Animated.View>
    </Swipeable>
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
  pressable: {
    justifyContent: "center",
    minHeight: 20,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  textContainer: {
    flex: 1,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  iconButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    marginLeft: 8,
    width: 28,
  },
  toggleButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  text: {
    color: Theme.colors.accentStrong,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  textDone: {
    color: Theme.colors.textSubtle,
    textDecorationLine: "line-through",
  },
  input: {
    color: Theme.colors.accentStrong,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    padding: 0,
  },
  deleteAction: {
    alignItems: "center",
    backgroundColor: Theme.colors.fab,
    borderBottomColor: Theme.colors.divider,
    borderBottomWidth: 1,
    justifyContent: "center",
    width: 88,
  },
  actionText: {
    color: "#fff",
    fontFamily: "Nunito_700Bold",
  },
});
