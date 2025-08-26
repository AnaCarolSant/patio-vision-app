import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { LogOut, QrCode } from "lucide-react-native"
import { useEffect, useState } from "react"
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import BottomTabBar from "../components/BottomTabBar"
import { useUser } from "../contexts/UserContext"


const mockData = {
  totalMotorcycles: 156,
  availableSpaces: 44,
  sectors: [
    { id: "A", name: "Setor A", total: 50, occupied: 42 },
    { id: "B", name: "Setor B", total: 50, occupied: 35 },
    { id: "C", name: "Setor C", total: 50, occupied: 29 },
    { id: "D", name: "Setor D", total: 50, occupied: 50 },
  ],
  recentActivity: [
    { id: "1", type: "entry", motorcycle: "Honda CG 160", time: "10:45", operator: "João" },
    { id: "2", type: "exit", motorcycle: "Yamaha Fazer", time: "10:30", operator: "Maria" },
    { id: "3", type: "entry", motorcycle: "Honda Biz", time: "10:15", operator: "Carlos" },
  ],
}

const HomeScreen = () => {
  const { user, logout } = useUser()
  const [stats, setStats] = useState(mockData)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/login")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      const newStats = { ...stats }
      const randomSector = Math.floor(Math.random() * stats.sectors.length)
      const change = Math.random() > 0.5 ? 1 : -1

      if (
        newStats.sectors[randomSector].occupied + change >= 0 &&
        newStats.sectors[randomSector].occupied + change <= newStats.sectors[randomSector].total
      ) {
        newStats.sectors[randomSector].occupied += change
        newStats.totalMotorcycles += change
        newStats.availableSpaces -= change
      }

      setStats(newStats)
    }, 30000)

    return () => clearInterval(interval)
  }, [stats])

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Olá, {user?.name}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalMotorcycles}</Text>
            <Text style={styles.statLabel}>Motos no pátio</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.availableSpaces}</Text>
            <Text style={styles.statLabel}>Vagas disponíveis</Text>
          </View>
        </View>

        <View style={styles.sectorSection}>
          <Text style={styles.sectionTitle}>Ocupação por Setor</Text>
          {stats.sectors.map((sector) => (
            <View key={sector.id} style={styles.sectorCard}>
              <View style={styles.sectorHeader}>
                <Text style={styles.sectorName}>{sector.name}</Text>
                <Text style={styles.sectorCount}>
                  {sector.occupied}/{sector.total}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${(sector.occupied / sector.total) * 100}%` },
                    sector.occupied === sector.total ? styles.progressBarFull : {},
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={() => router.push("/scan")}>
          <LinearGradient
            colors={["#5fc330", "#5fc330"]}
            style={styles.scanButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <QrCode size={20} color="#121212" style={styles.scanIcon} />
            <Text style={styles.scanButtonText}>Escanear Placa ou Chassi</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Atividades Recentes</Text>
          {stats.recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View
                style={[
                  styles.activityIndicator,
                  activity.type === "entry" ? styles.entryIndicator : styles.exitIndicator,
                ]}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.motorcycle}</Text>
                <Text style={styles.activityDetails}>
                  {activity.type === "entry" ? "Entrada" : "Saída"} • {activity.time} • {activity.operator}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomTabBar activeScreen="Home" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    borderWidth: 1,
    borderColor: "#333333",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5fc330",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#DDDDDD",
  },
  sectorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  sectorCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  sectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  sectorCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#DDDDDD",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#333333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5fc330",
    borderRadius: 4,
  },
  progressBarFull: {
    backgroundColor: "#FF5252",
  },
  scanButton: {
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  scanButtonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "600",
  },
  recentActivitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  activityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  entryIndicator: {
    backgroundColor: "#5fc330",
  },
  exitIndicator: {
    backgroundColor: "#FF5252",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
    overflow: "hidden",
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default HomeScreen
