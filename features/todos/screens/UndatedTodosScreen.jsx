import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../shared/components/Header";
import Main from "../../shared/components/Main";
import MainHeadingText from "../../shared/components/MainHeadingText";
import { Colors } from "../../shared/constants/Colors";
import { Theme } from "../../shared/constants/Theme";
import NewTodoRow from "../components/NewTodoRow";
import TodoItem from "../components/TodoItem";
import { useTodosStore } from "../todo.store";

function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthYearWeek(date = new Date()) {
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((temp - yearStart) / 86400000 + 1) / 7);

  return `${month} ${year}, W${week}`;
}

export default function UndatedTodosScreen() {
  const todos = useTodosStore((state) => state.todos ?? []);
  const addUndatedTodo = useTodosStore((state) => state.addUndatedTodo);
  const assignTodoDate = useTodosStore((state) => state.assignTodoDate);

  const [pickerTodoId, setPickerTodoId] = useState(null);
  const [pickerDate, setPickerDate] = useState(new Date());

  const undatedTodos = useMemo(() => {
    return [...todos]
      .filter((todo) => todo.todoDate === null)
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return a.createdAt - b.createdAt;
      });
  }, [todos]);

  const closePicker = () => {
    setPickerTodoId(null);
    setPickerDate(new Date());
  };

  const onOpenTodoDatePicker = (todo) => {
    setPickerTodoId(todo.id);
    setPickerDate(new Date());
  };

  const confirmDate = (date) => {
    if (!pickerTodoId) return;
    assignTodoDate(pickerTodoId, toLocalDateKey(date ?? pickerDate));
    closePicker();
  };

  const onPickerChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        confirmDate(selectedDate);
      } else {
        closePicker();
      }
      return;
    }

    if (selectedDate) {
      setPickerDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Header header={<MainHeadingText>{getMonthYearWeek()}</MainHeadingText>} />
        <Main>
          <NewTodoRow
            day="No Date"
            onSubmit={addUndatedTodo}
            placeholder="Add item without a date"
          />
          <FlatList
            contentContainerStyle={styles.listContent}
            data={undatedTodos}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Shopping List</Text>
                <Ionicons color={Theme.colors.textSubtle} name="chevron-down" size={18} />
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your undated items will appear here.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TodoItem todo={item} onAssignDate={onOpenTodoDatePicker} />
            )}
          />
        </Main>
      </View>

      {pickerTodoId ? (
        <Modal animationType="fade" onRequestClose={closePicker} transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <DateTimePicker
                display={Platform.OS === "ios" ? "spinner" : "default"}
                mode="date"
                onChange={onPickerChange}
                value={pickerDate}
              />
              {Platform.OS === "ios" ? (
                <View style={styles.modalActions}>
                  <Pressable onPress={closePicker} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmDate()} style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Set Date</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: Colors.appBgColor,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 6,
  },
  listContent: {
    paddingBottom: 160,
  },
  listHeader: {
    alignItems: "center",
    borderBottomColor: Theme.colors.dividerStrong,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 22,
  },
  listTitle: {
    color: Theme.colors.accentStrong,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
  emptyContainer: {
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  emptyText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: Theme.colors.overlay,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    alignSelf: "stretch",
    backgroundColor: Theme.colors.surfaceRaised,
    borderRadius: 24,
    padding: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cancelText: {
    color: Theme.colors.text,
    fontFamily: "Nunito_700Bold",
  },
  confirmButton: {
    backgroundColor: Theme.colors.accentStrong,
    borderRadius: 10,
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Nunito_700Bold",
  },
});
