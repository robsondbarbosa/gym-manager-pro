// GymManager Pro - Sistema de Autenticação
// =========================================

// Configuração
const AUTH_CONFIG = {
    TOKEN_KEY: 'gymmanager_token',
    USER_KEY: 'gymmanager_user',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas
};

// Dados iniciais de usuários (em produção, use backend)
const DEFAULT_USERS = [
    {
        id: '1',
        name: 'Administrador',
        email: 'admin@gymmanager.com',
        password: 'admin123', // Em produção: hash
        role: 'admin',
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLogin: null
    },
    {
        id: '2',
        name: 'Recepcionista',
        email: 'recep@gymmanager.com',
        password: 'recep123',
        role: 'recepcionista',
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLogin: null
    }
];

// Roles e permissões
const ROLES = {
    admin: {
        name: 'Administrador',
        permissions: ['*'], // Todas as permissões
        color: 'role-admin'
    },
    recepcionista: {
        name: 'Recepcionista',
        permissions: [
            'dashboard',
            'alunos.view', 'alunos.create', 'alunos.edit',
            'planos.view',
            'pagamentos.view', 'pagamentos.create',
            'checkin',
            'presenca.view'
        ],
        color: 'role-recepcionista'
    },
    instrutor: {
        name: 'Instrutor',
        permissions: [
            'dashboard',
            'alunos.view',
            'presenca.view',
            'checkin'
        ],
        color: 'role-instrutor'
    }
};

// Inicialização
// =============
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se está na página de login
    if (window.location.pathname.includes('login.html')) {
        initLoginPage();
    } else {
        // Verificar autenticação em páginas protegidas
        checkAuth();
    }
});

// Página de Login
// ===============
function initLoginPage() {
    // Verificar se já está logado
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Inicializar usuários padrão se não existirem
    if (!localStorage.getItem('gymmanager_users')) {
        localStorage.setItem('gymmanager_users', JSON.stringify(DEFAULT_USERS));
    }
}

// Alternar entre tabs
function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }

    hideAlert();
}

// Mostrar/esconder formulários
function showForgotPassword() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelector('.auth-tabs').style.display = 'none';
    document.querySelector('.auth-divider').style.display = 'none';
    document.querySelector('.btn-google').style.display = 'none';
    document.getElementById('forgotForm').classList.add('active');
}

function showLogin() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelector('.auth-tabs').style.display = 'flex';
    document.querySelector('.auth-divider').style.display = 'flex';
    document.querySelector('.btn-google').style.display = 'flex';
    document.getElementById('loginForm').classList.add('active');
    hideAlert();
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// Login
// =====
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const btn = document.getElementById('loginBtn');

    // Loading state
    setLoading(btn, true);

    // Simular delay de rede
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('gymmanager_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Atualizar último login
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('gymmanager_users', JSON.stringify(users));

            // Criar sessão
            createSession(user, rememberMe);

            showAlert('success', 'Login realizado com sucesso! Redirecionando...');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert('error', 'Email ou senha incorretos');
            setLoading(btn, false);
        }
    }, 800);
}

// Registro
// ========
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const btn = document.getElementById('registerBtn');

    // Validações
    if (password !== passwordConfirm) {
        showAlert('error', 'As senhas não coincidem');
        return;
    }

    if (password.length < 6) {
        showAlert('error', 'A senha deve ter no mínimo 6 caracteres');
        return;
    }

    setLoading(btn, true);

    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('gymmanager_users') || '[]');

        // Verificar se email já existe
        if (users.find(u => u.email === email)) {
            showAlert('error', 'Este email já está cadastrado');
            setLoading(btn, false);
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // Em produção: hash
            role: 'recepcionista', // Padrão para novos usuários
            avatar: null,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users.push(newUser);
        localStorage.setItem('gymmanager_users', JSON.stringify(users));

        showAlert('success', 'Conta criada com sucesso! Faça login.');

        setTimeout(() => {
            switchTab('login');
            document.getElementById('loginEmail').value = email;
            setLoading(btn, false);
        }, 1500);
    }, 800);
}

// Recuperação de senha
// ====================
function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value;
    const btn = document.getElementById('forgotBtn');

    setLoading(btn, true);

    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('gymmanager_users') || '[]');
        const user = users.find(u => u.email === email);

        if (user) {
            // Em produção: enviar email real
            showAlert('success', 'Instruções enviadas para seu email!');

            setTimeout(() => {
                showLogin();
                setLoading(btn, false);
            }, 2000);
        } else {
            showAlert('error', 'Email não encontrado');
            setLoading(btn, false);
        }
    }, 1000);
}

