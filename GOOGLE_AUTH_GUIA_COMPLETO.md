# 📘 Guia Completo: Configurar Login com Google no GymManager Pro

## 🎯 Objetivo
Este guia ensina **passo a passo** como configurar o login com Google no sistema GymManager Pro, permitindo que seus usuários façam login com apenas 1 clique.

---

## 📋 Pré-requisitos

- ✅ Conta Google (Gmail)
- ✅ Acesso ao GymManager Pro
- ✅ ~10 minutos de tempo

---

## 🚀 Passo 1: Acessar Google Cloud Console

### 1.1 Abra o site oficial
```
🔗 https://console.cloud.google.com/
```

### 1.2 Faça login com sua conta Google
- Clique no botão "Fazer login" (canto superior direito)
- Use sua conta Gmail

**[PRINT 1: Tela inicial do Google Cloud Console]**
```
┌─────────────────────────────────────────────────────────┐
│  Google Cloud                                           │
│                                                         │
│  👤 Fazer login    │    Console    │    Documentação   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │     Bem-vindo ao Google Cloud                   │   │
│  │                                                 │   │
│  │     Crie, implante e escalone aplicativos       │   │
│  │     na mesma infraestrutura do Google           │   │
│  │                                                 │   │
│  │     [ 🚀 FAZER LOGIN ]                          │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Passo 2: Criar um Novo Projeto

### 2.1 Clique no seletor de projetos
No **topo da página**, ao lado do logo Google Cloud, clique no nome do projeto atual (geralmente mostra "Selecionar um projeto")

**[PRINT 2: Seletor de projetos]**
```
┌─────────────────────────────────────────────────────────┐
│  ☰  Google Cloud    ▼ Meu Projeto    🔍    🔔    👤   │
│              ↑                                          │
│        CLIQUE AQUI                                      │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Clique em "NOVO PROJETO"
```
┌────────────────────────────────────────┐
│  Selecionar um projeto          [X]    │
│                                        │
│  ▼ SEU_EMAIL@gmail.com                 │
│                                        │
│  Projetos recentes:                    │
│    • Meu Projeto                       │
│                                        │
│  [ + NOVO PROJETO ]  ← CLIQUE AQUI    │
│                                        │
└────────────────────────────────────────┘
```

### 2.3 Configure o projeto
Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Nome do projeto** | `GymManager Pro` |
| **Organização** | Deixe em branco (ou sua organização) |
| **Local** | `Sem organização` |

**[PRINT 3: Formulário de novo projeto]**
```
┌────────────────────────────────────────┐
│  Novo Projeto                          │
│                                        │
│  Nome do projeto *                     │
│  ┌────────────────────────────────┐   │
│  │ GymManager Pro                 │   │
│  └────────────────────────────────┘   │
│                                        │
│  Organização                           │
│  ┌────────────────────────────────┐   │
│  │ Sem organização                │   │
│  └────────────────────────────────┘   │
│                                        │
│  Local                                 │
│  ┌────────────────────────────────┐   │
│  │ Sem organização                │   │
│  └────────────────────────────────┘   │
│                                        │
│           [ CANCELAR ]  [ CRIAR ]     │
│                              ↑         │
│                        CLIQUE AQUI     │
└────────────────────────────────────────┘
```

### 2.4 Aguarde a criação
O Google vai criar o projeto (leva alguns segundos). Você verá uma notificação no canto inferior direito.

---

## 🚀 Passo 3: Ativar a API de Autenticação

### 3.1 Acesse o menu APIs e Serviços
Clique no menu hambúrguer (☰) no canto superior esquerdo

```
Navegue para: APIs e Serviços → Biblioteca
```

**[PRINT 4: Menu lateral]**
```
┌────────────────────────────────────────┐
│  ☰                                     │
│  IAM e Admin                           │
│  ▼ APIs e Serviços        ← CLIQUE    │
│     • Painel                          │
│     • Biblioteca        ← CLIQUE AQUI │
│     • Credenciais                     │
│     • Tela de consentimento OAuth     │
│  ...                                   │
└────────────────────────────────────────┘
```

### 3.2 Pesquise pela API
Na barra de pesquisa, digite:
```
Google Identity Toolkit
```

**[PRINT 5: Biblioteca de APIs]**
```
┌─────────────────────────────────────────────────────────┐
│  Biblioteca de APIs                                     │
│                                                         │
│  🔍 Google Identity Toolkit                             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔐 Google Identity Toolkit                      │   │
│  │    Ferramenta para autenticação de usuários     │   │
│  │                                                 │   │
│  │    [ ATIVAR ]  ← CLIQUE AQUI                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Ou tente: Identity Toolkit API, Firebase Auth         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Clique em "ATIVAR"
Aguarde alguns segundos enquanto a API é ativada.

---

## 🚀 Passo 4: Configurar Tela de Consentimento OAuth

### 4.1 Acesse as configurações
```
Menu: APIs e Serviços → Tela de consentimento OAuth
```

### 4.2 Escolha o tipo de usuário
Selecione: **Externo** (qualquer pessoa com conta Google pode usar)

**[PRINT 6: Tipo de usuário]**
```
┌─────────────────────────────────────────────────────────┐
│  Tela de consentimento OAuth                            │
│                                                         │
│  Escolha como deseja configurar e registrar seu app:   │
│                                                         │
│  ○ Interno                                              │
│    Disponível apenas para usuários da organização      │
│                                                         │
│  ● Externo  ← SELECIONE ESTE                           │
│    Disponível para qualquer usuário com uma conta      │
│    Google                                               │
│                                                         │
│              [ CRIAR ]  ← CLIQUE                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Preencha os dados do aplicativo

