# Configuração Login com Google - GymManager Pro

## Visão Geral

Para implementar autenticação via Google (OAuth 2.0), você precisa:

1. **Criar projeto no Google Cloud Console**
2. **Configurar tela de consentimento OAuth**
3. **Criar credenciais (Client ID)**
4. **Implementar no código**
5. **Configurar domínios autorizados**

---

## Passo a Passo Completo

### 1. Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Clique no seletor de projetos (topo) → **"Novo Projeto"**
4. Nome: `GymManager Pro`
5. Clique em **"Criar"**

### 2. Ativar Google Identity API

1. No menu lateral: **"APIs e Serviços"** → **"Biblioteca"**
2. Pesquise: **"Google Identity Toolkit"** ou **"Firebase Authentication"**
3. Clique e ative a API

### 3. Configurar Tela de Consentimento OAuth

1. Menu lateral: **"APIs e Serviços"** → **"Tela de consentimento OAuth"**
2. Selecione: **"Externo"** (qualquer usuário pode logar)
3. Preencha:
   - **Nome do app**: GymManager Pro
   - **Email de suporte**: seu-email@gmail.com
   - **Logo** (opcional): Upload de imagem 120x120px
4. Clique **"Salvar e continuar"**
5. Escopos: Adicione `email`, `profile`, `openid`
6. Test users: Adicione seu email para testar

### 4. Criar Credenciais (Client ID)

1. Menu lateral: **"Credenciais"**
2. Clique: **"+ Criar credenciais"** → **"ID do cliente OAuth"**
3. Tipo de aplicativo: **"Aplicativo da Web"**
4. Nome: `GymManager Web`
5. **URIs de redirecionamento autorizados**:
   ```
   http://localhost:5500          (desenvolvimento)
   https://gym-manager-ten.vercel.app  (produção)
   ```
6. Clique **"Criar"**
7. **Anote o Client ID** (vai usar no código)

---

## Implementação no Código

### Opção 1: Google Identity Services (Recomendado - Novo)

```html
<!-- No login.html, substitua o botão Google -->
<div id="g_id_onload"
     data-client_id="SEU_CLIENT_ID.apps.googleusercontent.com"
     data-callback="handleGoogleLogin"
     data-auto_prompt="false">
</div>
<div class="g_id_signin" 
     data-type="standard"
     data-size="large"
     data-theme="outline"
     data-text="sign_in_with"
     data-shape="rectangular"
     data-logo_alignment="left">
</div>

<script src="https://accounts.google.com/gsi/client" async defer></script>
```

```javascript
// No auth.js
function handleGoogleLogin(response) {
    // Decodificar o token JWT
    const credential = response.credential;
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    // Dados do usuário Google
    const userData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        provider: 'google'
    };
    
    // Verificar se usuário existe no sistema
    const users = JSON.parse(localStorage.getItem('gymmanager_users') || '[]');
    let user = users.find(u => u.email === userData.email);
    
    if (!user) {
        // Criar novo usuário com role padrão
        user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.picture,
            role: 'recepcionista', // Padrão para novos
            provider: 'google',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('gymmanager_users', JSON.stringify(users));
    } else {
        // Atualizar último login
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('gymmanager_users', JSON.stringify(users));
    }
    
    // Criar sessão
    createSession(user, true);
    window.location.href = 'index.html';
}
```

### Opção 2: Firebase Auth (Mais Completo)

```html
<!-- Adicione no head -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js"></script>
```

```javascript
// Configuração Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    appId: "SUA_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Login com Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // Processar login...
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}
```

---

## Configurações de Domínio

### Para Desenvolvimento Local:
```
http://localhost
http://localhost:5500
http://127.0.0.1
```

### Para Produção (Vercel):
```
https://gym-manager-ten.vercel.app
https://*.vercel.app
```

### Para Domínio Personalizado:
```
https://seusistema.com.br
https://www.seusistema.com.br
```

---

## Fluxo de Autenticação

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Usuário   │────▶│ Botão Google │────▶│ Google Auth │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Sistema   │◀────│  Verificar   │◀────│   Token     │
│  (sessão)   │     │   usuário    │     │   JWT       │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## Vantagens do Login com Google

✅ **Segurança**: Google gerencia senhas e 2FA  
✅ **UX**: Login em 1 clique, sem senha para lembrar  
✅ **Confiança**: Usuários confiam na marca Google  
✅ **Verificação**: Email já verificado pelo Google  
✅ **Dados**: Foto e nome do perfil Google  

---

## Limitações

⚠️ **Dependência**: Sistema depende da Google  
⚠️ **Privacidade**: Alguns usuários não gostam  
⚠️ **Corporativo**: Empresas podem bloquear  
⚠️ **Offline**: Requer conexão com internet  

---

## Custo

- **Gratuito**: Até 50.000 usuários/mês
- **Pay-as-you-go**: Após limite (Firebase Auth)
- Google Identity Services: **Gratuito**

---

## Próximos Passos Recomendados

1. Criar conta no Google Cloud
2. Configurar projeto e obter Client ID
3. Implementar código (Opção 1 é mais simples)
4. Testar em ambiente local
5. Adicionar domínio de produção
6. Publicar na loja (se for app mobile)

---

## Precisa de Ajuda?

Documentação oficial:
- https://developers.google.com/identity/gsi/web
- https://firebase.google.com/docs/auth
