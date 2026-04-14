import { Alert, Animated, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodosStore } from "../todo.store";
import { Theme } from "../../shared/constants/Theme";
import { getTodoInputValue, getTodoTimeLabel } from "../todoTime";

export default function TodoItem({ todo, onAssignDate }) {
  const updateTodoTitle = useTodosStore((state) => state.updateTodoTitle);
  const toggleTodo = useTodosStore((state) => state.toggleTodo);
  const removeTodo = useTodosStore((state) => state.removeTodo);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(getTodoInputValue(todo));
  const isSubmittingRef = useRef(false);
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isEditing) setValue(getTodoInputValue(todo));
  }, [todo.title, todo.timeText, isEditing]);

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
      setValue(getTodoInputValue(todo));
      setIsEditing(false);
      return;
    }

    isSubmittingRef.current = true;
    if (trimmed !== getTodoInputValue(todo)) {
      updateTodoTitle(todo.id, trimmed);
    }
    setIsEditing(false);
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 0);
  }

  function confirmRemove() {
    Alert.alert("Delete task?", todo.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeTodo(todo.id),
      },
    ]);
  }

  const hasAssignDate = typeof onAssignDate === "function";
  const timeLabel = getTodoTimeLabel(todo);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pressScale }] }]}>
      {isEditing ? (
        <TextInput
          value={value}
          onChangeText={setValue}
          autoFocus
          onBlur={submit}
          onSubmitEditing={submit}
          returnKeyType="done"
          style={[styles.input, styles.inputWithToggleSpacing]}
        />
      ) : (
        <View style={styles.row}>
          <View style={styles.leadingColumn}>
            <Pressable onPress={() => toggleTodo(todo.id)} style={styles.toggleButton}>
              <Ionicons
                name={todo.done ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={todo.done ? Theme.colors.accentStrong : Theme.colors.textSubtle}
              />
            </Pressable>
          </View>
          <Pressable
            onPress={() => setIsEditing(true)}
            onLongPress={confirmRemove}
            delayLongPress={450}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            style={[styles.pressable, styles.textContainer]}
          >
            <View style={styles.textRow}>
              <Text style={[styles.text, todo.done && styles.textDone]}>{todo.title}</Text>
              {todo.carriedOver ? (
                <View style={styles.carriedBadge}>
                  <Text style={styles.carriedBadgeText}>{"<->"}</Text>
                </View>
              ) : null}
              {timeLabel ? (
                <View
                  style={[
                    styles.timePill,
                    timeLabel.tone === "danger" && styles.timePillDanger,
                    timeLabel.tone === "warning" && styles.timePillWarning,
                    timeLabel.tone === "info" && styles.timePillInfo,
                    timeLabel.tone === "success" && styles.timePillSuccess,
                  ]}
                >
                  <Text style={styles.timeText}>{timeLabel.text}</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
          <View style={styles.actions}>
            {hasAssignDate ? (
              <Pressable onPress={() => onAssignDate(todo)} style={styles.iconButton}>
                <Ionicons name="calendar-outline" size={18} color={Theme.colors.accentStrong} />
              </Pressable>
            ) : null}
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    marginHorizontal: 2,
    paddingVertical: 4,
  },
  pressable: {
    justifyContent: "center",
    minHeight: 18,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  leadingColumn: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
  },
  textContainer: {
    flex: 1,
  },
  textRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft: 8,
    width: 40,
  },
  iconButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  toggleButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  text: {
    color: Theme.colors.text,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
  },
  textDone: {
    color: Theme.colors.textSubtle,
    textDecorationLine: "line-through",
  },
  input: {
    color: Theme.colors.accentStrong,
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    padding: 0,
  },
  inputWithToggleSpacing: {
    marginLeft: 28,
  },
  timePill: {
    borderRadius: 999,
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  timePillWarning: {
    backgroundColor: "#FFF0C9",
  },
  timePillDanger: {
    backgroundColor: "#F8D7D4",
  },
  timePillInfo: {
    backgroundColor: Theme.colors.infoSoft,
  },
  timePillSuccess: {
    backgroundColor: Theme.colors.successSoft,
  },
  timeText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
  },
  carriedBadge: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    minWidth: 22,
  },
  carriedBadgeText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    lineHeight: 15,
  },
});
