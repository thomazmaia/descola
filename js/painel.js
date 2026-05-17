/**
 * painel.js — lógica do painel do recrutador
 *
 * PASSO 9 — C1 (CRÍTICO): credenciais hardcoded REMOVIDAS
 *   Antes: var USUARIO_FIXO = 'recrutador@descola.app'; var SENHA_FIXA = 'descola123';
 *   Depois: validação simulada sem expor credenciais no código-fonte
 *   Em produção: autenticação via API backend com token JWT
 *
 * PASSO 9 — A5: var → const/let
 * PASSO 9 — A6 (SRP): funções decompostas
 * PASSO 9 — B4: dados do recrutador movidos para painel-data.json
 * PASSO 9 — C2: createElement + textContent (sem innerHTML)
 * PASSO 9 — M5: == → ===
 */

'use strict';

// ── Autenticação ───────────────────────────────────────────────
/**
 * PASSO 9 — C1: credenciais REMOVIDAS do código-fonte.
 * Simulação de login: em produção, seria um fetch para /api/auth
 * com o corpo { email, senha } e retorno de token JWT.
 */
async function autenticar(email, senha) {
  // Simula latência de rede e validação básica (sem expor credenciais)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Em produção: fetch('/api/auth', { method:'POST', body: JSON.stringify({email,senha}) })
      // Aqui apenas verificamos que os campos não estão vazios como placeholder
      resolve(email.length > 0 && senha.length >= 6);
    }, 400);
  });
}

function verificarSessao() {
  try {
    return localStorage.getItem('logado') === 'true';
  } catch {
    return false;
  }
}

function iniciarSessao(nomeEmpresa) {
  try {
    localStorage.setItem('logado', 'true');
    localStorage.setItem('nomeEmpresa', nomeEmpresa);
  } catch { /* ignorar */ }
}

function encerrarSessao() {
  try {
    localStorage.removeItem('logado');
    localStorage.removeItem('nomeEmpresa');
  } catch { /* ignorar */ }
  mostrarLogin();
}

// ── Exibição de áreas ──────────────────────────────────────────
function mostrarLogin() {
  const login  = document.getElementById('area-login');
  const painel = document.getElementById('area-painel');
  if (login)  login.style.display  = 'flex';
  if (painel) painel.style.display = 'none';
}

function mostrarPainel() {
  const login  = document.getElementById('area-login');
  const painel = document.getElementById('area-painel');
  if (login)  login.style.display  = 'none';
  if (painel) painel.style.display = 'block';

  try {
    const nome = localStorage.getItem('nomeEmpresa') ?? 'Recrutador';
    // PASSO 9 — C2: textContent (sem innerHTML)
    const el = document.getElementById('nome-empresa');
    if (el) el.textContent = nome;
  } catch { /* ignorar */ }

  carregarDadosPainel();
}

// ── Carregamento de dados ──────────────────────────────────────
/**
 * PASSO 9 — B4: dados movidos para painel-data.json (sem hardcode no JS).
 * PASSO 9 — B2: fetch com tratamento de erro.
 */
async function carregarDadosPainel() {
  try {
    const dados = await fetchJSON('data/painel-data.json');
    renderizarVagasRecrutador(dados.vagas);
    renderizarCandidatos(dados.candidatos);
  } catch (erro) {
    console.error('Erro ao carregar dados do painel:', erro.message);
    renderizarErro('vagas-recrutador', 'Não foi possível carregar suas vagas.');
  }
}

// ── Renderização ───────────────────────────────────────────────
/**
 * PASSO 9 — A6 (SRP): renderiza apenas a lista de vagas.
 * PASSO 9 — C2: createElement + textContent.
 */
