import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { Camera, CameraView } from "expo-camera"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { 
  Alert, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  TextInput,
  FlatList,
  Modal,
  RefreshControl
} from "react-native"
import { useUser } from "../contexts/UserContext"
import { motoService, MotoDTO, CreateMotoDTO, UpdateMotoDTO } from "../services/motoService"
import { ConnectionDebug } from "../components/ConnectionDebug"

type TabType = 'scan' | 'list' | 'create' | 'debug'

export default function MotoManagementScreen() {
  const { user, darkMode } = useUser()
  const [activeTab, setActiveTab] = useState<TabType>('list')
  
  // Scanner states
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [flashMode, setFlashMode] = useState<'off' | 'torch'>('off')
  
  // CRUD states
  const [motos, setMotos] = useState<MotoDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState<CreateMotoDTO>({
    modelo: '',
    iotIdentificador: '',
    setorId: 1
  })
  
  // Edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingMoto, setEditingMoto] = useState<MotoDTO | null>(null)

  useEffect(() => {
    loadMotos()
    requestCameraPermission()
  }, [])

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === "granted")
  }

  const loadMotos = async () => {
    try {
      setLoading(true)
      const data = await motoService.listarMotos()
      setMotos(data)
    } catch (error: any) {
      Alert.alert('Erro', error.message)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadMotos()
    setRefreshing(false)
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true)
    try {
      // Buscar moto por identificador IoT
      const moto = await motoService.buscarPorIoT(data)
      
      if (moto) {
        Alert.alert(
          "Moto Encontrada", 
          `Modelo: ${moto.modelo}\nIoT: ${moto.iotIdentificador}\nSetor: ${moto.setorNome}`,
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setScanned(false),
            },
            {
              text: "Ver Detalhes",
              onPress: () => {
                setActiveTab('list')
                setScanned(false)
              },
            },
          ]
        )
      } else {
        Alert.alert(
          "Moto Não Encontrada", 
          `Identificador IoT: ${data}\n\nDeseja cadastrar esta moto?`,
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setScanned(false),
            },
            {
              text: "Cadastrar",
              onPress: () => {
                setFormData(prev => ({ ...prev, iotIdentificador: data }))
                setActiveTab('create')
                setScanned(false)
              },
            },
          ]
        )
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message)
      setScanned(false)
    }
  }

  const handleCreateMoto = async () => {
    if (!formData.modelo || !formData.iotIdentificador) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      await motoService.criarMoto(formData)
      Alert.alert('Sucesso', 'Moto cadastrada com sucesso!')
      setFormData({ modelo: '', iotIdentificador: '', setorId: 1 })
      setActiveTab('list')
      loadMotos()
    } catch (error: any) {
      Alert.alert('Erro', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMoto = (moto: MotoDTO) => {
    setEditingMoto(moto)
    setEditModalVisible(true)
  }

  const handleUpdateMoto = async () => {
    if (!editingMoto) return

    try {
      setLoading(true)
      await motoService.atualizarMoto(editingMoto.id!, {
        id: editingMoto.id!,
        modelo: editingMoto.modelo,
        iotIdentificador: editingMoto.iotIdentificador,
        setorId: editingMoto.setorId
      })
      Alert.alert('Sucesso', 'Moto atualizada com sucesso!')
      setEditModalVisible(false)
      setEditingMoto(null)
      loadMotos()
    } catch (error: any) {
      Alert.alert('Erro', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMoto = (moto: MotoDTO) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a moto ${moto.modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true)
              await motoService.deletarMoto(moto.id!)
              Alert.alert('Sucesso', 'Moto excluída com sucesso!')
              loadMotos()
            } catch (error: any) {
              Alert.alert('Erro', error.message)
            } finally {
              setLoading(false)
            }
          }
        }
      ]
    )
  }

  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'torch' : 'off')
  }

  const handleCancel = () => {
    router.back()
  }

  const renderTabButtons = () => (
    <View style={[styles.tabContainer, darkMode ? styles.tabContainerDark : styles.tabContainerLight]}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'list' && styles.activeTab]}
        onPress={() => setActiveTab('list')}
      >
        <Ionicons name="list" size={20} color={activeTab === 'list' ? '#4A80F0' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
          Lista
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'scan' && styles.activeTab]}
        onPress={() => setActiveTab('scan')}
      >
        <Ionicons name="camera" size={20} color={activeTab === 'scan' ? '#4A80F0' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>
          Scanner
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'create' && styles.activeTab]}
        onPress={() => setActiveTab('create')}
      >
        <Ionicons name="add" size={20} color={activeTab === 'create' ? '#4A80F0' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
          Cadastrar
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'debug' && styles.activeTab]}
        onPress={() => setActiveTab('debug')}
      >
        <Ionicons name="bug" size={20} color={activeTab === 'debug' ? '#4A80F0' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'debug' && styles.activeTabText]}>
          Debug
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderMotoItem = ({ item }: { item: MotoDTO }) => (
    <View style={[styles.motoItem, darkMode ? styles.motoItemDark : styles.motoItemLight]}>
      <View style={styles.motoInfo}>
        <Text style={[styles.motoModel, darkMode ? styles.textDark : styles.textLight]}>
          {item.modelo}
        </Text>
        <Text style={[styles.motoDetail, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          IoT: {item.iotIdentificador}
        </Text>
        <Text style={[styles.motoDetail, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          Setor: {item.setorNome}
        </Text>
        <Text style={[styles.motoDetail, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          Entrada: {new Date(item.dataEntrada).toLocaleDateString('pt-BR')}
        </Text>
        {item.dataSaida && (
          <Text style={[styles.motoDetail, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
            Saída: {new Date(item.dataSaida).toLocaleDateString('pt-BR')}
          </Text>
        )}
      </View>
      <View style={styles.motoActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditMoto(item)}
        >
          <Ionicons name="pencil" size={20} color="#4A80F0" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMoto(item)}
        >
          <Ionicons name="trash" size={20} color="#FF4757" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderListTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={motos}
        renderItem={renderMotoItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-sport" size={50} color="#666" />
            <Text style={[styles.emptyText, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
              Nenhuma moto cadastrada
            </Text>
          </View>
        }
      />
    </View>
  )

  const renderCreateTab = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.formContainer}>
      <Text style={[styles.formTitle, darkMode ? styles.textDark : styles.textLight]}>
        Cadastrar Nova Moto
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, darkMode ? styles.textDark : styles.textLight]}>
          Modelo *
        </Text>
        <TextInput
          style={[styles.input, darkMode ? styles.inputDark : styles.inputLight]}
          value={formData.modelo}
          onChangeText={(text) => setFormData(prev => ({ ...prev, modelo: text }))}
          placeholder="Ex: Honda CG 160"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, darkMode ? styles.textDark : styles.textLight]}>
          Identificador IoT *
        </Text>
        <TextInput
          style={[styles.input, darkMode ? styles.inputDark : styles.inputLight]}
          value={formData.iotIdentificador}
          onChangeText={(text) => setFormData(prev => ({ ...prev, iotIdentificador: text }))}
          placeholder="Ex: IOT001"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, darkMode ? styles.textDark : styles.textLight]}>
          Setor ID *
        </Text>
        <TextInput
          style={[styles.input, darkMode ? styles.inputDark : styles.inputLight]}
          value={formData.setorId.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, setorId: parseInt(text) || 1 }))}
          placeholder="1"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleCreateMoto}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Cadastrando...' : 'Cadastrar Moto'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )

  const renderScannerTab = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.permissionText, darkMode ? styles.textDark : styles.textLight]}>
            Solicitando permissão da câmera...
          </Text>
        </View>
      )
    }

    if (hasPermission === false) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.permissionText, darkMode ? styles.textDark : styles.textLight]}>
            Sem acesso à câmera. Por favor, conceda permissão nas configurações.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={requestCameraPermission}
          >
            <Text style={styles.buttonText}>Solicitar Permissão Novamente</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.scanner}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "code128", "code39"],
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
              Posicione o código QR ou identificador da moto no centro
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
          </View>
        </CameraView>
      </View>
    )
  }

  const renderEditModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, darkMode ? styles.modalContentDark : styles.modalContentLight]}>
          <Text style={[styles.modalTitle, darkMode ? styles.textDark : styles.textLight]}>
            Editar Moto
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, darkMode ? styles.textDark : styles.textLight]}>
              Modelo
            </Text>
            <TextInput
              style={[styles.input, darkMode ? styles.inputDark : styles.inputLight]}
              value={editingMoto?.modelo || ''}
              onChangeText={(text) => 
                setEditingMoto(prev => prev ? { ...prev, modelo: text } : null)
              }
              placeholder="Modelo da moto"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, darkMode ? styles.textDark : styles.textLight]}>
              Identificador IoT
            </Text>
            <TextInput
              style={[styles.input, darkMode ? styles.inputDark : styles.inputLight]}
              value={editingMoto?.iotIdentificador || ''}
              onChangeText={(text) => 
                setEditingMoto(prev => prev ? { ...prev, iotIdentificador: text } : null)
              }
              placeholder="Identificador IoT"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, darkMode ? styles.textDark : styles.textLight]}>
              Setor ID
            </Text>
            <TextInput
              style={[styles.input, darkMode ? styles.inputDark : styles.inputLight]}
              value={editingMoto?.setorId.toString() || ''}
              onChangeText={(text) => 
                setEditingMoto(prev => prev ? { ...prev, setorId: parseInt(text) || 1 } : null)
              }
              placeholder="ID do setor"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={() => {
                setEditModalVisible(false)
                setEditingMoto(null)
              }}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.saveModalButton]}
              onPress={handleUpdateMoto}
              disabled={loading}
            >
              <Text style={styles.modalButtonText}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>
      {renderTabButtons()}
      
      <View style={styles.content}>
        {activeTab === 'list' && renderListTab()}
        {activeTab === 'scan' && renderScannerTab()}
        {activeTab === 'create' && renderCreateTab()}
        {activeTab === 'debug' && <ConnectionDebug />}
      </View>
      
      {renderEditModal()}
      
      <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingBottom: 10,
  },
  tabContainerLight: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  tabContainerDark: {
    backgroundColor: '#2a2a2a',
    borderBottomColor: '#404040',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A80F0',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4A80F0',
    fontWeight: 'bold',
  },
  
  // Content styles
  tabContent: {
    flex: 1,
  },
  
  // List styles
  listContainer: {
    padding: 16,
  },
  motoItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  motoItemLight: {
    backgroundColor: '#fff',
  },
  motoItemDark: {
    backgroundColor: '#2a2a2a',
  },
  motoInfo: {
    flex: 1,
  },
  motoModel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  motoDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  motoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
  
  // Form styles
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#3a3a3a',
    borderColor: '#555',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Scanner styles
  scannerContainer: {
    flex: 1,
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
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
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
  
  // Button styles
  button: {
    flexDirection: "row",
    backgroundColor: "#4A80F0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1000,
  },
  
  // Center container
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalContentLight: {
    backgroundColor: '#fff',
  },
  modalContentDark: {
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelModalButton: {
    backgroundColor: '#999',
  },
  saveModalButton: {
    backgroundColor: '#4A80F0',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Text styles
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  textSecondaryLight: {
    color: '#666',
  },
  textSecondaryDark: {
    color: '#999',
  },
})
