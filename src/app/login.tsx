import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Check, Lock, Mail, UserPlus } from "lucide-react-native"
import { useEffect, useState } from "react"
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Input from "../components/Input"
import { useUser } from "../contexts/UserContext"

const LoginScreen = () => {
  const { login, register, darkMode } = useUser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerErrors, setRegisterErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("@saved_email")
        const savedRememberMe = await AsyncStorage.getItem("@remember_me")

        if (savedEmail && savedRememberMe === "true") {
          setEmail(savedEmail)
          setRememberMe(true)
        }
      } catch (error) {
        console.error("Erro ao carregar credenciais:", error)
      }
    }

    loadSavedCredentials()
  }, [])

  const validateLogin = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido"
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!name) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!email) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido"
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setRegisterErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateLogin()) return

    setIsLoading(true)

    try {
      await login(email, password)
      
      // Salvar credenciais se "Lembrar de mim" estiver marcado
      if (rememberMe) {
        await AsyncStorage.setItem("@saved_email", email)
        await AsyncStorage.setItem("@remember_me", "true")
      } else {
        await AsyncStorage.removeItem("@saved_email")
        await AsyncStorage.removeItem("@remember_me")
      }

      router.replace("/")
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!validateRegister()) return

    setIsLoading(true)

    try {
      await register(email, password, name)
      
      Alert.alert("Sucesso", "Cadastro realizado com sucesso! Você já está logado.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/")
          },
        },
      ])
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao realizar cadastro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe)
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setErrors({})
    setRegisterErrors({})
  }

  const renderLoginForm = () => (
    <>
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#DDDDDD",
            marginBottom: 8,
          }}
        >
          E-mail
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: errors.email ? "#FF5252" : "#333333",
          }}
        >
          <Mail size={20} color="#AAAAAA" />
          <Input
            placeholder="Seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              backgroundColor: "transparent",
              borderWidth: 0,
              height: 50,
              padding: 0,
              marginLeft: 10,
            }}
          />
        </View>
        {errors.email && <Text style={{ color: "#FF5252", fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#DDDDDD",
            marginBottom: 8,
          }}
        >
          Senha
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: errors.password ? "#FF5252" : "#333333",
          }}
        >
          <Lock size={20} color="#AAAAAA" />
          <Input
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              backgroundColor: "transparent",
              borderWidth: 0,
              height: 50,
              padding: 0,
              marginLeft: 10,
            }}
          />
        </View>
        {errors.password && <Text style={{ color: "#FF5252", fontSize: 12, marginTop: 4 }}>{errors.password}</Text>}
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
        }}
        onPress={toggleRememberMe}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: "#5fc330",
            marginRight: 10,
            backgroundColor: rememberMe ? "#5fc330" : "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {rememberMe && <Check size={16} color="#121212" />}
        </View>
        <Text style={{ color: "#DDDDDD", fontSize: 14 }}>Lembrar-me</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 50,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 16,
        }}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <LinearGradient
          colors={["#5fc330", "#5fc330"]}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text
            style={{
              color: "#121212",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  )

  const renderRegisterForm = () => (
    <>
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#DDDDDD",
            marginBottom: 8,
          }}
        >
          Nome
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: registerErrors.name ? "#FF5252" : "#333333",
          }}
        >
          <UserPlus size={20} color="#AAAAAA" />
          <Input
            placeholder="Seu nome completo"
            value={name}
            onChangeText={setName}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              backgroundColor: "transparent",
              borderWidth: 0,
              height: 50,
              padding: 0,
              marginLeft: 10,
            }}
          />
        </View>
        {registerErrors.name && (
          <Text style={{ color: "#FF5252", fontSize: 12, marginTop: 4 }}>{registerErrors.name}</Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#DDDDDD",
            marginBottom: 8,
          }}
        >
          E-mail
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: registerErrors.email ? "#FF5252" : "#333333",
          }}
        >
          <Mail size={20} color="#AAAAAA" />
          <Input
            placeholder="Seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              backgroundColor: "transparent",
              borderWidth: 0,
              height: 50,
              padding: 0,
              marginLeft: 10,
            }}
          />
        </View>
        {registerErrors.email && (
          <Text style={{ color: "#FF5252", fontSize: 12, marginTop: 4 }}>{registerErrors.email}</Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#DDDDDD",
            marginBottom: 8,
          }}
        >
          Senha
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: registerErrors.password ? "#FF5252" : "#333333",
          }}
        >
          <Lock size={20} color="#AAAAAA" />
          <Input
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              backgroundColor: "transparent",
              borderWidth: 0,
              height: 50,
              padding: 0,
              marginLeft: 10,
            }}
          />
        </View>
        {registerErrors.password && (
          <Text style={{ color: "#FF5252", fontSize: 12, marginTop: 4 }}>{registerErrors.password}</Text>
        )}
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#DDDDDD",
            marginBottom: 8,
          }}
        >
          Confirmar Senha
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: registerErrors.confirmPassword ? "#FF5252" : "#333333",
          }}
        >
          <Lock size={20} color="#AAAAAA" />
          <Input
            placeholder="Confirme sua senha"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              backgroundColor: "transparent",
              borderWidth: 0,
              height: 50,
              padding: 0,
              marginLeft: 10,
            }}
          />
        </View>
        {registerErrors.confirmPassword && (
          <Text style={{ color: "#FF5252", fontSize: 12, marginTop: 4 }}>{registerErrors.confirmPassword}</Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          height: 50,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 16,
        }}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <LinearGradient
          colors={["#5fc330", "#5fc330"]}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text
            style={{
              color: "#121212",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {isLoading ? "Carregando..." : "Cadastrar"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  )

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#F5F5F5" }}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={darkMode ? "#121212" : "#F5F5F5"} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ alignItems: "center", marginTop: 60, marginBottom: 40 }}>
            <View>
              <Image
                source={require("../../assets/Patio_vision-removebg-preview.png")}
                style={{ width: 120, height: 120, borderRadius: 35 }}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: darkMode ? "#AAAAAA" : "#666666",
                textAlign: "center",
              }}
            >
              Monitoramento e Gestão de Patios
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 30,
              paddingHorizontal: 24,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor: isLoginMode ? "#5fc330" : "transparent",
              }}
              onPress={() => setIsLoginMode(true)}
            >
              <Text
                style={{
                  color: isLoginMode ? (darkMode ? "#FFFFFF" : "#222222") : "#777777",
                  fontSize: 16,
                  fontWeight: isLoginMode ? "600" : "400",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor: !isLoginMode ? "#5fc330" : "transparent",
              }}
              onPress={() => setIsLoginMode(false)}
            >
              <Text
                style={{
                  color: !isLoginMode ? (darkMode ? "#FFFFFF" : "#222222") : "#777777",
                  fontSize: 16,
                  fontWeight: !isLoginMode ? "600" : "400",
                }}
              >
                Cadastro
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 24, width: "100%" }}>
            {isLoginMode ? renderLoginForm() : renderRegisterForm()}
          </View>

          <View
            style={{
              paddingHorizontal: 24,
              marginTop: 20,
              marginBottom: 40,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={toggleMode}>
              <Text style={{ color: "#5fc330", fontSize: 14 }}>
                {isLoginMode ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen
