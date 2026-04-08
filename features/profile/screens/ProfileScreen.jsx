import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreenLayout from "../components/SettingsScreenLayout";
import { Theme } from "../../shared/constants/Theme";

const GROUPS = [
  {
    key: "user",
    title: "User",
    items: [
      { key: "username", label: "Name", value: "Sara", icon: "person-circle-outline", screen: "Username" },
      { key: "email", label: "Email", value: "sara@gmail.com", icon: "mail-outline", screen: "Email" },
    ],
  },
  {
    key: "preferences",
    title: "App Preferences",
    items: [
      { key: "weekStart", label: "Week Start", value: "Monday", icon: "calendar-clear-outline" },
      { key: "notifications", label: "Notifications", value: "All", icon: "notifications-outline" },
    ],
  },
  {
    key: "support",
    title: "Support",
    items: [
      { key: "about", label: "About", icon: "information-circle-outline", screen: "About" },
      { key: "privacy", label: "Privacy Policy", icon: "shield-checkmark-outline", screen: "Privacy" },
      { key: "help", label: "Help", icon: "help-buoy-outline", action: () => Alert.alert("Help", "Support is coming soon.") },
      { key: "contact", label: "Contact Us", icon: "chatbox-ellipses-outline", screen: "ContactUs" },
      { key: "logout", label: "Log Out", icon: "log-out-outline", action: () => Alert.alert("Logged out") },
    ],
  },
];

function SettingsRow({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.iconBadge}>
          <Ionicons color={Theme.colors.accentStrong} name={item.icon} size={14} />
        </View>
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <View style={styles.rowRight}>
        {item.value ? <Text style={styles.value}>{item.value}</Text> : null}
        <Ionicons color={Theme.colors.textSubtle} name="chevron-forward" size={14} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SettingsScreenLayout navigation={navigation} showBack={false} title="Settings">
      <ScrollView contentContainerStyle={styles.content}>
        {GROUPS.map((group) => (
          <View key={group.key} style={styles.group}>
            <Text style={styles.groupLabel}>{group.title}</Text>
            <View style={styles.groupRows}>
              {group.items.map((item) => {
                const resolvedItem =
                  item.key === "notifications"
                    ? { ...item, value: notificationsEnabled ? "All" : "Off" }
                    : item;

                const onPress = () => {
                  if (item.key === "notifications") {
                    setNotificationsEnabled((current) => !current);
                    return;
                  }
                  if (item.screen) {
                    navigation.navigate(item.screen);
                    return;
                  }
                  item.action?.();
                };

                return <SettingsRow key={item.key} item={resolvedItem} onPress={onPress} />;
              })}
            </View>
          </View>
        ))}

        <Pressable onPress={() => Alert.alert("Deleted account")} style={styles.deleteAction}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 164,
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  group: {
    marginBottom: 20,
  },
  groupLabel: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    marginBottom: 10,
  },
  groupRows: {
    borderRadius: 20,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceRaised,
    borderBottomColor: Theme.colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  rowRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  iconBadge: {
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceSoft,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  label: {
    color: Theme.colors.accentStrong,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  value: {
    color: Theme.colors.textSubtle,
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
  },
  deleteAction: {
    alignItems: "center",
    paddingTop: 2,
  },
  deleteText: {
    color: Theme.colors.fab,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
  },
});
