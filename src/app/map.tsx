import { router, useLocalSearchParams } from "expo-router"
import { ChevronLeft, Info, ZoomIn, ZoomOut } from "lucide-react-native"
import { useEffect, useState } from "react"
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import BottomTabBar from "../components/BottomTabBar"

type MotorcyclePosition = {
  id: string
  position: string
  model: string
  plate?: string
  status: "occupied" | "available" | "reserved" | "maintenance"
}

type SectorData = {
  name: string
  rows: number
  cols: number
  positions: MotorcyclePosition[]
}

const mockSectors: Record<string, SectorData> = {
  A: {
    name: "Setor A",
    rows: 5,
    cols: 10,
    positions: Array(50)
      .fill(null)
      .map((_, index) => {
        const random = Math.random()
        let status: "occupied" | "available" | "reserved" | "maintenance"

        if (random > 0.7) status = "available"
        else if (random > 0.4) status = "occupied"
        else if (random > 0.2) status = "reserved"
        else status = "maintenance"

        return {
          id: `A${index + 1}`,
          position: `A${index + 1}`,
          model: status === "occupied" ? `Moto ${index + 1}` : "",
          plate: status === "occupied" ? `ABC-${(1000 + index)}` : undefined,
          status,
        }
      }),
  },
  B: {
    name: "Setor B",
    rows: 5,
    cols: 10,
    positions: Array(50)
      .fill(null)
      .map((_, index) => {
        const random = Math.random()
        let status: "occupied" | "available" | "reserved" | "maintenance"

        if (random > 0.6) status = "available"
        else if (random > 0.3) status = "occupied"
        else if (random > 0.1) status = "reserved"
        else status = "maintenance"

        return {
          id: `B${index + 1}`,
          position: `B${index + 1}`,
          model: status === "occupied" ? `Moto ${index + 1}` : "",
          plate: status === "occupied" ? `DEF-${(2000 + index)}` : undefined,
          status,
        }
      }),
  },
  C: {
    name: "Setor C",
    rows: 5,
    cols: 10,
    positions: Array(50)
      .fill(null)
      .map((_, index) => {
        const random = Math.random()
        let status: "occupied" | "available" | "reserved" | "maintenance"

        if (random > 0.5) status = "available"
        else if (random > 0.2) status = "occupied"
        else if (random > 0.1) status = "reserved"
        else status = "maintenance"

        return {
          id: `C${index + 1}`,
          position: `C${index + 1}`,
          model: status === "occupied" ? `Moto ${index + 1}` : "",
          plate: status === "occupied" ? `GHI-${(3000 + index)}` : undefined,
          status,
        }
      }),
  },
  D: {
    name: "Setor D",
    rows: 5,
    cols: 10,
    positions: Array(50)
      .fill(null)
      .map((_, index) => {
        const random = Math.random()
        let status: "occupied" | "available" | "reserved" | "maintenance"

        if (random > 0.2) status = "occupied"
        else if (random > 0.1) status = "available"
        else if (random > 0.05) status = "reserved"
        else status = "maintenance"

        return {
          id: `D${index + 1}`,
          position: `D${index + 1}`,
          model: status === "occupied" ? `Moto ${index + 1}` : "",
          plate: status === "occupied" ? `JKL-${(4000 + index)}` : undefined,
          status,
        }
      }),
  },
}