function renderizarVagasRecrutador(vagas) {
  const container = document.getElementById('vagas-recrutador');
  if (!container) return;
  container.replaceChildren();

  vagas.forEach(v => {
    const item = document.createElement('div');
    item.className = 'vaga-rec-item';
    item.setAttribute('role', 'listitem');

    // Topo
    const topo = document.createElement('div');
    topo.className = 'vaga-rec-top';

    const info = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = v.titulo;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = v.meta;
    info.append(h3, meta);

    const badge = document.createElement('span');
    badge.className = v.status === 'Ativa' ? 'status-ativa' : 'status-encerrada';
    badge.textContent = v.status;

    topo.append(info, badge);
    item.appendChild(topo);

    // Ações
    const acoes = document.createElement('div');
    acoes.className = 'vaga-rec-acoes';

    const btnVer = criarBtnXs('Ver candidatos', 'btn-xs-ver',
      `Ver candidatos da vaga ${v.titulo}`);
    acoes.appendChild(btnVer);

    if (v.status === 'Ativa') {
      acoes.appendChild(criarBtnXs('Editar', 'btn-xs-editar', `Editar vaga ${v.titulo}`));
      acoes.appendChild(criarBtnXs('Encerrar', 'btn-xs-encerrar', `Encerrar vaga ${v.titulo}`));
    } else {
      acoes.appendChild(criarBtnXs('Reabrir', 'btn-xs-editar', `Reabrir vaga ${v.titulo}`));
    }

    item.appendChild(acoes);
    container.appendChild(item);
  });
}

function criarBtnXs(texto, classe, ariaLabel) {
  const btn = document.createElement('button');
  btn.className = `btn-xs ${classe}`;
  btn.textContent = texto;
  btn.setAttribute('aria-label', ariaLabel);
  return btn;
}

/**
 * PASSO 9 — A6 (SRP): renderiza apenas a lista de candidatos.
 * PASSO 9 — C2: createElement + textContent.
 */
function renderizarCandidatos(candidatos) {
  const container = document.getElementById('candidatos-recentes');
  if (!container) return;
  container.replaceChildren();

  candidatos.forEach(c => {
    const item = document.createElement('div');
    item.setAttribute('role', 'listitem');
    item.style.cssText =
      'display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:0.5px solid #E0DED9;';

    // Avatar com iniciais
    const iniciais = c.nome.split(' ').map(p => p[0]).join('').substring(0, 2);
    const avatar = document.createElement('div');
    avatar.setAttribute('aria-hidden', 'true');
    avatar.style.cssText =
      'width:36px;height:36px;border-radius:50%;background:#E6F1FB;color:#0C447C;' +
      'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;';
    avatar.textContent = iniciais;

    // Info
    const info = document.createElement('div');
    info.style.flex = '1';
    const nome = document.createElement('div');
    nome.style.cssText = 'font-size:13px;font-weight:600;';
    nome.textContent = c.nome;
    const sub = document.createElement('div');
    sub.style.cssText = 'font-size:11px;color:#6B6B67;';
    sub.textContent = `${c.vaga} · ${c.tempo}`;
    info.append(nome, sub);

    // Botão
    const btn = criarBtnXs('Ver', 'btn-xs-ver', `Ver perfil de ${c.nome}`);

    item.append(avatar, info, btn);
    container.appendChild(item);
  });
}

function renderizarErro(containerId, mensagem) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.replaceChildren();
  const p = document.createElement('p');
  p.style.cssText = 'color:#6B6B67;padding:20px;text-align:center;';
  p.textContent = mensagem;
  el.appendChild(p);
}

// ── Formulário de login ────────────────────────────────────────
async function fazerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-usuario')?.value ?? '';
  const senha  = document.getElementById('login-senha')?.value  ?? '';

  const erroEl = document.getElementById('erro-login');
  if (erroEl) erroEl.style.display = 'none';

  const ok = await autenticar(email, senha);
  if (ok) {
    iniciarSessao(email.split('@')[0]);
    mostrarPainel();
  } else {
    // PASSO 8 — A4: erro inline (sem alert())
    if (erroEl) {
      erroEl.textContent = 'E-mail ou senha incorretos. Verifique e tente novamente.';
      erroEl.style.display = 'block';
    }
  }
}

function sair() { encerrarSessao(); }

// ── Menu mobile ────────────────────────────────────────────────
function iniciarMenuMobile() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
}

// ── Inicialização ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (verificarSessao()) {
    mostrarPainel();
  } else {
    mostrarLogin();
  }

  const formLogin = document.getElementById('form-login');
  if (formLogin) formLogin.addEventListener('submit', fazerLogin);

  iniciarMenuMobile();
});
