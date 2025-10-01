# Configuração do Firebase Authentication

## Passos para configurar o Firebase no seu projeto:

### 1. Criar um projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do seu projeto
4. Siga as instruções para criar o projeto

### 2. Ativar Authentication

1. No painel do Firebase, vá para "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", ative "Email/Password"
4. Salve as configurações

### 3. Obter as configurações do projeto

1. No painel do Firebase, clique no ícone de engrenagem ⚙️ ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Na seção "Seus aplicativos", clique em "Web" (</>)
4. Registre seu app com um nickname
5. Copie as configurações do Firebase

### 4. Configurar o arquivo firebase.ts

Abra o arquivo `src/config/firebase.ts` e substitua as configurações pelos valores do seu projeto:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-project-id.firebaseapp.com",
  projectId: "seu-project-id",
  storageBucket: "seu-project-id.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
};
```

### 5. Configurar regras de segurança (opcional)

No Firebase Console, vá para "Firestore Database" > "Regras" e configure conforme necessário.

## Funcionalidades implementadas:

- ✅ Registro de usuários com email e senha
- ✅ Login com email e senha
- ✅ Logout
- ✅ Persistência de sessão
- ✅ Tratamento de erros em português
- ✅ Integração com UserContext
- ✅ Validação de formulários

## Como usar:

1. Configure o Firebase conforme as instruções acima
2. Execute o projeto: `npm start`
3. Na tela de login, você pode:
   - Fazer login com uma conta existente
   - Criar uma nova conta clicando em "Cadastre-se"
   - Marcar "Lembrar de mim" para salvar o email

## Estrutura dos arquivos:

- `src/config/firebase.ts` - Configuração do Firebase
- `src/services/firebaseAuth.ts` - Serviço de autenticação
- `src/contexts/UserContext.tsx` - Context atualizado para Firebase
- `src/app/login.tsx` - Tela de login atualizada

## Próximos passos (opcionais):

- Implementar recuperação de senha
- Adicionar autenticação com Google/Facebook
- Implementar perfis de usuário no Firestore
- Adicionar verificação de email