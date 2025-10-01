import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FirebaseAuthService, AuthUser } from "../services/firebaseAuth"

type User = {
  id: string
  name: string
  email: string
  role: "operator" | "admin"
}

type UserContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
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
    const loadUserPreferences = async () => {
      try {
        const prefs = await AsyncStorage.getItem("@user_preferences")
        if (prefs) {
          const parsed = JSON.parse(prefs)
          if (typeof parsed.darkMode === "boolean") setDarkModeState(parsed.darkMode)
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error)
      }
    }

    // Configurar observer do Firebase Auth
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((authUser: AuthUser | null) => {
      setUser(authUser)
      setIsLoading(false)
    })

    loadUserPreferences()

    // Cleanup
    return () => unsubscribe()
  }, [])

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
    AsyncStorage.getItem("@user_preferences").then((prefs) => {
      let parsed = prefs ? JSON.parse(prefs) : {}
      parsed.darkMode = value
      AsyncStorage.setItem("@user_preferences", JSON.stringify(parsed))
    })
  }

  const login = async (email: string, password: string) => {
    try {
      const authUser = await FirebaseAuthService.login(email, password)
      // O observer já atualizará o estado do usuário
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const authUser = await FirebaseAuthService.register(email, password, name)
      // O observer já atualizará o estado do usuário
    } catch (error) {
      console.error("Erro ao registrar:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await FirebaseAuthService.logout()
      // O observer já atualizará o estado do usuário para null
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      throw error
    }
  }

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isLoading, 
        darkMode, 
        setDarkMode 
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
