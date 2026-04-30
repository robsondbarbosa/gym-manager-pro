# ⚡ Guia Rápido - Login Google (2 minutos)

## 🚀 Passos Rápidos

### 1️⃣ Acesse Google Cloud
```
https://console.cloud.google.com/
```

### 2️⃣ Crie um Projeto
- Clique no seletor de projetos (topo)
- "Novo Projeto"
- Nome: `GymManager Pro`

### 3️⃣ Ative a API
- Menu ☰ → APIs e Serviços → Biblioteca
- Pesquise: `Google Identity Toolkit`
- Clique em **ATIVAR**

### 4️⃣ Configure OAuth
- Menu ☰ → APIs e Serviços → Tela de consentimento OAuth
- Tipo: **Externo**
- Preencha:
  - Nome do app: `GymManager Pro`
  - Email: seu-email@gmail.com
  - URL: `https://gym-manager-ten.vercel.app`
- Escopos: Adicione `email`, `profile`, `openid`
- Adicione seu email como usuário de teste

### 5️⃣ Crie Credenciais
- Menu ☰ → APIs e Serviços → Credenciais
- "+ CRIAR CREDENCIAIS" → "ID do cliente OAuth"
- Tipo: **Aplicativo da Web**
- Nome: `GymManager Web`
- URIs autorizados:
  ```
  https://gym-manager-ten.vercel.app
  ```
- Clique em **CRIAR**

### 6️⃣ Copie o Client ID
```
Exemplo: 123456789-abc123.apps.googleusercontent.com
```

### 7️⃣ Configure no Sistema
- Acesse: https://gym-manager-ten.vercel.app/login.html
- Clique em **"Entrar com Google"**
- Cole seu Client ID
- Clique em **ATIVAR**

✅ **Pronto! Login com Google funcionando!**

---

## 🆘 Problemas?

| Erro | Solução |
|------|---------|
| "Missing client_id" | Cole o Client ID no sistema |
| "redirect_uri_mismatch" | Adicione a URL exata nas credenciais |
| Não aparece botão | Recarregue a página após colar Client ID |

---

## 📞 Ajuda

Veja o guia completo: `GOOGLE_AUTH_GUIA_COMPLETO.md`

Ou entre em contato:
- 📧 suporte@gymmanager.com
