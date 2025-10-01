import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { motoService } from '../services/motoService';
import { useUser } from '../contexts/UserContext';

export const ConnectionDebug: React.FC = () => {
  const { darkMode } = useUser();
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Não testado');

  const testConnection = async () => {
    setTesting(true);
    setConnectionStatus('Testando...');
    
    try {
      const result = await motoService.testarConexao();
      
      if (result.sucesso) {
        setConnectionStatus(`✅ Conectado: ${result.url}`);
        Alert.alert('Sucesso', `API conectada com sucesso!\n\nURL: ${result.url}`);
      } else {
        setConnectionStatus(`❌ Falha: ${result.erro}`);
        Alert.alert('Erro de Conexão', result.erro || 'Erro desconhecido');
      }
    } catch (error: any) {
      setConnectionStatus(`❌ Erro: ${error.message}`);
      Alert.alert('Erro', error.message);
    } finally {
      setTesting(false);
    }
  };

  const resetCache = () => {
    motoService.resetUrlCache();
    setConnectionStatus('Cache resetado - teste novamente');
    Alert.alert('Cache Resetado', 'O cache de URL foi limpo. Teste a conexão novamente.');
  };

  const showDebugInfo = () => {
    const debug = motoService.getDebugInfo();
    Alert.alert(
      'Informações de Debug',
      `URLs testadas:\n${debug.urls.join('\n')}\n\nURL ativa: ${debug.workingUrl || 'Nenhuma'}`
    );
  };

  return (
    <View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, darkMode ? styles.textDark : styles.textLight]}>
        Debug de Conexão
      </Text>
      
      <Text style={[styles.status, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
        Status: {connectionStatus}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.testButton, testing && styles.buttonDisabled]}
          onPress={testConnection}
          disabled={testing}
        >
          <Text style={styles.buttonText}>
            {testing ? 'Testando...' : 'Testar Conexão'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetCache}
        >
          <Text style={styles.buttonText}>Resetar Cache</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={showDebugInfo}
        >
          <Text style={styles.buttonText}>Info Debug</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipContainer}>
        <Text style={[styles.tipTitle, darkMode ? styles.textDark : styles.textLight]}>
          💡 Dicas de Conexão:
        </Text>
        <Text style={[styles.tipText, darkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          • Android Emulator: use 10.0.2.2:8080{'\n'}
          • iOS Simulator: use localhost:8080{'\n'}
          • Dispositivo físico: use IP da sua máquina{'\n'}
          • Verifique se o backend está rodando
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
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
  containerLight: {
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    gap: 8,
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#4A80F0',
  },
  resetButton: {
    backgroundColor: '#FF9500',
  },
  infoButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipContainer: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4A80F0',
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 16,
  },
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
});