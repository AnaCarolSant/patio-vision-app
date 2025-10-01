// Tipos para a API de motos
export interface MotoDTO {
  id?: number;
  modelo: string;
  iotIdentificador: string;
  dataEntrada: string;
  dataSaida?: string | null;
  setorId: number;
  setorNome: string;
}

export interface CreateMotoDTO {
  modelo: string;
  iotIdentificador: string;
  setorId: number;
}

export interface UpdateMotoDTO {
  id: number;
  modelo: string;
  iotIdentificador: string;
  setorId: number;
}

// Configuração da API com múltiplas URLs para testar
const API_URLS = [
  'http://10.0.2.2:8080/api/moto', // Android Emulator
  'http://localhost:8080/api/moto', // iOS Simulator / Web
  'http://127.0.0.1:8080/api/moto', // Alternativa localhost
  'http://192.168.1.100:8080/api/moto', // Rede local (ajuste conforme seu IP)
];

class MotoService {
  private workingUrl: string | null = null;

  private async findWorkingUrl(): Promise<string> {
    if (this.workingUrl) {
      return this.workingUrl;
    }

    console.log('🔍 Testando conexões com API...');
    
    for (const url of API_URLS) {
      try {
        console.log(`Testando: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok || response.status === 404) { // 404 é OK, significa que a API está respondendo
          this.workingUrl = url;
          console.log(`✅ API encontrada: ${url}`);
          return url;
        }
        
        console.log(`❌ ${url} retornou status: ${response.status}`);
      } catch (error: any) {
        console.log(`❌ ${url} falhou:`, error.message);
      }
    }
    
    throw new Error(`❌ Nenhuma API disponível. URLs testadas: ${API_URLS.join(', ')}\n\n💡 Dicas:\n- Verifique se o backend está rodando na porta 8080\n- Para Android Emulator, use: http://10.0.2.2:8080\n- Para iOS Simulator, use: http://localhost:8080\n- Para dispositivo físico, use o IP da sua máquina`);
  }
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  // Listar todas as motos
  async listarMotos(): Promise<MotoDTO[]> {
    try {
      const response = await this.fetchWithAuth(API_BASE_URL);
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar motos:', error);
      throw new Error('Falha ao carregar lista de motos');
    }
  }

  // Buscar moto por ID
  async buscarMoto(id: number): Promise<MotoDTO | null> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/${id}`);
      if (response.status === 404) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar moto:', error);
      throw new Error('Falha ao buscar moto');
    }
  }

  // Criar nova moto
  async criarMoto(moto: CreateMotoDTO): Promise<MotoDTO> {
    try {
      const response = await this.fetchWithAuth(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(moto),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar moto:', error);
      throw new Error('Falha ao cadastrar moto');
    }
  }

  // Atualizar moto
  async atualizarMoto(id: number, moto: UpdateMotoDTO): Promise<MotoDTO> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...moto, id }),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      throw new Error('Falha ao atualizar moto');
    }
  }

  // Deletar moto
  async deletarMoto(id: number): Promise<void> {
    try {
      await this.fetchWithAuth(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao deletar moto:', error);
      throw new Error('Falha ao deletar moto');
    }
  }

  // Buscar moto por identificador IoT (para o scanner)
  async buscarPorIoT(iotIdentificador: string): Promise<MotoDTO | null> {
    try {
      const motos = await this.listarMotos();
      return motos.find(moto => moto.iotIdentificador === iotIdentificador) || null;
    } catch (error) {
      console.error('Erro ao buscar por IoT:', error);
      throw new Error('Falha ao buscar moto por identificador IoT');
    }
  }
}

export const motoService = new MotoService();