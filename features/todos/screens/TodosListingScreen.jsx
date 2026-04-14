import { useCallback, useEffect, useMemo, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import TodoList from "../components/TodoList";
import { Theme } from "../../shared/constants/Theme";

function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatWeekRange(date) {
  const weekStart = startOfWeekMonday(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startMonth = weekStart.toLocaleString("en-US", { month: "short" });
  const endMonth = weekEnd.toLocaleString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${endMonth}`;
  }

  return `${weekStart.getDate()} ${startMonth} - ${weekEnd.getDate()} ${endMonth}`;
}

function getWeekStatus(date) {
  const selectedStart = startOfWeekMonday(date);
  const currentStart = startOfWeekMonday(new Date());
  const selectedKey = toLocalDateKey(selectedStart);
  const currentKey = toLocalDateKey(currentStart);

  if (selectedKey === currentKey) {
    return { label: "This week", tone: "current" };
  }

  if (selectedKey < currentKey) {
    return { label: "Past week", tone: "past" };
  }

  return { label: "Upcoming", tone: "future" };
}

export default function TodosListingScreen({ route }) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [scrollResetToken, setScrollResetToken] = useState(0);
  const weekStatus = getWeekStatus(selectedWeek);
  const bumpScrollReset = useCallback(() => {
    setScrollResetToken((value) => value + 1);
  }, []);

  useEffect(() => {
    const dateKey = route?.params?.selectedDateKey;
    const jumpToken = route?.params?.jumpToken;
    if (!dateKey || !jumpToken) return;
    const [year, month, day] = String(dateKey).split("-").map(Number);
    if (!year || !month || !day) return;
    setSelectedWeek(new Date(year, month - 1, day));
  }, [route?.params?.jumpToken, route?.params?.selectedDateKey]);

  useEffect(() => {
    const resetToken = route?.params?.resetToCurrentWeekToken;
    if (!resetToken) return;
    setSelectedWeek(new Date());
    bumpScrollReset();
  }, [bumpScrollReset, route?.params?.resetToCurrentWeekToken]);

  useEffect(() => {
    const focusToken = route?.params?.focusScrollToken;
    if (!focusToken) return;
    bumpScrollReset();
  }, [bumpScrollReset, route?.params?.focusScrollToken]);

  const shiftWeek = (amount) => {
    setSelectedWeek((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + amount * 7);
      return next;
    });
    bumpScrollReset();
  };

  useFocusEffect(
    useMemo(
      () => () => {
        bumpScrollReset();
      },
      [bumpScrollReset]
    )
  );

  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderRelease: (_, gestureState) => {
          const { dx, vx } = gestureState;
          if (dx <= -24 || vx <= -0.16) {
            shiftWeek(1);
            return;
          }
          if (dx >= 24 || vx >= 0.16) {
            shiftWeek(-1);
          }
        },
      }),
    []
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable style={styles.topIconButton}>
            <Ionicons color={Theme.colors.text} name="menu-outline" size={22} />
          </Pressable>
          <Text style={styles.brand}>Tidly</Text>
          <Pressable style={styles.topIconButton}>
            <Ionicons color={Theme.colors.text} name="add" size={20} />
          </Pressable>
        </View>

        <View style={styles.weekSelector}>
          <Pressable onPress={() => shiftWeek(-1)} style={styles.weekNavButton}>
            <Ionicons color={Theme.colors.textMuted} name="chevron-back" size={18} />
          </Pressable>
          <View style={styles.weekCenter}>
            <View
              style={[
                styles.weekRangePill,
                weekStatus.tone === "current" && styles.weekRangePillCurrent,
                weekStatus.tone === "past" && styles.weekRangePillPast,
                weekStatus.tone === "future" && styles.weekRangePillFuture,
              ]}
            >
              <Text style={styles.weekLabel}>{formatWeekRange(selectedWeek)}</Text>
            </View>
          </View>
          <Pressable onPress={() => shiftWeek(1)} style={styles.weekNavButton}>
            <Ionicons color={Theme.colors.textMuted} name="chevron-forward" size={18} />
          </Pressable>
        </View>

        <View style={styles.listArea} {...swipeResponder.panHandlers}>
          <TodoList selectedWeek={selectedWeek} scrollResetToken={scrollResetToken} />
        </View>
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
  weekSelector: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
    paddingBottom: 2,
  },
  weekNavButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  weekCenter: {
    alignItems: "center",
    flex: 0,
  },
  weekRangePill: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.divider,
    borderRadius: 999,
    borderWidth: 1,
    marginHorizontal: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  weekRangePillCurrent: {
    backgroundColor: "#FFF7E7",
    borderColor: "#F1DEAC",
  },
  weekRangePillPast: {
    backgroundColor: "#F7F4EE",
    borderColor: "#E8E1D5",
  },
  weekRangePillFuture: {
    backgroundColor: "#EEF7EF",
    borderColor: "#D6E9D8",
  },
  weekLabel: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  listArea: {
    flex: 1,
  },
});