// Google Login (simulado)
// =======================
function loginWithGoogle() {
    showAlert('error', 'Login com Google requer configuração de API. Use email e senha.');
}

// Sessão
// ======
function createSession(user, rememberMe) {
    const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: new Date().toISOString(),
        expiresAt: rememberMe
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
            : new Date(Date.now() + AUTH_CONFIG.SESSION_DURATION).toISOString()
    };

    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, btoa(JSON.stringify(session)));
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(session));
}

function getSession() {
    const sessionStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    if (!sessionStr) return null;

    try {
        const session = JSON.parse(sessionStr);

        // Verificar expiração
        if (new Date(session.expiresAt) < new Date()) {
            logout();
            return null;
        }

        return session;
    } catch (e) {
        return null;
    }
}

function isAuthenticated() {
    return getSession() !== null;
}

function logout() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    window.location.href = 'login.html';
}

// Google Login
// ============
function handleGoogleLogin(response) {
    try {
        // Decodificar o token JWT
        const credential = response.credential;
        const payload = JSON.parse(atob(credential.split('.')[1]));
        
        // Dados do usuário Google
        const googleUser = {
            id: 'google_' + payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: 'google'
        };
        
        // Verificar se usuário existe no sistema
        const users = JSON.parse(localStorage.getItem('gymmanager_users') || '[]');
        let user = users.find(u => u.email === googleUser.email);
        
        if (!user) {
            // Criar novo usuário com role padrão
            user = {
                id: googleUser.id,
                name: googleUser.name,
                email: googleUser.email,
                avatar: googleUser.picture,
                role: 'recepcionista', // Padrão para novos usuários Google
                provider: 'google',
                password: null, // Não precisa de senha para login Google
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            users.push(user);
            localStorage.setItem('gymmanager_users', JSON.stringify(users));
            
            showAlert('success', `Bem-vindo, ${user.name}! Sua conta foi criada.`);
        } else {
            // Atualizar último login
            user.lastLogin = new Date().toISOString();
            if (googleUser.picture) user.avatar = googleUser.picture;
            localStorage.setItem('gymmanager_users', JSON.stringify(users));
            
            showAlert('success', `Bem-vindo de volta, ${user.name}!`);
        }
        
        // Criar sessão
        createSession(user, true);
        
        // Redirecionar após breve delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro no login Google:', error);
        showAlert('error', 'Erro ao processar login do Google. Tente novamente.');
    }
}

// Configuração temporária do Client ID
function showGoogleSetup() {
    document.getElementById('googleSetup').style.display = 'block';
    document.getElementById('googleFallback').style.display = 'none';
}

function setTempClientId() {
    const clientId = document.getElementById('tempClientId').value.trim();
    if (!clientId) {
        showAlert('error', 'Digite um Client ID válido');
        return;
    }
    
    // Salvar no localStorage temporariamente
    localStorage.setItem('gymmanager_google_client_id', clientId);
    
    // Recarregar a página para aplicar
    window.location.reload();
}

// Verificar se há Client ID salvo ao carregar
function initGoogleAuth() {
    const savedClientId = localStorage.getItem('gymmanager_google_client_id');
    const onloadDiv = document.getElementById('g_id_onload');
    
    if (savedClientId && onloadDiv) {
        onloadDiv.setAttribute('data-client_id', savedClientId);
        onloadDiv.style.display = 'block';
    } else {
        // Mostrar fallback se não configurado
        const fallback = document.getElementById('googleFallback');
        if (fallback) fallback.style.display = 'flex';
    }
}

// Chamar na inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('g_id_onload')) {
        initGoogleAuth();
    }
});

// Exportar função global para o callback do Google
window.handleGoogleLogin = handleGoogleLogin;

// Verificação de autenticação
// ===========================
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Atualizar UI com dados do usuário
    updateUserUI();

    // Verificar permissões
    checkPermissions();
}

function updateUserUI() {
    const session = getSession();
    if (!session) return;

    // Atualizar nome no sidebar
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => el.textContent = session.name);

    // Atualizar avatar
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        el.textContent = session.name.charAt(0).toUpperCase();
    });

    // Atualizar role
    const roleInfo = ROLES[session.role];
    const roleElements = document.querySelectorAll('.user-role');
    roleElements.forEach(el => {
        el.textContent = roleInfo ? roleInfo.name : session.role;
    });
}

