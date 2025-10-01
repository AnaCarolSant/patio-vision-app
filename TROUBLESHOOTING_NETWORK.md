# Troubleshooting - Erro de Conexão com API

## ❌ Erro: Network request failed

Este erro indica que a aplicação React Native não consegue se conectar com o backend Spring Boot.

## 🔧 Soluções por Plataforma

### 📱 **Android Emulator**
```
URL recomendada: http://10.0.2.2:8080/api/moto
```
- O `10.0.2.2` é o IP especial que o Android Emulator usa para acessar `localhost` da máquina host
- **NÃO** use `localhost` ou `127.0.0.1` no Android Emulator

### 🍎 **iOS Simulator**
```
URL recomendada: http://localhost:8080/api/moto
```
- Use `localhost` normalmente no iOS Simulator

### 📱 **Dispositivo Físico**
```
URL recomendada: http://[SEU_IP]:8080/api/moto
```
- Substitua `[SEU_IP]` pelo IP da sua máquina na rede local
- Para descobrir seu IP:
  - **Windows**: `ipconfig` (procure por IPv4)
  - **Mac/Linux**: `ifconfig` ou `ip addr`
- Exemplo: `http://192.168.1.100:8080/api/moto`

## 🚀 **Verificações Essenciais**

### 1. Backend está rodando?
```bash
# Verifique se o Spring Boot está ativo na porta 8080
curl http://localhost:8080/api/moto
```

### 2. Firewall/Antivirus
- Permita conexões na porta 8080
- Temporariamente desative firewall para testar

### 3. Rede
- Certifique-se de que dispositivo e computador estão na mesma rede
- Teste conectividade: `ping [SEU_IP]`

## 🛠 **Como usar o Debug na App**

1. **Abra a aba "Debug"** na tela de gerenciamento de motos
2. **Clique em "Testar Conexão"** - testa automaticamente todas as URLs
3. **Se falhar**, clique em "Info Debug" para ver URLs testadas
4. **"Resetar Cache"** limpa URLs salvas e força novo teste

## 📝 **URLs Testadas Automaticamente**

A app testa estas URLs em ordem:
1. `http://10.0.2.2:8080/api/moto` (Android Emulator)
2. `http://localhost:8080/api/moto` (iOS Simulator)
3. `http://127.0.0.1:8080/api/moto` (Alternativa localhost)
4. `http://192.168.1.100:8080/api/moto` (Rede local - ajustar IP)

## 🔧 **Configuração Manual**

Se precisar ajustar o IP manualmente, edite o arquivo:
```
src/services/motoService.ts
```

Altere o array `API_URLS` com seus IPs corretos.

## 📋 **Logs Úteis**

No console da app, procure por:
- `🔍 Testando conexão com: [URL]`
- `✅ API encontrada: [URL]`
- `❌ [URL] falhou: [erro]`

## 🆘 **Últimos Recursos**

### Teste via Browser
Abra no navegador do dispositivo:
```
http://[SEU_IP]:8080/api/moto
```

### Backend de Desenvolvimento
Se ainda não funcionar, use um backend temporário online:
1. Deploy no Heroku/Railway/Vercel
2. Use ngrok para expor localhost
3. Configure CORS no Spring Boot

### Exemplo CORS no Spring Boot
```java
@CrossOrigin(origins = "*")
@RestController
public class MotoRestController {
    // seus métodos aqui
}
```

## 💡 **Dica Final**

Use a aba **Debug** na app para diagnosticar rapidamente problemas de conexão. Ela testa automaticamente todas as configurações possíveis!