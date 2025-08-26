import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

interface HeaderProps {
  title: string
  showBackButton?: boolean
  rightIcon?: string
  onRightIconPress?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true, rightIcon, onRightIconPress }) => {
  const navigation = useNavigation()

  return (
    <View style={{
      height: 60,
      backgroundColor: "#3F51B5",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2
    }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showBackButton && (
          <TouchableOpacity style={{ marginRight: 16 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>{title}</Text>
      </View>

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Ionicons name={rightIcon as any} size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Header
