import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Camera, CameraView } from "expo-camera"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [flashMode, setFlashMode] = useState<'off' | 'torch'>('off')
  useEffect(() => {
    ; (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true)
    try {
      const qrData = JSON.parse(data)

      const motorcycleData = {
        id: qrData.id || "MOTO123",
        model: qrData.model || "Honda CG 160",
        plate: qrData.plate || "ABC1234",
        sector: qrData.sector || "B",
        position: qrData.position || "15",
      }

      Alert.alert("Moto Identificada", `Modelo: ${motorcycleData.model}\nPlaca: ${motorcycleData.plate}`, [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setScanned(false),
        },
        {
          text: "Confirmar",
          onPress: async () => {
            const sectorData = {
              id: motorcycleData.sector,
              name: `Setor ${motorcycleData.sector}`,
              position: motorcycleData.position,
            }
            await AsyncStorage.setItem("lastParkedSector", JSON.stringify(sectorData))
            const newMovement = {
              id: Date.now().toString(),
              type: "entry",
              sector: motorcycleData.sector,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              date: "Hoje",
            }
            const historyData = await AsyncStorage.getItem("parkingHistory")
            let history = historyData ? JSON.parse(historyData) : []
            history = [newMovement, ...history]
            await AsyncStorage.setItem("parkingHistory", JSON.stringify(history))

            router.push("/home")
          },
        },
      ])
    } catch (error) {
      Alert.alert("Placa Lida", `Conteúdo: ${data}`, [
        {
          text: "OK",
          onPress: () => setScanned(false),
        },
      ])
    }
  }


  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'torch' : 'off')
  }

  const handleCancel = () => {
    router.back()
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Sem acesso à câmera. Por favor, conceda permissão nas configurações.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === "granted")
          }}
        >
          <Text style={styles.buttonText}>Solicitar Permissão Novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        ratio="16:9"
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout
          if (width > height) {
            setFlashMode('off')
          } else {
            setFlashMode('torch')
          }
        }
        }
        style={styles.scanner}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.cornerMarker, styles.cornerTopLeft]} />
            <View style={[styles.cornerMarker, styles.cornerTopRight]} />
            <View style={[styles.cornerMarker, styles.cornerBottomLeft]} />
            <View style={[styles.cornerMarker, styles.cornerBottomRight]} />
          </View>
          <Text style={styles.instructionsText}>
            Posicione a Placa ou o Chassi da Moto no centro da tela
          </Text>
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Ionicons
                name={flashMode === 'off' ? "flash-off" : "flash"}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>
                {flashMode === 'off' ? "Ligar Flash" : "Desligar Flash"}
              </Text>
            </TouchableOpacity>
          </View>
          {scanned && (
            <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
              <Text style={styles.buttonText}>Escanear Novamente</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <MaterialIcons name="close" size={24} color="white" />
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
  },
  cornerMarker: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "white",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructionsText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: "center",
    padding: 10,
  },
  controlText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4A80F0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: 250,
  },
  cancelButton: {
    backgroundColor: "#FF4757",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
})
