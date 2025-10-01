# CRUD de Motos - Tela de Gerenciamento

## Funcionalidades Implementadas

A tela de scan foi transformada em uma tela completa de gerenciamento de motos com as seguintes funcionalidades:

### 📱 **Abas Principais**

1. **Lista** - Visualização de todas as motos cadastradas
2. **Scanner** - Leitura de códigos QR/códigos de barras para identificar motos
3. **Cadastrar** - Formulário para adicionar novas motos

### 🔧 **Operações CRUD**

#### **Create (Criar)**
- Formulário completo para cadastro de novas motos
- Campos: Modelo, Identificador IoT, Setor ID
- Validação de campos obrigatórios
- Integração com API backend

#### **Read (Listar)**
- Lista todas as motos cadastradas
- Exibe: Modelo, Identificador IoT, Setor, Data de entrada/saída
- Pull-to-refresh para atualizar dados
- Estado vazio quando não há motos

#### **Update (Editar)**
- Modal de edição acessível via botão na lista
- Permite alterar modelo, identificador IoT e setor
- Confirmação visual de salvamento

#### **Delete (Excluir)**
- Botão de exclusão na lista de motos
- Confirmação antes da exclusão
- Feedback visual de sucesso/erro

### 📲 **Scanner Inteligente**

- **Moto Encontrada**: Exibe detalhes e opção para ver na lista
- **Moto Não Encontrada**: Oferece opção para cadastrar automaticamente
- Suporte a QR Code, Code128 e Code39
- Controle de flash da câmera
- Permissões de câmera gerenciadas automaticamente

### 🎨 **Interface**

- **Modo Escuro/Claro**: Suporte completo ao tema do usuário
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Feedback Visual**: Estados de loading, erro e sucesso
- **Navegação Intuitiva**: Abas claras e navegação fluida

## 🔌 **Integração com Backend**

### **Endpoints Utilizados**

```typescript
// Listar todas as motos
GET /api/moto

// Buscar moto por ID
GET /api/moto/{id}

// Criar nova moto
POST /api/moto

// Atualizar moto
PUT /api/moto/{id}

// Deletar moto
DELETE /api/moto/{id}
```

### **Modelo de Dados**

```typescript
interface MotoDTO {
  id?: number;
  modelo: string;
  iotIdentificador: string;
  dataEntrada: string;
  dataSaida?: string | null;
  setorId: number;
  setorNome: string;
}
```

## 🚀 **Como Usar**

### **1. Configurar API**
- Ajuste a URL base no arquivo `src/services/motoService.ts`
- Certifique-se de que o backend está rodando

### **2. Listar Motos**
- Abra a aba "Lista"
- Pull down para atualizar
- Toque no ícone de edição para modificar
- Toque no ícone de lixeira para excluir

### **3. Escanear Motos**
- Abra a aba "Scanner"
- Aponte a câmera para o código QR/código de barras
- Siga as instruções na tela

### **4. Cadastrar Motos**
- Abra a aba "Cadastrar"
- Preencha todos os campos obrigatórios
- Toque em "Cadastrar Moto"

## 🛠 **Configuração Técnica**

### **Dependências Adicionais**
Nenhuma dependência adicional foi necessária. A implementação utiliza:
- Expo Camera (já instalado)
- React Native componentes nativos
- TypeScript
- Contexto de usuário existente

### **Serviço de API**
O arquivo `src/services/motoService.ts` encapsula todas as operações da API:
- Tratamento de erros
- Tipagem TypeScript
- Headers de autenticação preparados

### **Estados Gerenciados**
- Loading states para operações assíncronas
- Dados de formulário
- Lista de motos
- Estados do scanner
- Modal de edição

## 🔄 **Fluxos de Trabalho**

### **Fluxo do Scanner**
1. Usuário escaneia código
2. Sistema busca moto na API
3. Se encontrada: Exibe detalhes
4. Se não encontrada: Oferece cadastro
5. Pré-preenche formulário se aceitar cadastro

### **Fluxo de Edição**
1. Usuário toca em editar na lista
2. Modal abre com dados atuais
3. Usuário modifica campos
4. Sistema salva via API
5. Lista é atualizada automaticamente

### **Fluxo de Exclusão**
1. Usuário toca em excluir
2. Confirmação é solicitada
3. Se confirmado, API é chamada
4. Lista é atualizada
5. Feedback visual é exibido

## 🎯 **Próximas Melhorias**

- [ ] Filtros e busca na lista
- [ ] Histórico de movimentações
- [ ] Exportação de dados
- [ ] Scanner de múltiplos códigos
- [ ] Integração com GPS para localização
- [ ] Push notifications para entradas/saídas
- [ ] Relatórios visuais