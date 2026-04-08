
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Directions, FlingGestureHandler, State } from "react-native-gesture-handler";
import { Colors } from "../../shared/constants/Colors";
import MainHeadingText from "../../shared/components/MainHeadingText";
import Header from "../../shared/components/Header";
import NavigationButton from "../../shared/components/NavigationButton";
import Main from "../../shared/components/Main";
import { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import { Theme } from "../../shared/constants/Theme";

function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getMonthYearWeek(date = new Date()) {
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((temp - yearStart) / 86400000 + 1) / 7);

  return `${month} ${year}, W${week}`;
}


export default function TodosListingScreen({ route }) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  useEffect(() => {
    const dateKey = route?.params?.selectedDateKey;
    const jumpToken = route?.params?.jumpToken;
    if (!dateKey || !jumpToken) return;
    const [year, month, day] = String(dateKey).split("-").map(Number);
    if (!year || !month || !day) return;
    setSelectedWeek(new Date(year, month - 1, day));
  }, [route?.params?.jumpToken, route?.params?.selectedDateKey]);
  const isCurrentWeek =
    startOfWeekMonday(selectedWeek).getTime() === startOfWeekMonday(new Date()).getTime();

  const goPreviousWeek = () => {
    setSelectedWeek(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goNextWeek = () => {
    setSelectedWeek(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goCurrentWeek = () => {
    setSelectedWeek(new Date());
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Header
          header={
            <View style={styles.headingRow}>
              <NavigationButton direction="today" onPress={goCurrentWeek} active={isCurrentWeek} />
              <MainHeadingText>{getMonthYearWeek(selectedWeek)}</MainHeadingText>
            </View>
          }
          navigationButtons={
            <>
              <NavigationButton direction="back" onPress={goPreviousWeek} />
              <NavigationButton direction="forward" onPress={goNextWeek} />
            </>
          }
        />
        <Main>
          <FlingGestureHandler
            direction={Directions.LEFT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) goNextWeek();
            }}
          >
            <FlingGestureHandler
              direction={Directions.RIGHT}
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.END) goPreviousWeek();
              }}
            >
              <View style={styles.listGestureArea}>
                <TodoList selectedWeek={selectedWeek} />
              </View>
            </FlingGestureHandler>
          </FlingGestureHandler>
        </Main>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.appBgColor,
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
  listGestureArea: {
    backgroundColor: Theme.colors.surface,
    flex: 1,
  },
});
