import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Theme } from "../../shared/constants/Theme";

export default function TodoHeader({
  title,
  completedCount = 0,
  totalCount = 0,
  dateLabel,
  isToday = false,
}) {
  const isWeekend = title === "Saturday" || title === "Sunday";

  return (
    <View style={[styles.container, styles.withTopSpace, isToday && styles.todayRow]}>
      <View style={[styles.left, isToday && styles.todayLeft]}>
        {isToday ? <Ionicons color={Theme.colors.accentStrong} name="sunny" size={16} /> : null}
        <Text style={[styles.text, isWeekend && styles.weekendText, isToday && styles.todayText]}>
          {`${dateLabel?.dayName} ${dateLabel?.dayNumber}`}
        </Text>
      </View>
      <View style={[styles.right, isToday && styles.todayRight]}>
        <Text style={[styles.countText, isToday && styles.todayCountText]}>
          {isToday ? `${completedCount}/${totalCount}` : String(totalCount)}
        </Text>
        {isToday ? null : (
          <Ionicons color={Theme.colors.textMuted} name="chevron-down" size={16} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderBottomColor: Theme.colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
    paddingBottom: 10,
    paddingTop: 18,
  },
  withTopSpace: {
    paddingTop: 22,
  },
  todayRow: {
    backgroundColor: Theme.colors.accentSoft,
    borderBottomWidth: 0,
    borderRadius: 18,
    marginTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  todayLeft: {
    flexShrink: 1,
  },
  text: {
    color: Theme.colors.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  weekendText: {
    color: Theme.colors.danger,
  },
  todayText: {
    color: Theme.colors.text,
  },
  countText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  todayCountText: {
    textAlign: "center",
  },
  right: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  todayRight: {
    backgroundColor: Theme.colors.surface,
    borderColor: "#F4D786",
    borderRadius: 999,
    borderWidth: 1,
    height: 26,
    justifyContent: "center",
    minWidth: 42,
    paddingHorizontal: 10,
  },
});
