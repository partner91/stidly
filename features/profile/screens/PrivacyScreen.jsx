import { StyleSheet, Text, View } from "react-native";
import SettingsScreenLayout from "../components/SettingsScreenLayout";
import { Theme } from "../../shared/constants/Theme";

export default function PrivacyScreen({ navigation }) {
  return (
    <SettingsScreenLayout navigation={navigation} title="Privacy Policy">
      <View style={styles.container}>
        <Text style={styles.title}>Your tasks stay on device for this demo.</Text>
        <Text style={styles.note}>
          There is no remote sync or analytics pipeline wired into this prototype, so your data is
          stored locally in memory while the app is running.
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
