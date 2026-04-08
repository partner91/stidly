import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../shared/components/Header";
import Main from "../../shared/components/Main";
import MainHeadingText from "../../shared/components/MainHeadingText";
import NavigationButton from "../../shared/components/NavigationButton";
import { Colors } from "../../shared/constants/Colors";
import { Theme } from "../../shared/constants/Theme";
import { useTodosStore } from "../../todos/todo.store";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getMonthCells(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      dateKey: toLocalDateKey(date),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function MonthBlock({ monthDate, countByDate, isLast, onPressDate, todayKey }) {
  const monthLabel = monthDate.toLocaleString("en-US", { month: "long" });
  const cells = getMonthCells(monthDate);

  return (
    <View style={[styles.monthBlock, !isLast && styles.monthBlockDivider]}>
      <Text style={styles.monthTitle}>{monthLabel}</Text>
      <View style={styles.weekHeaderRow}>
        {WEEK_DAYS.map((day) => (
          <Text key={day} style={styles.weekHeaderText}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell, index) => {
          if (!cell) {
            return <View key={`empty-${monthLabel}-${index}`} style={styles.dayCell} />;
          }

          const todoCount = countByDate.get(cell.dateKey) ?? 0;
          const dotCount = Math.min(todoCount, 3);
          const isToday = cell.dateKey === todayKey;

          return (
            <Pressable
              key={cell.dateKey}
              style={[styles.dayCell, isToday && styles.dayCellActive]}
              onPress={() => onPressDate(cell.dateKey)}
            >
              <Text style={[styles.dayText, isToday && styles.dayTextActive]}>{cell.day}</Text>
              <View style={styles.dotsRow}>
                {Array.from({ length: dotCount }).map((_, dotIndex) => (
                  <View
                    key={`${cell.dateKey}-dot-${dotIndex}`}
                    style={[styles.dot, isToday && styles.dotActive]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function CalendarOverviewScreen({ navigation }) {
  const todos = useTodosStore((state) => state.todos ?? []);
  const [anchorMonth, setAnchorMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const countByDate = useMemo(() => {
    const counts = new Map();
    for (const todo of todos) {
      const todoDate =
        todo.todoDate === null
          ? null
          : typeof todo.todoDate === "string"
            ? todo.todoDate
            : toLocalDateKey(todo.createdAt);
      if (!todoDate) continue;
      counts.set(todoDate, (counts.get(todoDate) ?? 0) + 1);
    }
    return counts;
  }, [todos]);

  const months = useMemo(() => {
    const currentMonth = new Date(anchorMonth.getFullYear(), anchorMonth.getMonth(), 1);
    const nextMonth = new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() + 1, 1);
    return [currentMonth, nextMonth];
  }, [anchorMonth]);

  const headerLabel = anchorMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  const todayKey = toLocalDateKey(new Date());

  const goPreviousMonth = () => {
    setAnchorMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setAnchorMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const openDate = (dateKey) => {
    navigation.navigate("Home", {
      selectedDateKey: dateKey,
      selectedDateTimestamp: fromDateKey(dateKey).getTime(),
      jumpToken: Date.now(),
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Header
          header={<MainHeadingText>{headerLabel}</MainHeadingText>}
          navigationButtons={
            <>
              <NavigationButton direction="back" onPress={goPreviousMonth} />
              <NavigationButton direction="forward" onPress={goNextMonth} />
            </>
          }
        />
        <Main>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {months.map((monthDate, index) => (
              <MonthBlock
                key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
                monthDate={monthDate}
                countByDate={countByDate}
                isLast={index === months.length - 1}
                onPressDate={openDate}
                todayKey={todayKey}
              />
            ))}
          </ScrollView>
        </Main>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.appBgColor,
  },
  container: {
    flex: 1,
    paddingTop: 6,
  },
  scrollContent: {
    paddingBottom: 164,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  monthBlock: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  monthBlockDivider: {
    borderBottomColor: Theme.colors.divider,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  monthTitle: {
    color: Theme.colors.accentStrong,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    marginBottom: 14,
  },
  weekHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekHeaderText: {
    color: Theme.colors.textMuted,
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 10,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    borderRadius: 20,
    height: 42,
    justifyContent: "center",
    width: `${100 / 7}%`,
  },
  dayCellActive: {
    backgroundColor: Theme.colors.accentStrong,
  },
  dayText: {
    color: Theme.colors.accentStrong,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  dayTextActive: {
    color: "#FFFFFF",
  },
  dotsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    height: 7,
    marginTop: 3,
  },
  dot: {
    backgroundColor: Theme.colors.accentStrong,
    borderRadius: 99,
    height: 4,
    width: 4,
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
  },
});
