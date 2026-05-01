// GymManager Pro - Sistema Completo de Gestão
// ============================================

// Verificar autenticação antes de tudo
if (!window.location.pathname.includes('login.html')) {
    if (typeof auth !== 'undefined' && !auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Dados iniciais (simulando banco de dados)
const dadosIniciais = {
    alunos: [
        {
            id: '1',
            nome: 'João Silva',
            telefone: '(11) 98765-4321',
            email: 'joao@email.com',
            cpf: '123.456.789-00',
            planoId: '1',
            dataInicio: '2024-01-15',
            status: 'active',
            presencas: 12,
            ultimoPagamento: '2024-04-15',
            proximoPagamento: '2024-05-15'
        },
        {
            id: '2',
            nome: 'Maria Santos',
            telefone: '(11) 91234-5678',
            email: 'maria@email.com',
            cpf: '987.654.321-00',
            planoId: '2',
            dataInicio: '2024-02-01',
            status: 'active',
            presencas: 8,
            ultimoPagamento: '2024-04-01',
            proximoPagamento: '2024-05-01'
        },
        {
            id: '3',
            nome: 'Pedro Oliveira',
            telefone: '(11) 95678-1234',
            email: 'pedro@email.com',
            cpf: '456.789.123-00',
            planoId: '1',
            dataInicio: '2024-03-10',
            status: 'pending',
            presencas: 5,
            ultimoPagamento: null,
            proximoPagamento: '2024-04-10'
        }
    ],
    planos: [
        {
            id: '1',
            nome: 'Básico',
            valor: 99.90,
            periodicidade: 'mensal',
            beneficios: ['Acesso à musculação', 'Horário comercial', 'Vestiário']
        },
        {
            id: '2',
            nome: 'Premium',
            valor: 149.90,
            periodicidade: 'mensal',
            beneficios: ['Acesso ilimitado', 'Todas as aulas', 'Personal trainer 2x/semana', 'Vestiário premium']
        },
        {
            id: '3',
            nome: 'VIP',
            valor: 249.90,
            periodicidade: 'mensal',
            beneficios: ['Acesso 24h', 'Todas as aulas', 'Personal trainer ilimitado', 'Nutricionista', 'Fisioterapia']
        }
    ],
    pagamentos: [],
    presencas: [
        { id: '1', alunoId: '1', data: new Date().toISOString(), metodo: 'QR Code' },
        { id: '2', alunoId: '2', data: new Date(Date.now() - 3600000).toISOString(), metodo: 'QR Code' }
    ],
    configuracoes: {
        nomeAcademia: 'FitLife Academia',
        telefone: '(11) 3333-4444',
        endereco: 'Rua das Flores, 123 - São Paulo, SP'
    }
};

// Estado do aplicativo
let appState = {
    alunos: [],
    planos: [],
    pagamentos: [],
    presencas: [],
    configuracoes: {},
    paginaAtual: 'dashboard'
};

// Inicialização
// =============
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    inicializarNavegacao();
    inicializarDashboard();
    atualizarInterface();
    
    // Definir data atual nos inputs
    document.getElementById('alunoDataInicio').valueAsDate = new Date();
    document.getElementById('filtroData').valueAsDate = new Date();
});

// Carregar/Salvar Dados
// =====================
function carregarDados() {
    const dados = localStorage.getItem('gymmanager_dados');
    if (dados) {
        try {
            const parsed = JSON.parse(dados);
            // Verificar se todos os campos necessários existem
            if (!parsed.planos || parsed.planos.length === 0) {
                parsed.planos = JSON.parse(JSON.stringify(dadosIniciais.planos));
            }
            if (!parsed.alunos) parsed.alunos = [];
            if (!parsed.pagamentos) parsed.pagamentos = [];
            if (!parsed.presencas) parsed.presencas = [];
            if (!parsed.configuracoes) parsed.configuracoes = dadosIniciais.configuracoes;
            
            appState = parsed;
            salvarDados();
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
            appState = JSON.parse(JSON.stringify(dadosIniciais));
            salvarDados();
        }
    } else {
        appState = JSON.parse(JSON.stringify(dadosIniciais));
        salvarDados();
    }
}

function salvarDados() {
    localStorage.setItem('gymmanager_dados', JSON.stringify(appState));
}