**[PRINT 7: Informações do app]**
```
┌─────────────────────────────────────────────────────────┐
│  Informações do app                                     │
│                                                         │
│  Nome do app *                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ GymManager Pro                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Email de suporte do usuário *                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ seu-email@gmail.com                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Logotipo do app (opcional)                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [ 📎 Fazer upload ]                             │   │
│  │ Tamanho recomendado: 120x120px                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Página inicial do app *                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ https://gym-manager-ten.vercel.app             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Política de privacidade do app *                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ https://gym-manager-ten.vercel.app/privacidade │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│           [ CANCELAR ]  [ SALVAR E CONTINUAR ]         │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Escopos (Permissões)
Clique em **"Adicionar ou remover escopos"**

Adicione estes escopos:
- ✅ `.../auth/userinfo.email` (Ver seu endereço de email)
- ✅ `.../auth/userinfo.profile` (Ver suas informações pessoais)
- ✅ `openid` (Associar você às suas informações pessoais)

**[PRINT 8: Escopos]**
```
┌─────────────────────────────────────────────────────────┐
│  Escopos                                              [X]│
│                                                         │
│  Escopos para APIs sensíveis                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑️ .../auth/userinfo.email                      │   │
│  │    Ver seu endereço de email                    │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ ☑️ .../auth/userinfo.profile                    │   │
│  │    Ver suas informações pessoais                │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ ☑️ openid                                       │   │
│  │    Associar você às suas informações pessoais   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                    [ ATUALIZAR ]                       │
└─────────────────────────────────────────────────────────┘
```

Clique em **"ATUALIZAR"** e depois **"SALVAR E CONTINUAR"**

### 4.5 Usuários de teste
Adicione seu email para testar:

**[PRINT 9: Usuários de teste]**
```
┌─────────────────────────────────────────────────────────┐
│  Usuários de teste                                      │
│                                                         │
│  Adicione usuários para testar seu app:                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ usuariosdeteste@gmail.com              [ 🗑️ ]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [ + ADICIONAR USUÁRIOS ]                              │
│                                                         │
│  Digite o email:                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ seu-email@gmail.com                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│           [ CANCELAR ]  [ SALVAR E CONTINUAR ]         │
└─────────────────────────────────────────────────────────┘
```

### 4.6 Resumo
Revise as informações e clique em **"VOLTAR PARA PAINEL"**

---

## 🚀 Passo 5: Criar Credenciais (Client ID)

### 5.1 Acesse Credenciais
```
Menu: APIs e Serviços → Credenciais
```

### 5.2 Clique em "+ CRIAR CREDENCIAIS"
Selecione: **"ID do cliente OAuth"**

**[PRINT 10: Criar credenciais]**
```
┌─────────────────────────────────────────────────────────┐
│  Credenciais                                            │
│                                                         │
│  [ + CRIAR CREDENCIAIS ]  ▼                            │
│                             │                           │
│                             ├── Chave de API           │
│                             ├── ID do cliente OAuth  ← │
│                             └── Conta de serviço       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Configure o tipo de aplicativo

**[PRINT 11: Configurar OAuth]**
```
┌─────────────────────────────────────────────────────────┐
│  Criar ID do cliente OAuth                              │
│                                                         │
│  Tipo de aplicativo *                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Aplicativo da Web  ← SELECIONE                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Nome *                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ GymManager Web                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  URIs de redirecionamento autorizados                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ https://gym-manager-ten.vercel.app             │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ http://localhost:5500                          │   │
│  └─────────────────────────────────────────────────┘   │
│  [ + ADICIONAR URI ]                                   │
│                                                         │
│           [ CANCELAR ]  [ CRIAR ]                      │
└─────────────────────────────────────────────────────────┘
```

**Importante:** Adicione estas URIs:
- `https://gym-manager-ten.vercel.app` (produção)
- `http://localhost:5500` (desenvolvimento local)

### 5.4 Clique em "CRIAR"

---

## 🚀 Passo 6: Copiar o Client ID

### 6.1 Anote suas credenciais
Após criar, você verá esta tela:

