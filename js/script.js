const bancoMedicamentos = {
  dipirona: {
    nome: 'Dipirona Sódica',
    status: 'Medicamento identificado',
    resumo: 'Analgésico e antitérmico usado para alívio de dor e redução de febre.',
    serve: 'Pode ser utilizada para quadros de dor e febre conforme orientação profissional e informações da bula.',
    cuidado: 'Pessoas com alergia à dipirona ou histórico de alterações importantes no sangue devem conversar com um profissional antes do uso.',
    uso: 'Use somente conforme a prescrição, orientação de um profissional de saúde ou instruções da bula do produto específico.'
  },
  paracetamol: {
    nome: 'Paracetamol',
    status: 'Medicamento identificado',
    resumo: 'Analgésico e antitérmico utilizado para dores leves a moderadas e febre.',
    serve: 'É comum em situações como dor de cabeça, dores no corpo e estados febris.',
    cuidado: 'Evite combinar diferentes produtos que também contenham paracetamol. Doses excessivas podem causar lesão no fígado.',
    uso: 'Siga a dose indicada na receita ou bula, respeitando o intervalo e o limite diário do produto.'
  },
  ibuprofeno: {
    nome: 'Ibuprofeno',
    status: 'Medicamento identificado',
    resumo: 'Anti-inflamatório, analgésico e antitérmico usado em dores, inflamação e febre.',
    serve: 'Pode ser usado em alguns tipos de dor e inflamação, quando apropriado para a pessoa e orientado corretamente.',
    cuidado: 'Pode não ser adequado para pessoas com problemas renais, úlcera, sangramento gastrointestinal ou algumas condições cardíacas.',
    uso: 'Use apenas de acordo com a bula ou orientação profissional. Não prolongue o uso por conta própria.'
  },
  losartana: {
    nome: 'Losartana Potássica',
    status: 'Medicamento identificado',
    resumo: 'Medicamento usado principalmente no controle da pressão arterial e em algumas situações cardiovasculares ou renais.',
    serve: 'Ajuda a controlar a pressão quando faz parte do tratamento definido pelo profissional de saúde.',
    cuidado: 'Não interrompa de forma repentina sem orientação. Tontura e alterações do potássio podem exigir avaliação.',
    uso: 'Tome nos horários e quantidade prescritos. Se esquecer uma dose, siga a orientação da bula ou do profissional que acompanha você.'
  },
  metformina: {
    nome: 'Metformina',
    status: 'Medicamento identificado',
    resumo: 'Medicamento muito utilizado no tratamento do diabetes tipo 2 e controle da glicose.',
    serve: 'Ajuda a melhorar o controle da glicemia em conjunto com alimentação, atividade física e acompanhamento clínico.',
    cuidado: 'Pode causar desconforto gastrointestinal. Pessoas com problemas renais importantes precisam de avaliação individual.',
    uso: 'Siga a prescrição e não altere a dose por conta própria. A forma de tomar pode variar conforme a apresentação.'
  }
};

function normalizar(texto = '') {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function identificarMedicamento(nome) {
  const chave = normalizar(nome);
  const encontrado = Object.keys(bancoMedicamentos).find(item => chave.includes(item));
  if (encontrado) return bancoMedicamentos[encontrado];
  return {
    nome: nome || 'Medicamento não informado',
    status: 'Informação geral',
    resumo: 'Este medicamento não está no banco demonstrativo do projeto.',
    serve: 'Consulte a bula oficial do produto ou um profissional de saúde para confirmar indicação e forma correta de uso.',
    cuidado: 'Não use um medicamento apenas com base nesta página. Interações, alergias, idade, gravidez e outras condições podem mudar a segurança do uso.',
    uso: 'Siga a receita, a bula e a orientação do médico ou farmacêutico. Não ajuste doses por conta própria.'
  };
}

function mostrarToast(texto) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add('mostrar');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('mostrar'), 2600);
}

const EMAIL_CORRETO = "usuario@email.com";
const SENHA_CORRETA = "123456";

window.onload = function() {
    configurarLogin(); // Garante o funcionamento dos elementos de login imediatamente
    
    const continuar = verificarSessao();
    if (continuar) {
        configurarUsuario();
    }
};

function obterSessao() {
  try {
    return JSON.parse(sessionStorage.getItem('horaCertaSessao') || 'null');
  } catch {
    return null;
  }
}

