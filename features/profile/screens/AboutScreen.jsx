import { StyleSheet, Text, View } from "react-native";
import SettingsScreenLayout from "../components/SettingsScreenLayout";
import { Theme } from "../../shared/constants/Theme";

export default function AboutScreen({ navigation }) {
  return (
    <SettingsScreenLayout navigation={navigation} title="About">
      <View style={styles.container}>
        <Text style={styles.title}>Tidly keeps weekly planning simple.</Text>
        <Text style={styles.note}>
          This build mirrors the task, calendar, and settings flows from the provided Figma while
          keeping the app's existing todo behavior intact.
        </Text>
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    color: Theme.colors.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  note: {
    color: Theme.colors.textMuted,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
  },
});
