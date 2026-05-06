// GymPro - Sistema de Notificações WhatsApp
// ==========================================

// Configurações de notificações
const NOTIFICACOES_CONFIG = {
    // Mensagem de aniversário
    aniversario: {
        ativo: true,
        mensagem: `🎉 *Feliz Aniversário!* 🎉

Olá {nome}!

A equipe {academia} deseja um dia incrível e repleto de conquistas!

Que este novo ano de vida traga muita saúde, energia e resultados na sua jornada fitness! 💪

*Parabéns!* 🎂🎈`,
        horario: '09:00' // Horário de envio
    },
    
    // Mensagem de vencimento
    vencimento: {
        ativo: true,
        mensagem: `💳 *Lembrete de Vencimento* 💳

Olá {nome}!

Sua mensalidade vence amanhã *{vencimento}*.

Evite transtornos e mantenha seus treinos em dia! 💪

*Dados para pagamento:*
- Valor: {valor}
- Plano: {plano}

Caso já tenha pago, desconsidere esta mensagem.

{academia}`,
        diasAntes: 1, // Quantos dias antes avisar
        horario: '10:00'
    },
    
    // Mensagem de vencimento no dia
    vencimentoHoje: {
        ativo: true,
        mensagem: `⚠️ *Vencimento Hoje* ⚠️

Olá {nome}!

Sua mensalidade vence *HOJE* ({vencimento}).

Regularize seu pagamento para continuar treinando sem interrupções! 💪

*Dados:*
- Valor: {valor}
- Plano: {plano}

{academia}`,
        horario: '08:00'
    }
};

// Verificar e enviar notificações
function verificarNotificacoes() {
    const hoje = new Date();
    const horaAtual = hoje.getHours().toString().padStart(2, '0') + ':' + hoje.getMinutes().toString().padStart(2, '0');
    
    appState.alunos.forEach(aluno => {
        if (aluno.status === 'inactive') return;
        
        // Verificar aniversário
        if (NOTIFICACOES_CONFIG.aniversario.ativo && aluno.dataNascimento) {
            verificarAniversario(aluno, hoje, horaAtual);
        }
        
        // Verificar vencimento
        if (NOTIFICACOES_CONFIG.vencimento.ativo && aluno.proximoPagamento) {
            verificarVencimento(aluno, hoje, horaAtual);
        }
    });
}

// Verificar aniversário
function verificarAniversario(aluno, hoje, horaAtual) {
    const nascimento = new Date(aluno.dataNascimento);
    const diaNascimento = nascimento.getDate();
    const mesNascimento = nascimento.getMonth();
    
    const diaHoje = hoje.getDate();
    const mesHoje = hoje.getMonth();
    
    // Se for aniversário hoje e horário correto
    if (diaHoje === diaNascimento && mesHoje === mesNascimento && horaAtual === NOTIFICACOES_CONFIG.aniversario.horario) {
        const mensagem = NOTIFICACOES_CONFIG.aniversario.mensagem
            .replace('{nome}', aluno.nome.split(' ')[0])
            .replace('{academia}', appState.configuracoes.nomeAcademia);
        
        enviarWhatsApp(aluno.telefone, mensagem, `Aniversário de ${aluno.nome}`);
    }
}

// Verificar vencimento
function verificarVencimento(aluno, hoje, horaAtual) {
    const vencimento = new Date(aluno.proximoPagamento);
    const diaVencimento = vencimento.getDate();
    const mesVencimento = vencimento.getMonth();
    const anoVencimento = vencimento.getFullYear();
    
    const diaHoje = hoje.getDate();
    const mesHoje = hoje.getMonth();
    const anoHoje = hoje.getFullYear();
    
    // Calcular diferença em dias
    const diffTime = vencimento - hoje;
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const plano = appState.planos.find(p => p.id === aluno.planoId);
    const valor = plano ? formatarMoeda(plano.valor) : 'R$ 0,00';
    const nomePlano = plano ? plano.nome : 'Plano não encontrado';
    
    // Vencimento amanhã
    if (diffDias === NOTIFICACOES_CONFIG.vencimento.diasAntes && horaAtual === NOTIFICACOES_CONFIG.vencimento.horario) {
        const mensagem = NOTIFICACOES_CONFIG.vencimento.mensagem
            .replace('{nome}', aluno.nome.split(' ')[0])
            .replace('{vencimento}', `${diaVencimento}/${mesVencimento + 1}`)
            .replace('{valor}', valor)
            .replace('{plano}', nomePlano)
            .replace('{academia}', appState.configuracoes.nomeAcademia);
        
        enviarWhatsApp(aluno.telefone, mensagem, `Vencimento amanhã - ${aluno.nome}`);
    }
    
    // Vencimento hoje
    if (diffDias === 0 && horaAtual === NOTIFICACOES_CONFIG.vencimentoHoje.horario) {
        const mensagem = NOTIFICACOES_CONFIG.vencimentoHoje.mensagem
            .replace('{nome}', aluno.nome.split(' ')[0])
            .replace('{vencimento}', `${diaVencimento}/${mesVencimento + 1}`)
            .replace('{valor}', valor)
            .replace('{plano}', nomePlano)
            .replace('{academia}', appState.configuracoes.nomeAcademia);
        
        enviarWhatsApp(aluno.telefone, mensagem, `Vencimento HOJE - ${aluno.nome}`);
    }
}