function verificarSessao() {
  const paginaLogin = document.body.dataset.pagina === 'login';
  const sessao = obterSessao();

  const authContainer = document.getElementById('authContainer');
  const dashboardContainer = document.getElementById('dashboardContainer');
  if (authContainer && dashboardContainer) {
    if (sessao) {
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
    } else {
        authContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
  }

  if (paginaLogin && sessao) {
    window.location.replace('index.html');
    return false;
  }

  if (!paginaLogin && !sessao) {
    window.location.replace('login.html');
    return false;
  }

  return true;
}

function configurarUsuario() {
  const sessao = obterSessao();
  if (!sessao || !sessao.nome) return;

  const nomeEl = document.getElementById('usuario-nome');
  if (nomeEl) nomeEl.textContent = sessao.nome;

  const avatar = document.getElementById('botao-sair');
  if (avatar) {
    const iniciais = sessao.nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(parte => parte[0])
      .join('')
      .toUpperCase();
    avatar.textContent = iniciais || 'HC';
  }

  document.querySelectorAll('[data-acao="sair"]').forEach(botao => {
    botao.addEventListener('click', fazerLogout);
  });
}

function configurarLogin() {
    const form = document.getElementById('formulario-login');
    if (!form) return;

    const senha = document.getElementById('senha-login');
    const verSenha = document.getElementById('botao-ver-senha');

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        fazerLogin();
    });

    if (verSenha && senha) {
        verSenha.onclick = function() {
            const mostrar = senha.type === 'password';
            senha.type = mostrar ? 'text' : 'password';
            verSenha.textContent = mostrar ? '⊘' : '◉';
            verSenha.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
        };
    }
}

function fazerLogin() {
    const emailCampo = document.getElementById('email-login');
    const senhaCampo = document.getElementById('senha-login');

    if (!emailCampo || !senhaCampo) return;

    const emailDigitado = emailCampo.value.trim();
    const senhaDigitada = senhaCampo.value.trim();

    if (emailDigitado === EMAIL_CORRETO && senhaDigitada === SENHA_CORRETA) {
        const dadosSessao = { nome: "Usuário Hora Certa" };
        sessionStorage.setItem('horaCertaSessao', JSON.stringify(dadosSessao));
        window.location.replace('index.html');
    } else {
        const feedback = document.getElementById('feedback-login');
        if (feedback) {
            feedback.textContent = 'E-mail ou senha incorretos!';
            feedback.style.color = 'red';
        } else {
            alert('E-mail ou senha incorretos!');
        }
    }
}

function fazerLogout() {
    sessionStorage.removeItem('horaCertaSessao');
    window.location.replace('login.html');
}


function configurarAnalise() {
  const form = document.getElementById('formulario-analise');
  if (!form) return;

  const nome = document.getElementById('nome-medicamento');
  const feedback = document.getElementById('feedback-analise');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const valor = nome.value.trim();
    if (valor.length < 2) {
      feedback.textContent = 'Digite o nome do medicamento para continuar.';
      nome.focus();
      return;
    }
    feedback.textContent = '';
    localStorage.setItem('horaCertaMedicamento', valor);
    window.location.href = `resultado.html?medicamento=${encodeURIComponent(valor)}`;
  });
}

function preencherResultado() {
  const pagina = document.getElementById('pagina-resultado');
  if (!pagina) return;

  const params = new URLSearchParams(window.location.search);
  const termo = params.get('medicamento') || localStorage.getItem('horaCertaMedicamento') || 'Dipirona';
  const info = identificarMedicamento(termo);

  const campos = {
    'resultado-status': info.status,
    'resultado-nome': info.nome,
    'resultado-resumo': info.resumo,
    'resultado-serve': info.serve,
    'resultado-uso': info.uso,
    'resultado-cuidado': info.cuidado
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  });
}

function configurarRotina() {
  const form = document.getElementById('formulario-rotina');
  const resultado = document.getElementById('resultado-rotina');
  if (!form || !resultado) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const marcados = [...form.querySelectorAll('input[type="checkbox"]:checked')].length;
    let titulo = 'Rotina bem organizada';
    let texto = 'Você marcou poucos sinais de risco. Continue usando lembretes e mantenha sua lista de medicamentos atualizada.';

    if (marcados >= 2 && marcados < 4) {
      titulo = 'Vale revisar sua rotina';
      texto = 'Alguns pontos podem aumentar a chance de esquecimento ou uso incorreto. Organize horários, nomes e prescrições em um só lugar.';
    } else if (marcados >= 4) {
      titulo = 'Peça apoio para organizar os medicamentos';
      texto = 'Há vários fatores que podem dificultar o uso correto. Um familiar, cuidador, médico ou farmacêutico pode ajudar a montar uma rotina mais segura.';
    }

    resultado.innerHTML = `<div class="painel-score"><strong>${titulo}</strong><p>${texto}</p></div>`;
    resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function configurarBotoes() {
  document.querySelectorAll('[data-acao="voltar"]').forEach(botao => {
    botao.addEventListener('click', () => {
      if (history.length > 1) history.back();
      else window.location.href = 'index.html';
    });
  });

  const botaoLembrete = document.getElementById('botao-marcar-tomado');
  if (botaoLembrete) {
    botaoLembrete.addEventListener('click', () => {
      const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      botaoLembrete.textContent = `✓ Marcado às ${agora}`;
      botaoLembrete.disabled = true;
      localStorage.setItem('horaCertaUltimoRegistro', agora);
      mostrarToast('Registro salvo neste navegador.');
    });
  }

  const emergencia = document.getElementById('botao-emergencia');
  if (emergencia) {
    emergencia.addEventListener('click', event => {
      if (!confirm('Deseja abrir a ligação para o SAMU (192)?')) event.preventDefault();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!verificarSessao()) return;
  configurarLogin();
  configurarUsuario();
  configurarAnalise();
  preencherResultado();
  configurarRotina();
  configurarBotoes();
});
