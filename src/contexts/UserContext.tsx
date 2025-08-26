import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type User = {
  id: string
  name: string
  email: string
  role: "operator" | "admin"
}

type UserContextType = {
  user: User | null
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  darkMode: true,
  setDarkMode: () => {},
})

export const useUser = () => useContext(UserContext)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkModeState] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user_data")
        if (userData) {
          setUser(JSON.parse(userData))
        }
        const prefs = await AsyncStorage.getItem("@user_preferences")
        if (prefs) {
          const parsed = JSON.parse(prefs)
          if (typeof parsed.darkMode === "boolean") setDarkModeState(parsed.darkMode)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário ou preferências:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [])

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
    AsyncStorage.getItem("@user_preferences").then((prefs) => {
      let parsed = prefs ? JSON.parse(prefs) : {}
      parsed.darkMode = value
      AsyncStorage.setItem("@user_preferences", JSON.stringify(parsed))
    })
  }

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem("@user_data", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user_data")
      setUser(null)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      throw error
    }
  }

  return <UserContext.Provider value={{ user, login, logout, isLoading, darkMode, setDarkMode }}>{children}</UserContext.Provider>
}
