# Teste Rápido do Firebase Authentication

## Como testar a implementação:

### 1. Configurar Firebase (obrigatório)
1. Siga as instruções no arquivo `FIREBASE_SETUP.md`
2. Configure suas credenciais no arquivo `src/config/firebase.ts`

### 2. Executar o projeto
```bash
npm start
```

### 3. Testar funcionalidades

#### Registro de novo usuário:
1. Na tela de login, clique em "Cadastre-se"
2. Preencha:
   - Nome: Seu nome
   - Email: um email válido
   - Senha: mínimo 6 caracteres
   - Confirmar senha: mesma senha
3. Clique em "Cadastrar"
4. Se bem sucedido, você será automaticamente logado

#### Login:
1. Na tela de login, preencha email e senha
2. Marque "Lembrar de mim" se quiser salvar o email
3. Clique em "Entrar"

#### Logout:
1. Acesse a tela de perfil ou qualquer tela que tenha botão de logout
2. Clique em "Sair"

### 4. Verificar no Firebase Console
1. Acesse o Firebase Console
2. Vá para Authentication > Users
3. Você deve ver os usuários criados

### 5. Testar persistência
1. Feche o app
2. Abra novamente
3. Se você estava logado, deve permanecer logado

## Arquivos importantes:

- `src/config/firebase.ts` - Configuração do Firebase
- `src/services/firebaseAuth.ts` - Serviços de autenticação
- `src/contexts/UserContext.tsx` - Context global do usuário
- `src/hooks/useFirebaseAuth.ts` - Hook personalizado para auth
- `src/app/login.tsx` - Tela de login atualizada

## Tratamento de erros:

O sistema traduz automaticamente os erros do Firebase para português:
- Email já em uso
- Senha muito fraca
- Usuário não encontrado
- Senha incorreta
- Muitas tentativas
- Erro de conexão

## Funcionalidades extras implementadas:

- ✅ Validação de formulários
- ✅ Estados de loading
- ✅ Persistência de "Lembrar de mim"
- ✅ Observer de estado de autenticação
- ✅ Hook personalizado para facilitar uso
- ✅ Tratamento completo de erros
- ✅ Interface em português