import { FileText, LogIn, LogOut, Search, Wrench, X } from "lucide-react-native"
import { useState } from "react"
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import BottomTabBar from "../components/BottomTabBar"

const mockHistoryData = [
  {
    id: "1",
    type: "entry",
    motorcycle: {
      id: "MOTO123",
      model: "Honda CG 160",
      plate: "ABC1234",
    },
    time: "2023-05-18T08:30:00",
    operator: "João Silva",
    sector: "B",
    position: "15",
  },
  {
    id: "2",
    type: "exit",
    motorcycle: {
      id: "MOTO456",
      model: "Yamaha Fazer",
      plate: "DEF5678",
    },
    time: "2023-05-18T08:15:00",
    operator: "Maria Souza",
  },
  {
    id: "3",
    type: "maintenance",
    motorcycle: {
      id: "MOTO789",
      model: "Honda Biz",
      plate: "GHI9012",
    },
    time: "2023-05-18T08:00:00",
    operator: "Carlos Oliveira",
    notes: "Troca de óleo",
  },
  {
    id: "4",
    type: "entry",
    motorcycle: {
      id: "MOTO101",
      model: "Suzuki Yes",
      plate: "JKL3456",
    },
    time: "2023-05-17T17:45:00",
    operator: "Ana Santos",
    sector: "A",
    position: "22",
  },
  {
    id: "5",
    type: "exit",
    motorcycle: {
      id: "MOTO202",
      model: "Honda PCX",
      plate: "MNO7890",
    },
    time: "2023-05-17T17:30:00",
    operator: "Pedro Lima",
  },
  {
    id: "6",
    type: "entry",
    motorcycle: {
      id: "MOTO303",
      model: "Yamaha XTZ",
      plate: "PQR1234",
    },
    time: "2023-05-17T16:45:00",
    operator: "Juliana Costa",
    sector: "C",
    position: "08",
  },
  {
    id: "7",
    type: "maintenance",
    motorcycle: {
      id: "MOTO404",
      model: "Honda CB 300",
      plate: "STU5678",
    },
    time: "2023-05-17T15:30:00",
    operator: "Roberto Alves",
    notes: "Verificação de freios",
  },
  {
    id: "8",
    type: "exit",
    motorcycle: {
      id: "MOTO505",
      model: "Yamaha MT-03",
      plate: "VWX9012",
    },
    time: "2023-05-17T14:15:00",
    operator: "Fernanda Dias",
  },
]

const HistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredData = mockHistoryData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.motorcycle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.motorcycle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === null || item.type === filterType

    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "entry":
        return "#5fc330"
      case "exit":
        return "#FF5252"
      case "maintenance":
        return "#FFC107"
      default:
        return "#AAAAAA"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "entry":
        return <LogIn size={16} color="#121212" />
      case "exit":
        return <LogOut size={16} color="#121212" />
      case "maintenance":
        return <Wrench size={16} color="#121212" />
      default:
        return null
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "entry":
        return "Entrada"
      case "exit":
        return "Saída"
      case "maintenance":
        return "Manutenção"
      default:
        return "Desconhecido"
    }
  }

  const renderHistoryItem = ({ item }: { item: typeof mockHistoryData[0] }) => (
    <View style={styles.historyItem}>
      <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]}>
        {getTypeIcon(item.type)}
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{item.motorcycle.model}</Text>
        <Text style={styles.historyPlate}>{item.motorcycle.plate}</Text>
        <Text style={styles.historyTime}>
          {formatDate(item.time)} às {formatTime(item.time)}
        </Text>
        <Text style={styles.historyOperator}>Operador: {item.operator}</Text>
        {item.type === "entry" && (
          <Text style={styles.historySector}>
            Setor: {item.sector} | Vaga: {item.position}
          </Text>
        )}
        {item.type === "maintenance" && item.notes && (
          <Text style={styles.historyNotes}>Obs: {item.notes}</Text>
        )}
        <Text style={styles.historyTime}>{getTypeText(item.type)}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#AAAAAA" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo, placa ou operador"
            placeholderTextColor="#777777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filterType === null && styles.filterButtonActive]}
            onPress={() => setFilterType(null)}
          >
            <Text style={[styles.filterButtonText, filterType === null && styles.filterButtonTextActive]}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterType === "entry" && styles.filterButtonActive]}
            onPress={() => setFilterType("entry")}
          >
            <Text style={[styles.filterButtonText, filterType === "entry" && styles.filterButtonTextActive]}>
              Entradas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterType === "exit" && styles.filterButtonActive]}
            onPress={() => setFilterType("exit")}
          >
            <Text style={[styles.filterButtonText, filterType === "exit" && styles.filterButtonTextActive]}>
              Saídas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterType === "maintenance" && styles.filterButtonActive]}
            onPress={() => setFilterType("maintenance")}
          >
            <Text style={[styles.filterButtonText, filterType === "maintenance" && styles.filterButtonTextActive]}>
              Manutenção
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#777777" />
            <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
          </View>
        }
      />

      <BottomTabBar activeScreen="History" />
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
  searchContainer: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#FFFFFF",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#2A2A2A",
  },
  filterButtonActive: {
    backgroundColor: "#5fc330",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#DDDDDD",
    fontWeight: "400",
  },
  filterButtonTextActive: {
    color: "#121212",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#333333",
  },
  typeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  historyPlate: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#DDDDDD",
  },
  historyTime: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 2,
  },
  historyOperator: {
    fontSize: 14,
    marginBottom: 2,
    color: "#DDDDDD",
  },
  historySector: {
    fontSize: 14,
    color: "#5fc330",
    marginBottom: 2,
  },
  historyNotes: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
    color: "#DDDDDD",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#777777",
    marginTop: 16,
  },
})

export default HistoryScreen