const SectorMapScreen = () => {
  const params = useLocalSearchParams()
  const { width } = useWindowDimensions()
  const sectorId = (params.sectorId as string) || "A"

  const [selectedSector, setSelectedSector] = useState(sectorId)
  const [sectorData, setSectorData] = useState(mockSectors[selectedSector])
  const [selectedPosition, setSelectedPosition] = useState<MotorcyclePosition | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    occupied: 0,
    available: 0,
    reserved: 0,
    maintenance: 0,
  })
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    setSectorData(mockSectors[selectedSector])

    const positions = mockSectors[selectedSector].positions
    setStats({
      total: positions.length,
      occupied: positions.filter((p) => p.status === "occupied").length,
      available: positions.filter((p) => p.status === "available").length,
      reserved: positions.filter((p) => p.status === "reserved").length,
      maintenance: positions.filter((p) => p.status === "maintenance").length,
    })
  }, [selectedSector])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "#FF5252"
      case "available":
        return "#5fc330"
      case "reserved":
        return "#FFC107"
      case "maintenance":
        return "#2196F3"
      default:
        return "#AAAAAA"
    }
  }

  const baseSize = 32
  const gridItemSize = baseSize * zoomLevel

  const handleZoomIn = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(zoomLevel + 0.2)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 0.6) {
      setZoomLevel(zoomLevel - 0.2)
    }
  }


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Setores</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        <View style={styles.sectorTabs}>
          {Object.keys(mockSectors).map((sector) => (
            <TouchableOpacity
              key={sector}
              style={[styles.sectorTab, selectedSector === sector && styles.sectorTabActive]}
              onPress={() => setSelectedSector(sector)}
            >
              <Text style={[styles.sectorTabText, selectedSector === sector && styles.sectorTabTextActive]}>
                Setor {sector}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: "#5fc330" }]} />
              <Text style={styles.statText}>Livres: {stats.available}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: "#FF5252" }]} />
              <Text style={styles.statText}>Ocupadas: {stats.occupied}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: "#FFC107" }]} />
              <Text style={styles.statText}>Reservadas: {stats.reserved}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: "#2196F3" }]} />
              <Text style={styles.statText}>Manutenção: {stats.maintenance}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapTitleContainer}>
          <Text style={styles.sectorTitle}>{sectorData.name}</Text>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <ZoomOut size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <ZoomIn size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapGridContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.mapGrid}>
              {Array.from({ length: sectorData.rows }).map((_, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.mapRow}>
                  {Array.from({ length: sectorData.cols }).map((_, colIndex) => {
                    const positionIndex = rowIndex * sectorData.cols + colIndex
                    const position = sectorData.positions[positionIndex]

                    if (!position) return null

                    return (
                      <TouchableOpacity
                        key={`position-${position.id}`}
                        style={[
                          styles.mapPosition,
                          {
                            backgroundColor: getStatusColor(position.status),
                            width: gridItemSize,
                            height: gridItemSize,
                          },
                        ]}
                      >
                        <Text style={[styles.positionText, { fontSize: 10 * zoomLevel }]}>{position.position}</Text>
                        {position.status === "occupied" && <View style={styles.occupiedIndicator} />}
                        {position.status === "occupied" && position.plate && (
                          <Text style={[styles.plateText, { fontSize: 8 * zoomLevel }]}>{position.plate}</Text>
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Legenda:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#5fc330" }]} />
              <Text style={styles.legendText}>Disponível</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#FF5252" }]} />
              <Text style={styles.legendText}>Ocupado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#FFC107" }]} />
              <Text style={styles.legendText}>Reservado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#2196F3" }]} />
              <Text style={styles.legendText}>Manutenção</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar activeScreen="SectorMap" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sectorTabs: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectorTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#333333",
  },
  plateText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
  },
  sectorTabActive: {
    backgroundColor: "#5fc330",
  },
  sectorTabText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  sectorTabTextActive: {
    color: "#121212",
    fontWeight: "600",
  },
  statsContainer: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statText: {
    color: "#DDDDDD",
    fontSize: 12,
  },
  mapTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  zoomControls: {
    flexDirection: "row",
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  mapGridContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    marginHorizontal: 16,
    height: 250,
  },
  mapGrid: {
    padding: 12,
  },
  mapRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  mapPosition: {
    margin: 4,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  positionText: {
    color: "#121212",
    fontWeight: "bold",
  },
  occupiedIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  legendContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333",
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 8,
  },
  legendIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    color: "#DDDDDD",
    fontSize: 14,
  },
  instructionsContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  instructionsText: {
    color: "#DDDDDD",
    fontSize: 14,
    marginBottom: 8,
  },
})

export default SectorMapScreen
