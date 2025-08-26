import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Bell, ChevronRight, Fingerprint, Globe, HelpCircle, LogOut } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import BottomTabBar from "../components/BottomTabBar"
import { useUser } from "../contexts/UserContext"

type UserPreferences = {
  notifications: boolean
  darkMode: boolean
  biometricLogin: boolean
  language: "pt-BR"
}

const ProfileScreen = () => {
  const { user, logout, darkMode, setDarkMode } = useUser()

  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: true,
    darkMode: darkMode,
    biometricLogin: false,
    language: "pt-BR",
  })

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPrefs = await AsyncStorage.getItem("@user_preferences")
        if (storedPrefs) {
          setPreferences((prev) => ({ ...prev, ...JSON.parse(storedPrefs) }))
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error)
      }
    }
    loadPreferences()
  }, [])

  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem("@user_preferences", JSON.stringify(preferences))
      } catch (error) {
        console.error("Erro ao salvar preferências:", error)
      }
    }
    savePreferences()
  }, [preferences])

  useEffect(() => {
    setPreferences((prev) => ({ ...prev, darkMode }))
  }, [darkMode])

  const handleTogglePreference = (key: keyof UserPreferences) => {
    if (key === "darkMode") {
      setDarkMode(!darkMode)
    } else if (typeof preferences[key] === "boolean") {
      setPreferences({
        ...preferences,
        [key]: !preferences[key],
      })
    }
  }

  const handleChangeLanguage = (language: UserPreferences["language"]) => {
    setPreferences({
      ...preferences,
      language,
    })

    Alert.alert(
      "Idioma Alterado",
      `O idioma foi alterado para ${language === "pt-BR" ? "Português" : language === "en-US" ? "Inglês" : "Espanhol"}`,
      [{ text: "OK" }],
    )
  }

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await logout()
          router.replace("/login")
        },
      },
    ])
  }

  if (!user) {
    return null
  }

  return (
  <View style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#F5F5F5" }] }>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
  <View style={[styles.header, { backgroundColor: darkMode ? "#1A1A1A" : "#EEEEEE" }] }>
  <Text style={[styles.headerTitle, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Perfil</Text>
      </View>

  <ScrollView style={[styles.scrollView, { backgroundColor: darkMode ? "#121212" : "#F5F5F5" }] }>
  <View style={[styles.profileCard, { backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF", borderColor: darkMode ? "#333333" : "#DDDDDD" }] }>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.avatar} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: darkMode ? "#FFFFFF" : "#222222" }]}>{user?.name}</Text>
            <Text style={[styles.profileRole, { color: darkMode ? "#5fc330" : "#009688" }]}>{user?.role === "admin" ? "Administrador" : "Operador"}</Text>
            <Text style={[styles.profileEmail, { color: darkMode ? "#AAAAAA" : "#666666" }]}>{user?.email}</Text>
          </View>
        </View>
  <View style={[styles.sectionCard, { backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF", borderColor: darkMode ? "#333333" : "#DDDDDD" }] }>
          <Text style={[styles.sectionTitle, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Preferências</Text>

          <View style={[styles.preferenceItem, { borderBottomColor: darkMode ? "#333333" : "#DDDDDD" }] }>
            <View style={styles.preferenceLeft}>
              <Bell size={22} color="#DDDDDD" style={styles.preferenceIcon} />
              <Text style={[styles.preferenceText, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Notificações</Text>
            </View>
            <Switch
              value={preferences.notifications}
              onValueChange={() => handleTogglePreference("notifications")}
              trackColor={{ false: "#333333", true: "#5fc330" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#333333"
            />
          </View>
          <View style={[styles.preferenceItem, { borderBottomColor: darkMode ? "#333333" : "#DDDDDD" }] }>
            <View style={styles.preferenceLeft}>
              <Text style={[styles.preferenceText, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Tema Escuro</Text>
            </View>
            <Switch
              value={preferences.darkMode}
              onValueChange={() => handleTogglePreference("darkMode")}
              trackColor={{ false: "#333333", true: "#5fc330" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#333333"
            />
          </View>

          <View style={[styles.preferenceItem, { borderBottomColor: darkMode ? "#333333" : "#DDDDDD" }] }>
            <View style={styles.preferenceLeft}>
              <Globe size={22} color="#DDDDDD" style={styles.preferenceIcon} />
              <Text style={[styles.preferenceText, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Idioma</Text>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[styles.languageButton, preferences.language === "pt-BR" ? styles.languageButtonActive : null]}
                onPress={() => handleChangeLanguage("pt-BR")}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    preferences.language === "pt-BR" ? styles.languageButtonTextActive : null,
                  ]}
                >
                  PT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

  <View style={[styles.sectionCard, { backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF", borderColor: darkMode ? "#333333" : "#DDDDDD" }] }>
          <Text style={[styles.sectionTitle, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Conta</Text>

          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: darkMode ? "#333333" : "#DDDDDD" }]} onPress={() => router.push("")}> 
            <View style={styles.accountItemLeft}>
              <HelpCircle size={22} color="#DDDDDD" style={styles.accountIcon} />
              <Text style={[styles.accountText, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Ajuda e Suporte</Text>
            </View>
            <ChevronRight size={20} color="#777777" />
          </TouchableOpacity>

        </View>

  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={darkMode ? ["#FF5252", "#D32F2F"] : ["#FF8A65", "#FF5252"]}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <LogOut size={20} color={darkMode ? "#FFFFFF" : "#222222"} style={styles.logoutIcon} />
            <Text style={[styles.logoutText, { color: darkMode ? "#FFFFFF" : "#222222" }]}>Sair</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar activeScreen="Profile" />
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
    justifyContent: "center",
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "#5fc330",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  sectionCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceIcon: {
    marginRight: 12,
  },
  preferenceText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  languageButtons: {
    flexDirection: "row",
  },
  languageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  languageButtonActive: {
    backgroundColor: "#5fc330",
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  languageButtonTextActive: {
    color: "#121212",
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  accountItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountIcon: {
    marginRight: 12,
  },
  accountText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  logoutButton: {
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 16,
  },
  logoutGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ProfileScreen
