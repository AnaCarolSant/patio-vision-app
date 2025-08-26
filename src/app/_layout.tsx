import AsyncStorage from "@react-native-async-storage/async-storage"
import { Stack } from "expo-router"
import { useEffect } from "react"
import { UserProvider } from "../contexts/UserContext"

export const unstable_settings = {
  initialRouteName: "login",
}

export default function App() {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user_data")
        console.log("Stored user data:", userData)
      } catch (error) {
        console.error("Error checking login status:", error)
      }
    }

    checkLoginStatus()
  }, [])

  return (
    <UserProvider>
      <Stack
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="history" />
        <Stack.Screen name="sector-map" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="register-motorcycle" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="motorcycle-details/[id]" />
      </Stack>
    </UserProvider>
  )
}
