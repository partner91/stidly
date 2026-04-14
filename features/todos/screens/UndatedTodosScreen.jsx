import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Theme } from "../../shared/constants/Theme";
import { useTodosStore } from "../todo.store";

const INITIAL_LISTS = [
  {
    id: "pl-1",
    title: "Eva",
    color: "#97D9E1",
    expanded: true,
    items: [
      { id: "pl-1-i1", title: "Poklon za Ivana", done: false, ringColor: null },
      { id: "pl-1-i2", title: "Auto servis", done: false, ringColor: null },
      { id: "pl-1-i3", title: "Organizirati DJ", done: false, ringColor: null },
    ],
  },
  {
    id: "pl-2",
    title: "Prodati",
    color: "#E6BA68",
    expanded: true,
    items: [
      { id: "pl-2-i1", title: "Djecja kolica", done: false, ringColor: null },
      { id: "pl-2-i2", title: "Stara stolica", done: false, ringColor: null },
    ],
  },
  {
    id: "pl-3",
    title: "Ducan",
    color: "#74C6A2",
    expanded: true,
    items: [
      { id: "pl-3-i1", title: "Brasno", done: false, ringColor: null },
      { id: "pl-3-i2", title: "Avokado", done: false, ringColor: null },
      { id: "pl-3-i3", title: "Banana", done: false, ringColor: null },
    ],
  },
  {
    id: "pl-4",
    title: "Ideje",
    color: "#B9A9F0",
    expanded: true,
    items: [
      { id: "pl-4-i1", title: "Reminders iOS", done: false, ringColor: null },
      { id: "pl-4-i2", title: "Search tasks", done: false, ringColor: null },
      { id: "pl-4-i3", title: "Tasks with no due date", done: false, ringColor: null },
    ],
  },
];

const LIST_COLORS = ["#97D9E1", "#E6BA68", "#74C6A2", "#B9A9F0", "#F2A6A1", "#9EC3F5"];

function countOpenItems(items) {
  return items.filter((item) => !item.done).length;
}

