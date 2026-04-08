
import { StyleSheet, Text } from "react-native";
import { Theme } from "../constants/Theme";

export default function MainHeadingText({ children }) {
  return <Text style={styles.heading}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    color: Theme.colors.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    letterSpacing: 0,
  },
});