// Navegação
// =========
function inicializarNavegacao() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pagina = item.dataset.page;
            mudarPagina(pagina);
            
            // Atualizar active
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function mudarPagina(pagina) {
    appState.paginaAtual = pagina;
    
    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    // Mostrar página atual
    const pageElement = document.getElementById(`page-${pagina}`);
    if (pageElement) {
        pageElement.style.display = 'block';
        pageElement.classList.add('animate-fade-in');
    }
    
    // Carregar conteúdo específico
    switch(pagina) {
        case 'dashboard':
            atualizarDashboard();
            break;
        case 'alunos':
            renderizarAlunos();
            break;
        case 'planos':
            renderizarPlanos();
            break;
        case 'pagamentos':
            renderizarPagamentos();
            break;
        case 'checkin':
            inicializarCheckin();
            break;
        case 'presenca':
            renderizarPresencas();
            break;
        case 'relatorios':
            gerarRelatorio();
            break;
        case 'usuarios':
            renderizarUsuarios();
            break;
        case 'configuracoes':
            carregarConfiguracoes();
            break;
    }
}

// Dashboard
// =========
function inicializarDashboard() {
    atualizarDashboard();
    inicializarGraficoReceita();
}

function atualizarDashboard() {
    const totalAlunos = appState.alunos.length;
    const alunosAtivos = appState.alunos.filter(a => a.status === 'active').length;
    const receita = calcularReceitaMensal();
    const presencasHoje = appState.presencas.filter(p => {
        const data = new Date(p.data);
        const hoje = new Date();
        return data.toDateString() === hoje.toDateString();
    }).length;
    const pendentes = appState.alunos.filter(a => {
        if (!a.proximoPagamento) return false;
        const proximo = new Date(a.proximoPagamento);
        return proximo < new Date() && a.status !== 'inactive';
    }).length;
    
    document.getElementById('statTotalAlunos').textContent = totalAlunos;
    document.getElementById('statReceita').textContent = formatarMoeda(receita);
    document.getElementById('statPresencas').textContent = presencasHoje;
    document.getElementById('statPendentes').textContent = pendentes;
    document.getElementById('badgePagamentos').textContent = pendentes;
    
    // Top alunos
    renderizarTopAlunos();
}

function calcularReceitaMensal() {
    return appState.alunos
        .filter(a => a.status === 'active')
        .reduce((total, aluno) => {
            const plano = appState.planos.find(p => p.id === aluno.planoId);
            return total + (plano ? plano.valor : 0);
        }, 0);
}

function renderizarTopAlunos() {
    const topAlunos = [...appState.alunos]
        .sort((a, b) => b.presencas - a.presencas)
        .slice(0, 5);
    
    const container = document.getElementById('topAlunosList');
    container.innerHTML = topAlunos.map((aluno, index) => `
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${index < 3 ? 'var(--primary)' : 'var(--bg-hover)'}; 
                        display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
                ${index + 1}
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 500;">${aluno.nome}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${aluno.presencas} presenças</div>
            </div>
            <div style="color: var(--success); font-weight: 600;">🔥</div>
        </div>
    `).join('');
}

