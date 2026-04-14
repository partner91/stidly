import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodosListingScreen from "./features/todos/screens/TodosListingScreen";
import UndatedTodosScreen from "./features/todos/screens/UndatedTodosScreen";
import CalendarOverviewScreen from "./features/calendar/screens/CalendarOverviewScreen";
import ProfileScreen from "./features/profile/screens/ProfileScreen";
import AboutScreen from "./features/profile/screens/AboutScreen";
import PrivacyScreen from "./features/profile/screens/PrivacyScreen";
import ContactUsScreen from "./features/profile/screens/ContactUsScreen";
import UsernameScreen from "./features/profile/screens/UsernameScreen";
import EmailScreen from "./features/profile/screens/EmailScreen";
import FloatingTabBar from "./features/shared/components/FloatingTabBar";
import { Theme } from "./features/shared/constants/Theme";

import { useFonts } from "expo-font";

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

import {
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="Username" component={UsernameScreen} />
      <ProfileStack.Screen name="Email" component={EmailScreen} />
      <ProfileStack.Screen name="About" component={AboutScreen} />
      <ProfileStack.Screen name="Privacy" component={PrivacyScreen} />
      <ProfileStack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{ title: "Contact Us" }}
      />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
        sceneStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <Tab.Screen name="Home" component={TodosListingScreen} options={{ title: "Week" }} />
      <Tab.Screen
        name="NoDate"
        component={UndatedTodosScreen}
        options={{ title: "Parking Lot" }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarOverviewScreen}
        options={{ href: null, tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ href: null, tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
