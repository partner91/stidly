import { StyleSheet, Text, View } from "react-native";
import SettingsScreenLayout from "../components/SettingsScreenLayout";
import { Theme } from "../../shared/constants/Theme";

export default function UsernameScreen({ navigation }) {
  return (
    <SettingsScreenLayout navigation={navigation} title="Name">
      <View style={styles.container}>
        <Text style={styles.title}>Sara</Text>
        <Text style={styles.note}>The profile name is read-only in this build.</Text>
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