// Permissões
// ==========
function checkPermissions() {
    const session = getSession();
    if (!session) return;

    const role = ROLES[session.role];
    if (!role) return;

    // Ocultar elementos baseado nas permissões
    const permissions = role.permissions;

    // Verificar cada item de navegação
    document.querySelectorAll('[data-permission]').forEach(el => {
        const required = el.dataset.permission;
        if (!hasPermission(required)) {
            el.style.display = 'none';
        }
    });

    // Verificar botões de ação
    document.querySelectorAll('[data-require-permission]').forEach(el => {
        const required = el.dataset.requirePermission;
        if (!hasPermission(required)) {
            el.style.display = 'none';
        }
    });
}

function hasPermission(permission) {
    const session = getSession();
    if (!session) return false;

    const role = ROLES[session.role];
    if (!role) return false;

    // Admin tem todas as permissões
    if (role.permissions.includes('*')) return true;

    // Verificar permissão específica
    if (role.permissions.includes(permission)) return true;

    // Verificar permissão pai (ex: 'alunos' permite 'alunos.view', 'alunos.create')
    const parentPermission = permission.split('.')[0];
    if (role.permissions.includes(parentPermission)) return true;

    return false;
}

function requirePermission(permission) {
    if (!hasPermission(permission)) {
        showAccessDenied();
        return false;
    }
    return true;
}

function showAccessDenied() {
    const content = document.getElementById('content');
    if (content) {
        content.innerHTML = `
            <div class="access-denied">
                <div class="access-denied-icon">🚫</div>
                <h2>Acesso Negado</h2>
                <p>Você não tem permissão para acessar esta funcionalidade.</p>
                <button class="btn btn-primary" onclick="mudarPagina('dashboard')">Voltar ao Dashboard</button>
            </div>
        `;
    }
}

// Gerenciamento de Usuários (Admin)
// =================================
function getAllUsers() {
    if (!hasPermission('usuarios')) return [];
    return JSON.parse(localStorage.getItem('gymmanager_users') || '[]');
}

function createUser(userData) {
    if (!hasPermission('usuarios.create')) {
        showAlert('error', 'Sem permissão para criar usuários');
        return false;
    }

    const users = getAllUsers();

    if (users.find(u => u.email === userData.email)) {
        showAlert('error', 'Email já cadastrado');
        return false;
    }

    const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };

    users.push(newUser);
    localStorage.setItem('gymmanager_users', JSON.stringify(users));

    return true;
}

function updateUser(userId, userData) {
    if (!hasPermission('usuarios.edit')) {
        showAlert('error', 'Sem permissão para editar usuários');
        return false;
    }

    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return false;

    users[index] = { ...users[index], ...userData };
    localStorage.setItem('gymmanager_users', JSON.stringify(users));

    return true;
}

function deleteUser(userId) {
    if (!hasPermission('usuarios.delete')) {
        showAlert('error', 'Sem permissão para excluir usuários');
        return false;
    }

    // Não permitir excluir a si mesmo
    const session = getSession();
    if (session && session.userId === userId) {
        showAlert('error', 'Não é possível excluir seu próprio usuário');
        return false;
    }

    const users = getAllUsers().filter(u => u.id !== userId);
    localStorage.setItem('gymmanager_users', JSON.stringify(users));

    return true;
}

function changePassword(currentPassword, newPassword) {
    const session = getSession();
    if (!session) return false;

    const users = getAllUsers();
    const user = users.find(u => u.id === session.userId);

    if (!user || user.password !== currentPassword) {
        showAlert('error', 'Senha atual incorreta');
        return false;
    }

    user.password = newPassword;
    localStorage.setItem('gymmanager_users', JSON.stringify(users));

    showAlert('success', 'Senha alterada com sucesso!');
    return true;
}

// UI Helpers
// ==========
function showAlert(type, message) {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${type}">
            <span>${type === 'error' ? '⚠️' : '✅'}</span>
            <span>${message}</span>
        </div>
    `;

    // Auto-hide após 5 segundos
    setTimeout(() => hideAlert(), 5000);
}

function hideAlert() {
    const container = document.getElementById('alertContainer');
    if (container) container.innerHTML = '';
}

function setLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.innerHTML = '<div class="spinner"></div>';
    } else {
        button.disabled = false;
        button.innerHTML = '<span>' + button.dataset.originalText || 'Enviar' + '</span>';
    }
}

// Toggle User Menu
// ================
function toggleUserMenu() {
    const menu = document.querySelector('.user-menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.user-menu');
    if (menu && !menu.contains(e.target)) {
        menu.classList.remove('open');
    }
});

// Exportar funções para uso global
window.auth = {
    isAuthenticated,
    getSession,
    hasPermission,
    requirePermission,
    logout,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    ROLES
};