function inicializarGraficoReceita() {
    const ctx = document.getElementById('chartReceita');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Receita',
                data: [12000, 13500, 12800, 15200, 14800, 16500],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Despesas',
                data: [8000, 8500, 8200, 9000, 8800, 9200],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Alunos
// ======
function renderizarAlunos() {
    const tbody = document.getElementById('tabelaAlunos');
    const searchTerm = document.getElementById('searchAlunos')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    
    let alunos = [...appState.alunos];
    
    if (searchTerm) {
        alunos = alunos.filter(a => 
            a.nome.toLowerCase().includes(searchTerm) ||
            a.email?.toLowerCase().includes(searchTerm) ||
            a.telefone.includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        alunos = alunos.filter(a => a.status === statusFilter);
    }
    
    tbody.innerHTML = alunos.map(aluno => {
        const plano = appState.planos.find(p => p.id === aluno.planoId);
        const statusClass = aluno.status === 'active' ? 'active' : 
                           aluno.status === 'inactive' ? 'inactive' : 'pending';
        const statusText = aluno.status === 'active' ? 'Ativo' : 
                          aluno.status === 'inactive' ? 'Inativo' : 'Pendente';
        
        const proximoPag = aluno.proximoPagamento ? new Date(aluno.proximoPagamento) : null;
        const isOverdue = proximoPag && proximoPag < new Date() && aluno.status !== 'inactive';
        
        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); 
                                    display: flex; align-items: center; justify-content: center; font-weight: 600;">
                            ${aluno.nome.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight: 500;">${aluno.nome}</div>
                            <div style="font-size: 12px; color: var(--text-secondary);">${aluno.telefone}</div>
                        </div>
                    </div>
                </td>
                <td>${plano ? plano.nome : '-'}</td>
                <td>
                    <div style="color: ${isOverdue ? 'var(--danger)' : 'inherit'};">
                        ${aluno.proximoPagamento ? formatarData(aluno.proximoPagamento) : '-'}
                        ${isOverdue ? ' ⚠️' : ''}
                    </div>
                </td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${aluno.presencas || 0}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editarAluno('${aluno.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="excluirAluno('${aluno.id}')">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Atualizar select de planos no modal
    const selectPlano = document.getElementById('alunoPlano');
    if (selectPlano) {
        selectPlano.innerHTML = '<option value="">Selecione...</option>' +
            appState.planos.map(p => `<option value="${p.id}">${p.nome} - ${formatarMoeda(p.valor)}/mês</option>
            `).join('');
    }
}

function salvarAluno() {
    const id = document.getElementById('alunoId').value;
    const alunoData = {
        nome: document.getElementById('alunoNome').value,
        telefone: document.getElementById('alunoTelefone').value,
        email: document.getElementById('alunoEmail').value,
        cpf: document.getElementById('alunoCPF').value,
        planoId: document.getElementById('alunoPlano').value,
        dataInicio: document.getElementById('alunoDataInicio').value,
        observacoes: document.getElementById('alunoObservacoes').value,
        status: 'active',
        presencas: 0
    };
    
    // Calcular próximo pagamento
    const dataInicio = new Date(alunoData.dataInicio);
    const proximoPag = new Date(dataInicio);
    proximoPag.setMonth(proximoPag.getMonth() + 1);
    alunoData.proximoPagamento = proximoPag.toISOString().split('T')[0];
    
    if (id) {
        // Editar
        const index = appState.alunos.findIndex(a => a.id === id);
        if (index !== -1) {
            appState.alunos[index] = { ...appState.alunos[index], ...alunoData };
        }
    } else {
        // Novo
        alunoData.id = Date.now().toString();
        appState.alunos.push(alunoData);
        
        // Criar pagamento pendente
        criarPagamento(alunoData);
    }
    
    salvarDados();
    closeModal('aluno');
    renderizarAlunos();
    atualizarDashboard();
}

function editarAluno(id) {
    const aluno = appState.alunos.find(a => a.id === id);
    if (!aluno) return;
    
    document.getElementById('alunoId').value = aluno.id;
    document.getElementById('alunoNome').value = aluno.nome;
    document.getElementById('alunoTelefone').value = aluno.telefone;
    document.getElementById('alunoEmail').value = aluno.email || '';
    document.getElementById('alunoCPF').value = aluno.cpf || '';
    document.getElementById('alunoDataInicio').value = aluno.dataInicio;
    document.getElementById('alunoObservacoes').value = aluno.observacoes || '';
    
    document.getElementById('modalAlunoTitle').textContent = 'Editar Aluno';
    openModal('aluno', aluno.planoId);
}

function excluirAluno(id) {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
    
    appState.alunos = appState.alunos.filter(a => a.id !== id);
    salvarDados();
    renderizarAlunos();
    atualizarDashboard();
}

// Planos
// ======
function renderizarPlanos() {
    const container = document.getElementById('planosCards');
    
    container.innerHTML = appState.planos.map(plano => {
        const alunosNoPlano = appState.alunos.filter(a => a.planoId === plano.id && a.status === 'active').length;
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${plano.nome}</h3>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">
                        ${formatarMoeda(plano.valor)}
                        <span style="font-size: 14px; color: var(--text-secondary);">/mês</span>
                    </div>
                </div>
                <div class="card-body">
                    <div style="margin-bottom: 16px;">
                        <span class="status active">${alunosNoPlano} alunos</span>
                    </div>
                    <ul style="list-style: none; margin-bottom: 20px;">
                        ${plano.beneficios.map(b => `
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px;">
                                <span style="color: var(--success);">✓</span> ${b}
                            </li>
                        `).join('')}
                    </ul>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" style="flex: 1;" onclick="editarPlano('${plano.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirPlano('${plano.id}')">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function salvarPlano() {
    const id = document.getElementById('planoId').value;
    const planoData = {
        nome: document.getElementById('planoNome').value,
        valor: parseFloat(document.getElementById('planoValor').value),
        periodicidade: document.getElementById('planoPeriodicidade').value,
        beneficios: document.getElementById('planoBeneficios').value.split('\n').filter(b => b.trim())
    };
    
    if (id) {
        // Editar plano existente
        const index = appState.planos.findIndex(p => p.id === id);
        if (index !== -1) {
            appState.planos[index] = { ...appState.planos[index], ...planoData };
        }
    } else {
        // Criar novo plano
        planoData.id = Date.now().toString();
        appState.planos.push(planoData);
    }
    
    salvarDados();
    closeModal('plano');
    renderizarPlanos();
}

function editarPlano(id) {
    const plano = appState.planos.find(p => p.id === id);
    if (!plano) return;
    
    document.getElementById('planoId').value = plano.id;
    document.getElementById('planoNome').value = plano.nome;
    document.getElementById('planoValor').value = plano.valor;
    document.getElementById('planoPeriodicidade').value = plano.periodicidade || 'mensal';
    document.getElementById('planoBeneficios').value = plano.beneficios.join('\n');
    document.getElementById('modalPlanoTitle').textContent = 'Editar Plano';
    
    openModal('plano');
}

function excluirPlano(id) {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;
    
    const alunosNoPlano = appState.alunos.filter(a => a.planoId === id).length;
    if (alunosNoPlano > 0) {
        alert(`Não é possível excluir. Existem ${alunosNoPlano} alunos neste plano.`);
        return;
    }
    
    appState.planos = appState.planos.filter(p => p.id !== id);
    salvarDados();
    renderizarPlanos();
}

// Pagamentos
// ==========
function criarPagamento(aluno) {
    const plano = appState.planos.find(p => p.id === aluno.planoId);
    if (!plano) return;
    
    const pagamento = {
        id: Date.now().toString(),
        alunoId: aluno.id,
        planoId: aluno.planoId,
        valor: plano.valor,
        vencimento: aluno.proximoPagamento,
        status: 'pending',
        dataPagamento: null
    };
    
    appState.pagamentos.push(pagamento);
}

function renderizarPagamentos() {
    const tbody = document.getElementById('tabelaPagamentos');
    
    // Calcular totais
    const recebidos = appState.pagamentos
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.valor, 0);
    const pendentes = appState.pagamentos
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.valor, 0);
    const atrasados = appState.pagamentos
        .filter(p => p.status === 'pending' && new Date(p.vencimento) < new Date())
        .reduce((sum, p) => sum + p.valor, 0);
    
    document.getElementById('pagRecebidos').textContent = formatarMoeda(recebidos);
    document.getElementById('pagPendentes').textContent = formatarMoeda(pendentes);
    document.getElementById('pagAtrasados').textContent = formatarMoeda(atrasados);
    
    // Renderizar tabela
    const pagamentosOrdenados = [...appState.pagamentos].sort((a, b) => {
        return new Date(a.vencimento) - new Date(b.vencimento);
    });
    
    tbody.innerHTML = pagamentosOrdenados.map(pag => {
        const aluno = appState.alunos.find(a => a.id === pag.alunoId);
        const plano = appState.planos.find(p => p.id === pag.planoId);
        const isOverdue = new Date(pag.vencimento) < new Date() && pag.status === 'pending';
        
        return `
            <tr>
                <td>${aluno ? aluno.nome : 'Desconhecido'}</td>
                <td>${plano ? plano.nome : '-'}</td>
                <td>${formatarMoeda(pag.valor)}</td>
                <td style="color: ${isOverdue ? 'var(--danger)' : 'inherit'};">
                    ${formatarData(pag.vencimento)}
                </td>
                <td>
                    <span class="status ${pag.status === 'paid' ? 'active' : isOverdue ? 'overdue' : 'pending'}">
                        ${pag.status === 'paid' ? 'Pago' : isOverdue ? 'Atrasado' : 'Pendente'}
                    </span>
                </td>
                <td>
                    ${pag.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="registrarPagamento('${pag.id}')">Registrar</button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
}

function registrarPagamento(pagamentoId) {
    const pagamento = appState.pagamentos.find(p => p.id === pagamentoId);
    if (!pagamento) return;
    
    pagamento.status = 'paid';
    pagamento.dataPagamento = new Date().toISOString().split('T')[0];
    
    // Atualizar aluno
    const aluno = appState.alunos.find(a => a.id === pagamento.alunoId);
    if (aluno) {
        aluno.ultimoPagamento = pagamento.dataPagamento;
        const proximo = new Date();
        proximo.setMonth(proximo.getMonth() + 1);
        aluno.proximoPagamento = proximo.toISOString().split('T')[0];
        
        // Criar próximo pagamento
        criarPagamento(aluno);
    }
    
    salvarDados();
    renderizarPagamentos();
    atualizarDashboard();
}

// Check-in QR Code
// ================
function inicializarCheckin() {
    const select = document.getElementById('selectAlunoQR');
    select.innerHTML = '<option value="">Escolha um aluno...</option>' +
        appState.alunos
            .filter(a => a.status === 'active')
            .map(a => `<option value="${a.id}">${a.nome}</option>
            `).join('');
    
    select.onchange = gerarQRCode;
}

function gerarQRCode() {
    const alunoId = document.getElementById('selectAlunoQR').value;
    const container = document.getElementById('qrCodeContainer');
    
    if (!alunoId) {
        container.style.display = 'none';
        return;
    }
    
    const aluno = appState.alunos.find(a => a.id === alunoId);
    if (!aluno) return;
    
    document.getElementById('qrAlunoNome').textContent = aluno.nome;
    container.style.display = 'block';
    
    // Gerar QR Code
    const qrDiv = document.getElementById('qrcode');
    qrDiv.innerHTML = '';
    
    new QRCode(qrDiv, {
        text: alunoId,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

function simularCheckin() {
    const alunoId = document.getElementById('qrInput').value.trim();
    const resultDiv = document.getElementById('checkinResult');
    
    if (!alunoId) {
        resultDiv.innerHTML = '<div style="color: var(--danger);">⚠️ Digite um ID válido</div>';
        return;
    }
    
    const aluno = appState.alunos.find(a => a.id === alunoId);
    if (!aluno) {
        resultDiv.innerHTML = '<div style="color: var(--danger);">❌ Aluno não encontrado</div>';
        return;
    }
    
    // Registrar presença
    const presenca = {
        id: Date.now().toString(),
        alunoId: aluno.id,
        data: new Date().toISOString(),
        metodo: 'QR Code'
    };
    
    appState.presencas.push(presenca);
    aluno.presencas = (aluno.presencas || 0) + 1;
    
    salvarDados();
    
    resultDiv.innerHTML = `
        <div style="background: rgba(34, 197, 94, 0.15); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
            <div style="font-size: 18px; font-weight: 600; color: var(--success);">Check-in realizado!</div>
            <div style="margin-top: 8px; color: var(--text-secondary);">Bem-vindo, ${aluno.nome}!</div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--text-muted);">
                ${new Date().toLocaleString('pt-BR')}
            </div>
        </div>
    `;
    
    document.getElementById('qrInput').value = '';
    atualizarDashboard();
}

function imprimirQR() {
    window.print();
}

// Presenças
// =========
function renderizarPresencas() {
    const tbody = document.getElementById('tabelaPresencas');
    const dataFiltro = document.getElementById('filtroData').value;
    
    let presencas = [...appState.presencas].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
    );
    
    if (dataFiltro) {
        const data = new Date(dataFiltro);
        presencas = presencas.filter(p => {
            const pData = new Date(p.data);
            return pData.toDateString() === data.toDateString();
        });
    }
    
    tbody.innerHTML = presencas.slice(0, 50).map(p => {
        const aluno = appState.alunos.find(a => a.id === p.alunoId);
        const plano = aluno ? appState.planos.find(pl => pl.id === aluno.planoId) : null;
        
        return `
            <tr>
                <td>${formatarDataHora(p.data)}</td>
                <td>${aluno ? aluno.nome : 'Desconhecido'}</td>
                <td>${plano ? plano.nome : '-'}</td>
                <td><span class="status active">${p.metodo}</span></td>
            </tr>
        `;
    }).join('');
}

// Relatórios
// ==========
function gerarRelatorio() {
    const periodo = parseInt(document.getElementById('relatorioPeriodo').value);
    const tipo = document.getElementById('relatorioTipo').value;
    const container = document.getElementById('relatorioContent');
    
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - periodo);
    
    let html = '';
    
    if (tipo === 'financeiro') {
        const pagamentosNoPeriodo = appState.pagamentos.filter(p => {
            const data = new Date(p.dataPagamento || p.vencimento);
            return data >= dataInicio;
        });
        
        const recebido = pagamentosNoPeriodo
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.valor, 0);
        const pendente = pagamentosNoPeriodo
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.valor, 0);
        
        html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Resumo Financeiro</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
                        <div style="text-align: center; padding: 20px; background: rgba(34, 197, 94, 0.1); border-radius: 8px;">
                            <div style="font-size: 32px; font-weight: 700; color: var(--success);">${formatarMoeda(recebido)}</div>
                            <div style="color: var(--text-secondary);">Recebido</div>
                        </div>
                        <div style="text-align: center; padding: 20px; background: rgba(245, 158, 11, 0.1); border-radius: 8px;">
                            <div style="font-size: 32px; font-weight: 700; color: var(--warning);">${formatarMoeda(pendente)}</div>
                            <div style="color: var(--text-secondary);">Pendente</div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="exportarCSV('financeiro')">📥 Exportar CSV</button>
                </div>
            </div>
        `;
    } else if (tipo === 'presenca') {
        const presencasNoPeriodo = appState.presencas.filter(p => {
            const data = new Date(p.data);
            return data >= dataInicio;
        });
        
        const totalPresencas = presencasNoPeriodo.length;
        const mediaPorDia = totalPresencas / periodo;
        
        html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Resumo de Presenças</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
                        <div style="text-align: center; padding: 20px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                            <div style="font-size: 32px; font-weight: 700; color: var(--primary);">${totalPresencas}</div>
                            <div style="color: var(--text-secondary);">Total de Presenças</div>
                        </div>
                        <div style="text-align: center; padding: 20px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                            <div style="font-size: 32px; font-weight: 700; color: var(--primary);">${mediaPorDia.toFixed(1)}</div>
                            <div style="color: var(--text-secondary);">Média por Dia</div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="exportarCSV('presenca')">📥 Exportar CSV</button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function exportarCSV(tipo) {
    let csv = '';
    let filename = '';
    
    if (tipo === 'financeiro') {
        csv = 'Aluno,Plano,Valor,Vencimento,Status\n';
        appState.pagamentos.forEach(p => {
            const aluno = appState.alunos.find(a => a.id === p.alunoId);
            const plano = appState.planos.find(pl => pl.id === p.planoId);
            csv += `${aluno?.nome || ''},${plano?.nome || ''},${p.valor},${p.vencimento},${p.status}\n`;
        });
        filename = 'relatorio_financeiro.csv';
    } else if (tipo === 'presenca') {
        csv = 'Data,Aluno,Plano,Metodo\n';
        appState.presencas.forEach(p => {
            const aluno = appState.alunos.find(a => a.id === p.alunoId);
            const plano = aluno ? appState.planos.find(pl => pl.id === aluno.planoId) : null;
            csv += `${p.data},${aluno?.nome || ''},${plano?.nome || ''},${p.metodo}\n`;
        });
        filename = 'relatorio_presencas.csv';
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

// Configurações
// =============
function carregarConfiguracoes() {
    document.getElementById('configNome').value = appState.configuracoes.nomeAcademia;
    document.getElementById('configTelefone').value = appState.configuracoes.telefone;
    document.getElementById('configEndereco').value = appState.configuracoes.endereco;
}

function salvarConfiguracoes() {
    appState.configuracoes = {
        nomeAcademia: document.getElementById('configNome').value,
        telefone: document.getElementById('configTelefone').value,
        endereco: document.getElementById('configEndereco').value
    };
    
    salvarDados();
    alert('Configurações salvas com sucesso!');
}

// Utilitários
// ===========
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
    return new Date(data).toLocaleString('pt-BR');
}

function atualizarInterface() {
    // Atualizar título da página
    document.title = `${appState.configuracoes.nomeAcademia} - GymManager Pro`;
}

// Modais
// ======
function openModal(tipo, planoId = null) {
    // Garantir que os dados estejam carregados antes de abrir o modal
    if (!appState.planos || appState.planos.length === 0) {
        carregarDados();
    }
    
    document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).classList.add('active');
    
    if (tipo === 'aluno') {
        document.getElementById('formAluno').reset();
        document.getElementById('alunoId').value = '';
        document.getElementById('modalAlunoTitle').textContent = 'Novo Aluno';
        document.getElementById('alunoDataInicio').valueAsDate = new Date();
        
        // Popular select de planos - com delay para garantir que o DOM está pronto
        setTimeout(() => {
            const selectPlano = document.getElementById('alunoPlano');
            if (selectPlano) {
                // Limpar opções existentes
                selectPlano.innerHTML = '';
                
                // Adicionar opção padrão
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecione...';
                selectPlano.appendChild(defaultOption);
                
                // Adicionar planos
                if (appState.planos && appState.planos.length > 0) {
                    appState.planos.forEach(p => {
                        const option = document.createElement('option');
                        option.value = p.id;
                        option.textContent = `${p.nome} - ${formatarMoeda(p.valor)}/mês`;
                        selectPlano.appendChild(option);
                    });
                    
                    // Se for edição, selecionar o plano correto
                    if (planoId) {
                        selectPlano.value = planoId;
                    }
                } else {
                    console.error('Nenhum plano disponível no appState:', appState);
                }
            }
        }, 100);
    }
    
    if (tipo === 'plano') {
        document.getElementById('formPlano').reset();
        document.getElementById('planoId').value = '';
        document.getElementById('modalPlanoTitle').textContent = 'Novo Plano';
    }
}

function closeModal(tipo) {
    document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).classList.remove('active');
}

// Event Listeners para busca
// ===========================
document.getElementById('searchAlunos')?.addEventListener('input', renderizarAlunos);
document.getElementById('filterStatus')?.addEventListener('change', renderizarAlunos);
document.getElementById('filtroData')?.addEventListener('change', renderizarPresencas);

// Fechar modais ao clicar fora
// =============================
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Funções de Autenticação
// =======================
function handleChangePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmNewPassword').value;
    
    if (newPass !== confirm) {
        alert('As senhas não coincidem');
        return;
    }
    
    if (auth.changePassword(current, newPass)) {
        closeModal('changePassword');
        document.getElementById('formChangePassword').reset();
    }
}

// Página de Usuários
// ==================
function renderizarUsuarios() {
    if (!auth.hasPermission('usuarios')) {
        showAccessDenied();
        return;
    }
    
    const content = document.getElementById('content');
    const users = auth.getAllUsers();
    
    content.innerHTML = `
        <div class="page-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="page-title">Usuários</h1>
                    <p class="page-subtitle">Gerencie os usuários do sistema</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('usuario')" data-require-permission="usuarios.create">
                    <span>+</span> Novo Usuário
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Lista de Usuários</h3>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Função</th>
                                <th>Último Acesso</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => {
                                const roleInfo = auth.ROLES[user.role];
                                return `
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 12px;">
                                                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); 
                                                            display: flex; align-items: center; justify-content: center; font-weight: 600;">
                                                    ${user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div style="font-weight: 500;">${user.name}</div>
                                            </div>
                                        </td>
                                        <td>${user.email}</td>
                                        <td><span class="role-badge ${roleInfo?.color || ''}">${roleInfo?.name || user.role}</span></td>
                                        <td>${user.lastLogin ? formatarDataHora(user.lastLogin) : 'Nunca'}</td>
                                        <td>
                                            <button class="btn btn-sm btn-secondary" onclick="editarUsuario('${user.id}')" data-require-permission="usuarios.edit">Editar</button>
                                            <button class="btn btn-sm btn-danger" onclick="excluirUsuario('${user.id}')" data-require-permission="usuarios.delete">Excluir</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    auth.checkPermissions();
}

function excluirUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        if (auth.deleteUser(id)) {
            renderizarUsuarios();
        }
    }
}

function showAccessDenied() {
    document.getElementById('content').innerHTML = `
        <div class="access-denied">
            <div class="access-denied-icon">🚫</div>
            <h2>Acesso Negado</h2>
            <p>Você não tem permissão para acessar esta funcionalidade.</p>
            <button class="btn btn-primary" onclick="mudarPagina('dashboard')">Voltar ao Dashboard</button>
        </div>
    `;
}

// Keyboard shortcuts
// ==================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
});
