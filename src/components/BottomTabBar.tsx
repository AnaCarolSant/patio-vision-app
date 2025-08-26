import type React from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

interface TabBarProps {
  activeScreen: string
}

const BottomTabBar: React.FC<TabBarProps> = ({ activeScreen }) => {
  const tabs = [
    { name: "Home", icon: "home", screen: "Home", route: "/" },
    { name: "Escanear", icon: "scan", screen: "Scan", route: "/scan" },
    { name: "Mapa", icon: "map", screen: "SectorMap", route: "/map" },
    { name: "Histórico", icon: "time", screen: "History", route: "/history" },
    { name: "Perfil", icon: "person", screen: "Profile", route: "/profile" },
  ]

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => router.push(tab.route)}>
          <Ionicons name={tab.icon as any} size={24} color={activeScreen === tab.screen ? "#00E676" : "#777777"} />
          <Text style={[styles.tabText, { color: activeScreen === tab.screen ? "#00E676" : "#777777" }]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
})

export default BottomTabBar