function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function UndatedTodosScreen() {
  const insets = useSafeAreaInsets();
  const addTodo = useTodosStore((state) => state.addTodo);
  const listRef = useRef(null);
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [drafts, setDrafts] = useState({});
  const [editingListId, setEditingListId] = useState(null);
  const [listTitleDraft, setListTitleDraft] = useState("");
  const [pickerTarget, setPickerTarget] = useState(null);
  const [pickerDate, setPickerDate] = useState(new Date());

  const orderedLists = useMemo(() => lists, [lists]);

  function focusListCard(index, { animated = true, viewPosition = 0.18 } = {}) {
    if (index == null) return;
    listRef.current?.scrollToIndex?.({
      animated,
      index,
      viewOffset: 12,
      viewPosition,
    });
  }

  function updateDraft(listId, value) {
    setDrafts((current) => ({ ...current, [listId]: value }));
  }

  function toggleList(listId) {
    if (editingListId === listId) return;
    setLists((current) =>
      current.map((list) =>
        list.id === listId ? { ...list, expanded: !list.expanded } : list
      )
    );
  }

  function startEditingListTitle(list, index) {
    focusListCard(index);
    setEditingListId(list.id);
    setListTitleDraft(list.title);
    setTimeout(() => {
      focusListCard(index, { animated: true, viewPosition: 0.2 });
    }, 180);
  }

  function submitListTitle(listId) {
    const nextTitle = String(listTitleDraft || "").trim();
    if (!nextTitle) {
      setEditingListId(null);
      setListTitleDraft("");
      return;
    }

    setLists((current) =>
      current.map((list) => (list.id === listId ? { ...list, title: nextTitle } : list))
    );
    setEditingListId(null);
    setListTitleDraft("");
  }

  function toggleItem(listId, itemId) {
    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : list
      )
    );
  }

  function addItem(listId) {
    const rawDraft = String(drafts[listId] || "").trim();
    if (!rawDraft) return;

    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              expanded: true,
              items: [
                ...list.items,
                {
                  id: `${listId}-${Date.now()}`,
                  title: rawDraft,
                  done: false,
                  ringColor: null,
                },
              ],
            }
          : list
      )
    );
    setDrafts((current) => ({ ...current, [listId]: "" }));
  }

  function addList() {
    const color = LIST_COLORS[lists.length % LIST_COLORS.length];
    const nextIndex = lists.length + 1;
    const nextId = `pl-${Date.now()}`;
    setLists((current) => [
      ...current,
      {
        id: nextId,
        title: `Nova lista ${nextIndex}`,
        color,
        expanded: true,
        items: [],
      },
    ]);
    setDrafts((current) => ({ ...current, [nextId]: "" }));
  }

  function openDatePicker(listId, itemId) {
    setPickerTarget({ listId, itemId });
    setPickerDate(new Date());
  }

  function closePicker() {
    setPickerTarget(null);
    setPickerDate(new Date());
  }

  function moveItemToWeek(date) {
    if (!pickerTarget) return;

    const targetDate = toLocalDateKey(date ?? pickerDate);
    let movedTitle = null;

    setLists((current) =>
      current
        .map((list) => {
          if (list.id !== pickerTarget.listId) return list;

          const nextItems = list.items.filter((item) => {
            if (item.id !== pickerTarget.itemId) return true;
            movedTitle = item.title;
            return false;
          });

          return { ...list, items: nextItems };
        })
        .filter((list) => list.items.length > 0 || list.id !== pickerTarget.listId)
    );

    if (movedTitle) {
      addTodo(movedTitle, targetDate);
    }

    closePicker();
  }

  function onPickerChange(event, selectedDate) {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        moveItemToWeek(selectedDate);
      } else {
        closePicker();
      }
      return;
    }

    if (selectedDate) {
      setPickerDate(selectedDate);
    }
  }

  function renderListCard({ item: list, index }) {
    const openCount = countOpenItems(list.items);
    const isLast = index === orderedLists.length - 1;

    return (
      <View style={[styles.card, isLast && styles.lastCard]}>
        <Pressable onPress={() => toggleList(list.id)} style={styles.cardHeader}>
          <Pressable onPress={() => startEditingListTitle(list)} style={styles.cardTitleRow}>
            <View style={[styles.cardDot, { backgroundColor: list.color }]} />
            {editingListId === list.id ? (
              <TextInput
                autoFocus
                onBlur={() => submitListTitle(list.id)}
                onChangeText={setListTitleDraft}
                onFocus={() => {
                  focusListCard(index, { animated: true, viewPosition: 0.22 });
                }}
                onSubmitEditing={() => submitListTitle(list.id)}
                returnKeyType="done"
                selectTextOnFocus
                style={styles.cardTitleInput}
                value={listTitleDraft}
              />
            ) : (
              <Text style={styles.cardTitle} onPress={() => startEditingListTitle(list, index)}>
                {list.title}
              </Text>
            )}
          </Pressable>
          <View style={styles.cardMeta}>
            <View style={styles.countBubble}>
              <Text style={styles.countText}>{openCount}</Text>
            </View>
            <Ionicons
              color={Theme.colors.textMuted}
              name={list.expanded ? "chevron-down" : "chevron-forward"}
              size={16}
            />
          </View>
        </Pressable>

        {list.expanded ? (
          <>
            <View style={styles.itemsBlock}>
              {list.items.map((listItem) => (
                <Pressable
                  key={listItem.id}
                  style={styles.itemRow}
                >
                  <Pressable onPress={() => toggleItem(list.id, listItem.id)} style={styles.itemMain}>
                    <View
                      style={[
                        styles.itemRing,
                        listItem.ringColor && { borderColor: listItem.ringColor },
                        listItem.done && styles.itemRingDone,
                      ]}
                    />
                    <Text style={[styles.itemText, listItem.done && styles.itemTextDone]}>
                      {listItem.title}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openDatePicker(list.id, listItem.id)}
                    style={styles.itemCalendarButton}
                  >
                    <Ionicons
                      color={Theme.colors.textSubtle}
                      name="calendar-clear-outline"
                      size={16}
                    />
                  </Pressable>
                </Pressable>
              ))}
            </View>

            <View style={styles.addRow}>
              <Ionicons color={Theme.colors.textMuted} name="add" size={16} />
              <TextInput
                onChangeText={(value) => updateDraft(list.id, value)}
                onSubmitEditing={() => addItem(list.id)}
                placeholder="Add task..."
                placeholderTextColor={Theme.colors.textSubtle}
                returnKeyType="done"
                style={styles.addInput}
                value={drafts[list.id] ?? ""}
              />
            </View>
          </>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top + 18}
        style={styles.screen}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.topIconButton}>
            <Ionicons color={Theme.colors.text} name="menu-outline" size={22} />
          </Pressable>
          <Text style={styles.brand}>Tidly</Text>
          <Pressable onPress={addList} style={styles.topIconButton}>
            <Ionicons color={Theme.colors.text} name="add" size={20} />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Parking Lot</Text>
        </View>

        <FlatList
          ref={listRef}
          contentContainerStyle={styles.listContent}
          data={orderedLists}
          getItemLayout={(_, index) => ({
            index,
            length: 232,
            offset: 232 * index,
          })}
          keyExtractor={(item) => item.id}
          onScrollToIndexFailed={() => {}}
          keyboardShouldPersistTaps="handled"
          renderItem={renderListCard}
          showsVerticalScrollIndicator={false}
        />

        {pickerTarget ? (
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
                    <Pressable onPress={() => moveItemToWeek()} style={styles.confirmButton}>
                      <Text style={styles.confirmText}>Move to week</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </View>
          </Modal>
        ) : null}
      </KeyboardAvoidingView>

      <View pointerEvents="box-none" style={[styles.bottomActionWrap, { bottom: insets.bottom + 74 }]}>
        <Pressable onPress={addList} style={styles.bottomAction}>
          <View style={styles.bottomActionIcon}>
            <Text style={styles.bottomActionPlus}>+</Text>
          </View>
          <Text style={styles.bottomActionText}>New list</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: Theme.colors.surface,
    flex: 1,
  },
  screen: {
    backgroundColor: Theme.colors.surface,
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 14,
  },
  topIconButton: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.divider,
    borderRadius: 16,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  brand: {
    color: Theme.colors.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: Theme.colors.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 92,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.divider,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  lastCard: {
    marginBottom: 22,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  cardTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  cardDot: {
    borderRadius: 99,
    height: 10,
    marginRight: 10,
    width: 10,
  },
  cardTitle: {
    color: Theme.colors.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  cardTitleInput: {
    color: Theme.colors.text,
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    padding: 0,
  },
  cardMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    width: 48,
  },
  countBubble: {
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceSoft,
    borderRadius: 99,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  countText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
  },
  itemsBlock: {
    paddingBottom: 2,
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  itemMain: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  itemRing: {
    borderColor: "#D8D6D2",
    borderRadius: 99,
    borderWidth: 1.4,
    height: 16,
    marginRight: 10,
    width: 16,
  },
  itemRingDone: {
    backgroundColor: Theme.colors.accentSoft,
    borderColor: Theme.colors.accentStrong,
  },
  itemText: {
    color: Theme.colors.text,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
  },
  itemTextDone: {
    color: Theme.colors.textSubtle,
    textDecorationLine: "line-through",
  },
  itemCalendarButton: {
    alignItems: "flex-end",
    height: 22,
    justifyContent: "center",
    width: 48,
  },
  addRow: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    flexDirection: "row",
    marginHorizontal: 2,
    paddingBottom: 8,
    paddingTop: 4,
  },
  addInput: {
    color: Theme.colors.textMuted,
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    marginLeft: 12,
    padding: 0,
  },
  bottomActionWrap: {
    alignItems: "flex-end",
    left: 18,
    position: "absolute",
    right: 18,
  },
  bottomAction: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.divider,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  bottomActionIcon: {
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceSoft,
    borderColor: "#E8DDD1",
    borderRadius: 999,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    marginRight: 7,
    width: 22,
  },
  bottomActionPlus: {
    color: Theme.colors.danger,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    lineHeight: 16,
  },
  bottomActionText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
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
