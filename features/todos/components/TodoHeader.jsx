import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../../shared/constants/Theme";

export default function TodoHeader({
  title,
  completedCount = 0,
  totalCount = 0,
  dateLabel,
  isFirst = false,
}) {
  return (
    <View style={[styles.container, !isFirst && styles.withTopSpace]}>
      <View style={styles.left}>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.countChip}>
          <Text style={styles.countText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>
      <Text style={styles.dateText}>{dateLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderBottomColor: Theme.colors.dividerStrong,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    paddingBottom: 10,
    paddingTop: 20,
  },
  withTopSpace: {
    paddingTop: 26,
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  text: {
    color: Theme.colors.accentStrong,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  countChip: {
    backgroundColor: Theme.colors.accentSoft,
    borderRadius: Theme.radius.chip,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
  },
  dateText: {
    color: Theme.colors.textSubtle,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
});