**[PRINT 12: Credenciais criadas]**
```
┌─────────────────────────────────────────────────────────┐
│  ✓ ID do cliente OAuth criado                          │
│                                                         │
│  Seu ID de cliente:                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 123456789-abcdefghijklmnopqrstuvwxyz.apps.     │   │
│  │ googleusercontent.com                             │   │
│  └─────────────────────────────────────────────────┘   │
│  ↑                                                      │
│  COPIE ESTE CÓDIGO COMPLETO!                           │
│                                                         │
│  Sua chave secreta do cliente:                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ••••••••••••••••••••••••••••••••••••••••••••• │   │
│  └─────────────────────────────────────────────────┘   │
│  (Não precisa para login web)                          │
│                                                         │
│                    [ OK ]                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

⚠️ **IMPORTANTE:** Copie o **ID do cliente** completo (termina em `.apps.googleusercontent.com`)

---

## 🚀 Passo 7: Configurar no GymManager Pro

### 7.1 Acesse o sistema
Abra: **https://gym-manager-ten.vercel.app/login.html**

### 7.2 Clique em "Entrar com Google"

**[PRINT 13: Tela de login]**
```
┌─────────────────────────────────────────────────────────┐
│  💪 GymManager Pro                                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [ Entrar ]  [ Criar Conta ]                    │   │
│  │                                                 │   │
│  │  Email:    [________________]                   │   │
│  │  Senha:    [________________]                   │   │
│  │                                                 │   │
│  │  ☑️ Lembrar-me    Esqueceu a senha?            │   │
│  │                                                 │   │
│  │  [      ENTRAR      ]                          │   │
│  │                                                 │   │
│  │  ──────────── ou ────────────                  │   │
│  │                                                 │   │
│  │  [ 🔍 Entrar com Google ]  ← CLIQUE AQUI       │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Cole seu Client ID

**[PRINT 14: Configurar Client ID]**
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Para ativar o login com Google, configure:         │
│                                                         │
│  Cole seu Client ID do Google:                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 123456789-abcdefghijklmnopqrstuvwxyz.apps.     │   │
│  │ googleusercontent.com                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [    ATIVAR LOGIN GOOGLE    ]                         │
│                                                         │
│  Como obter Client ID?                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Cole o Client ID copiado e clique em "ATIVAR LOGIN GOOGLE"

### 7.5 Pronto! O botão do Google aparecerá

**[PRINT 15: Botão Google ativo]**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ──────────── ou ────────────                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔍  Entrar com Google                           │   │
│  └─────────────────────────────────────────────────┘   │
│  ↑ Botão oficial do Google                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Testando o Login

1. Clique no botão **"Entrar com Google"**
2. Selecione sua conta Google
3. Permita as permissões solicitadas
4. Pronto! Você está logado no GymManager Pro!

---

## 🎥 Vídeo Tutorial (Texto)

```
┌─────────────────────────────────────────────────────────┐
│  🎬 VÍDEO: Configurando Login Google em 5 minutos      │
│                                                         │
│  [00:00] Introdução - O que vamos fazer               │
│  [00:45] Passo 1: Criar projeto no Google Cloud       │
│  [02:10] Passo 2: Ativar API de autenticação          │
│  [02:45] Passo 3: Configurar tela de consentimento    │
│  [04:20] Passo 4: Criar credenciais OAuth             │
│  [05:15] Passo 5: Copiar Client ID                    │
│  [05:45] Passo 6: Configurar no GymManager            │
│  [06:30] Testando o login                             │
│  [07:00] Considerações de segurança                   │
│                                                         │
│  [ ▶️ ASSISTIR NO YOUTUBE ]                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ❌ Erros Comuns e Soluções

### Erro: "Missing required parameter: client_id"
**Causa:** Client ID não configurado  
**Solução:** Siga o Passo 7 deste guia

### Erro: "redirect_uri_mismatch"
**Causa:** URL do site não autorizada  
**Solução:** Adicione a URL exata nas credenciais OAuth

### Erro: "access_denied"
**Causa:** Usuário cancelou o login  
**Solução:** Normal, usuário pode tentar novamente

### Erro: "invalid_client"
**Causa:** Client ID incorreto ou projeto excluído  
**Solução:** Verifique se copiou o ID completo

---

## 🔒 Segurança - Boas Práticas

### ✅ Faça:
- ✅ Use HTTPS em produção
- ✅ Adicione apenas URLs necessárias
- ✅ Revogue acesso de usuários antigos
- ✅ Monitore logins suspeitos

### ❌ Não faça:
- ❌ Compartilhe seu Client ID publicamente
- ❌ Commit Client ID no código (use variáveis de ambiente)
- ❌ Deixe a tela de consentimento em "Testing" para produção

---

## 📞 Suporte

Se tiver problemas:

1. 📧 Email: suporte@gymmanager.com
2. 💬 WhatsApp: (11) 99999-9999
3. 📖 Documentação: https://docs.gymmanager.com

---

## 📝 Checklist Final

- [ ] Criei projeto no Google Cloud
- [ ] Ativei Google Identity Toolkit API
- [ ] Configurei tela de consentimento OAuth
- [ ] Adicionei escopos (email, profile, openid)
- [ ] Criei ID do cliente OAuth
- [ ] Adicionei URIs de redirecionamento
- [ ] Copiei o Client ID completo
- [ ] Colei no GymManager Pro
- [ ] Testei o login com sucesso

---

**🎉 Parabéns! Seu sistema agora tem login com Google!**

*Última atualização: 29/04/2024*  
*Versão do guia: 1.0*
