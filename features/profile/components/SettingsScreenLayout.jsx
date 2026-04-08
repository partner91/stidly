import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../shared/components/Header";
import Main from "../../shared/components/Main";
import MainHeadingText from "../../shared/components/MainHeadingText";
import NavigationButton from "../../shared/components/NavigationButton";
import { Theme } from "../../shared/constants/Theme";

export default function SettingsScreenLayout({
  children,
  navigation,
  showBack = true,
  title,
}) {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Header
          header={
            <View style={styles.headingRow}>
              {showBack ? (
                <NavigationButton direction="back" onPress={() => navigation.goBack()} />
              ) : null}
              <MainHeadingText>{title}</MainHeadingText>
            </View>
          }
        />
        <Main>{children}</Main>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: Theme.colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 6,
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});
