
import { StyleSheet, View } from "react-native";
import { Theme } from "../constants/Theme";

export default function Header({ header, navigationButtons }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerText}>{header}</View>
      {navigationButtons ? <View style={styles.navigationButtons}>{navigationButtons}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Theme.spacing.screen,
    paddingTop: 8,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
    marginRight: 18,
  },
});
