import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../constants/Theme";

const TAB_ICONS = {
  Home: { active: "calendar", inactive: "calendar-clear-outline" },
  NoDate: { active: "file-tray", inactive: "file-tray-outline" },
  Calendar: { active: "calendar", inactive: "calendar-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

export default function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomInset = useMemo(() => Math.max(insets.bottom, 10), [insets.bottom]);

  return (
    <View style={[styles.shell, { paddingBottom: bottomInset }]}>
      <View style={styles.tabBar}>
        {state.routes
          .filter((route) => route.name === "Home" || route.name === "NoDate")
          .map((route) => {
          const isFocused = state.routes[state.index]?.key === route.key;
          const iconSet = TAB_ICONS[route.name] ?? TAB_ICONS.Home;
          const routeOptions = descriptors[route.key]?.options ?? {};

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) return;

            if (route.name === "Home") {
              const params = isFocused
                ? { resetToCurrentWeekToken: Date.now() }
                : { focusScrollToken: Date.now() };
              navigation.navigate(route.name, params);
              return;
            }

            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityLabel={routeOptions.tabBarAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onLongPress={onLongPress}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            >
              <View style={styles.tabButtonInner}>
                <Ionicons
                  color={isFocused ? Theme.colors.text : Theme.colors.textMuted}
                  name={isFocused ? iconSet.active : iconSet.inactive}
                  size={18}
                />
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {routeOptions.title ?? route.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  tabBar: {
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderTopColor: Theme.colors.divider,
    borderTopWidth: 1,
    flexDirection: "row",
    height: 62,
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    height: 44,
    justifyContent: "center",
    marginHorizontal: 6,
  },
  tabButtonActive: {
    backgroundColor: Theme.colors.accentSoft,
    borderColor: "#F1DEAC",
    borderWidth: 1,
  },
  tabButtonInner: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  tabLabel: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
  },
  tabLabelActive: {
    color: Theme.colors.text,
  },
});
