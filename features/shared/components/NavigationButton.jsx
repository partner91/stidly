import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../constants/Theme";

export default function NavigationButton({ direction, onPress, active = false }) {
  const isToday = direction === "today";
  const arrowIcon = direction === "back" ? "chevron-back" : "chevron-forward";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      {isToday ? (
        <View style={[styles.container, styles.todayContainer, active && styles.todayContainerActive]}>
          <Ionicons
            color={active ? "#FFFFFF" : Theme.colors.accentStrong}
            name={active ? "calendar" : "calendar-outline"}
            size={14}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Ionicons color={Theme.colors.textSubtle} name={arrowIcon} size={16} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceRaised,
    borderColor: Theme.colors.divider,
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  todayContainer: {
    backgroundColor: Theme.colors.accentSoft,
    borderColor: "transparent",
    width: 30,
    height: 30,
    borderRadius: 12,
  },
  todayContainerActive: {
    backgroundColor: Theme.colors.accentStrong,
  },
});
