import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../constants/Theme";

const TAB_ICONS = {
  Home: { active: "home", inactive: "home-outline" },
  NoDate: { active: "paper-plane", inactive: "paper-plane-outline" },
  Calendar: { active: "calendar", inactive: "calendar-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

export default function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomOffset = useMemo(() => Math.max(insets.bottom, 12) + 8, [insets.bottom]);

  return (
    <View style={[styles.shell, { paddingBottom: bottomOffset }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconSet = TAB_ICONS[route.name] ?? TAB_ICONS.Home;
          const routeOptions = descriptors[route.key]?.options ?? {};

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
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
              style={styles.tabButton}
            >
              <Ionicons
                color={isFocused ? Theme.colors.accentStrong : Theme.colors.iconInactive}
                name={isFocused ? iconSet.active : iconSet.inactive}
                size={22}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: "center",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  tabBar: {
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceRaised,
    borderRadius: 30,
    flexDirection: "row",
    height: 82,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    width: "88%",
    ...Theme.shadow.tabBar,
  },
  tabButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});