// Enviar mensagem WhatsApp
function enviarWhatsApp(telefone, mensagem, descricao) {
    // Limpar número (apenas dígitos)
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Verificar se é um número válido (pelo menos 10 dígitos)
    if (numeroLimpo.length < 10) {
        console.error('Número de telefone inválido:', telefone);
        return;
    }
    
    // Formatar número com código do país (Brasil = 55)
    const numeroComDDI = numeroLimpo.startsWith('55') ? numeroLimpo : '55' + numeroLimpo;
    
    // Criar URL do WhatsApp Web/API
    const url = `https://api.whatsapp.com/send?phone=${numeroComDDI}&text=${encodeURIComponent(mensagem)}`;
    
    // Abrir em nova aba
    window.open(url, '_blank');
    
    // Registrar notificação enviada
    registrarNotificacao({
        tipo: 'whatsapp',
        descricao: descricao,
        telefone: telefone,
        data: new Date().toISOString(),
        status: 'enviado'
    });
}

// Registrar notificação no histórico
function registrarNotificacao(notificacao) {
    if (!appState.notificacoes) {
        appState.notificacoes = [];
    }
    
    appState.notificacoes.push(notificacao);
    
    // Manter apenas últimas 100 notificações
    if (appState.notificacoes.length > 100) {
        appState.notificacoes = appState.notificacoes.slice(-100);
    }
    
    salvarDados();
}

// Enviar notificação manual (botão na interface)
function enviarNotificacaoManual(alunoId, tipo) {
    const aluno = appState.alunos.find(a => a.id === alunoId);
    if (!aluno) return;
    
    const plano = appState.planos.find(p => p.id === aluno.planoId);
    const valor = plano ? formatarMoeda(plano.valor) : 'R$ 0,00';
    const nomePlano = plano ? plano.nome : 'Plano não encontrado';
    
    let mensagem = '';
    let descricao = '';
    
    if (tipo === 'aniversario') {
        mensagem = NOTIFICACOES_CONFIG.aniversario.mensagem
            .replace('{nome}', aluno.nome.split(' ')[0])
            .replace('{academia}', appState.configuracoes.nomeAcademia);
        descricao = `Aniversário de ${aluno.nome} (manual)`;
    } else if (tipo === 'vencimento') {
        const vencimento = new Date(aluno.proximoPagamento);
        mensagem = NOTIFICACOES_CONFIG.vencimento.mensagem
            .replace('{nome}', aluno.nome.split(' ')[0])
            .replace('{vencimento}', `${vencimento.getDate()}/${vencimento.getMonth() + 1}`)
            .replace('{valor}', valor)
            .replace('{plano}', nomePlano)
            .replace('{academia}', appState.configuracoes.nomeAcademia);
        descricao = `Vencimento - ${aluno.nome} (manual)`;
    }
    
    enviarWhatsApp(aluno.telefone, mensagem, descricao);
}

// Iniciar verificação automática (a cada minuto)
function iniciarNotificacoesAutomaticas() {
    verificarNotificacoes(); // Verificar imediatamente
    setInterval(verificarNotificacoes, 60000); // Verificar a cada minuto
}

// Exportar funções
window.notificacoesWhatsApp = {
    enviarManual: enviarNotificacaoManual,
    verificar: verificarNotificacoes,
    iniciar: iniciarNotificacoesAutomaticas,
    config: NOTIFICACOES_CONFIG
};
