import { StyleSheet, Text, View } from "react-native";
import SettingsScreenLayout from "../components/SettingsScreenLayout";
import { Theme } from "../../shared/constants/Theme";

export default function ContactUsScreen({ navigation }) {
  return (
    <SettingsScreenLayout navigation={navigation} title="Contact Us">
      <View style={styles.container}>
        <Text style={styles.title}>Need help?</Text>
        <Text style={styles.note}>Reach us at sara@gmail.com and we'll get back to you soon.</Text>
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
