import { StyleSheet, View } from "react-native";
import { Theme } from "../constants/Theme";


export default function Main({ children }) {
  return <View style={styles.container}>{children}</View>;
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.screen,
    flex: 1,
    marginBottom: 28,
    marginHorizontal: 18,
    marginTop: 18,
    overflow: "hidden",
  },
});
