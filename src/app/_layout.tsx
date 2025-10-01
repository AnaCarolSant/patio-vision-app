import { Stack } from "expo-router"
import { UserProvider } from "../contexts/UserContext"

export const unstable_settings = {
  initialRouteName: "login",
}

export default function App() {
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
