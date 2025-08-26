import type React from "react"
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { ColorValue } from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  variant?: "primary" | "secondary" | "outline"
}
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = "primary",
}) => {

  const getColors = (): readonly [ColorValue, ColorValue] => {
    switch (variant) {
      case "primary":
        return ["#00E676", "#00C853"]
      case "secondary":
        return ["#333333", "#1E1E1E"]
      case "outline":
        return ["transparent", "transparent"]
      default:
        return ["#00E676", "#00C853"]
    }
  }

  const getBorderColor = () => {
    return variant === "outline" ? "#00E676" : "transparent"
  }

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#121212"
      case "secondary":
        return "#FFFFFF"
      case "outline":
        return "#00E676"
      default:
        return "#121212"
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: getBorderColor() }, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient colors={getColors()} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        {loading ? (
          <ActivityIndicator size="small" color={variant === "outline" ? "#00E676" : "#121212"} />
        ) : (
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
})

export default Button
