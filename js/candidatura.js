/**
 * candidatura.js — lógica do formulário de candidatura
 *
 * PASSO 8 — A4: alert() substituído por validação inline acessível
 *   com aria-invalid e role="alert" nos spans de erro
 * PASSO 9 — A5: var → const/let
 * PASSO 9 — A6 (SRP): validação separada por campo
 * PASSO 9 — M5: == → ===
 */

'use strict';

// ── Validação por campo (SRP) ──────────────────────────────────

function validarNome() {
  const val = document.getElementById('nome')?.value.trim() ?? '';
  if (!val) {
    mostrarErro('nome', 'erro-nome', 'Por favor, informe seu nome completo.');
    return false;
  }
  limparErro('nome', 'erro-nome');
  return true;
}

function validarEmail() {
  const val = document.getElementById('email')?.value.trim() ?? '';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    mostrarErro('email', 'erro-email', 'Por favor, informe seu e-mail.');
    return false;
  }
  if (!regex.test(val)) {
    mostrarErro('email', 'erro-email', 'Informe um e-mail válido (ex: nome@email.com).');
    return false;
  }
  limparErro('email', 'erro-email');
  return true;
}

function validarTel() {
  const val = document.getElementById('tel')?.value.trim() ?? '';
  if (!val) {
    mostrarErro('tel', 'erro-tel', 'Por favor, informe seu telefone ou WhatsApp.');
    return false;
  }
  limparErro('tel', 'erro-tel');
  return true;
}

function validarIdade() {
  const val = document.getElementById('idade')?.value ?? '';
  if (!val) {
    mostrarErro('idade', 'erro-idade', 'Por favor, selecione sua faixa de idade.');
    return false;
  }
  limparErro('idade', 'erro-idade');
  return true;
}

function validarLgpd() {
  const checked = document.getElementById('lgpd')?.checked ?? false;
  if (!checked) {
    mostrarErro('lgpd', 'erro-lgpd', 'Você precisa aceitar a Política de Privacidade para continuar.');
    return false;
  }
  limparErro('lgpd', 'erro-lgpd');
  return true;
}

/**
 * PASSO 9 — A6 (SRP): validação geral delega para funções individuais.
 * PASSO 8 — A4: nenhum alert() — todos os erros são inline e acessíveis.
 */
function validarForm() {
  const resultados = [
    validarNome(),
    validarEmail(),
    validarTel(),
    validarIdade(),
    validarLgpd(),
  ];

  const valido = resultados.every(Boolean);

  if (!valido) {
    // Foca o primeiro campo com erro para acessibilidade
    const primeiro = document.querySelector('[aria-invalid="true"]');
    if (primeiro) primeiro.focus();
  }

  return valido;
}

// ── Envio do formulário ────────────────────────────────────────
function enviarCandidatura(e) {
  e.preventDefault();
  if (!validarForm()) return;

  // Simula envio — em produção, aqui seria um fetch para a API
  const titulo  = localStorage.getItem('vagaTitulo')  ?? 'vaga';
  const empresa = localStorage.getItem('vagaEmpresa') ?? '';

  const formCard = document.getElementById('form-card');
  if (!formCard) return;

  // PASSO 9 — C2: createElement + textContent (sem innerHTML)
  formCard.replaceChildren();

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'text-align:center;padding:40px;';

  const icone = document.createElement('div');
  icone.textContent = '✅';
  icone.style.cssText = 'font-size:48px;margin-bottom:16px;';
  wrapper.appendChild(icone);

  const h2 = document.createElement('h2');
  h2.style.cssText = 'color:#1A3A2A;margin-bottom:8px;font-size:20px;';
  h2.textContent = 'Candidatura enviada!';
  wrapper.appendChild(h2);

  const p = document.createElement('p');
  p.style.cssText = 'color:#6B6B67;';
  p.textContent = `Você se candidatou para ${titulo}${empresa ? ' na ' + empresa : ''}.`;
  wrapper.appendChild(p);

  const p2 = document.createElement('p');
  p2.style.cssText = 'color:#6B6B67;margin-top:8px;';
  p2.textContent = 'Aguarde o contato da empresa pelo e-mail ou WhatsApp informado.';
  wrapper.appendChild(p2);

  const link = document.createElement('a');
  link.href = 'index.html';
  link.className = 'btn-primary';
  link.style.cssText = 'display:inline-block;margin-top:24px;text-decoration:none;';
  link.textContent = 'Voltar ao início';
  wrapper.appendChild(link);

  // Anuncia o sucesso para leitores de tela
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  formCard.appendChild(wrapper);
}

// ── Validação em tempo real (feedback imediato) ────────────────
function configurarValidacaoRealTime() {
  const campos = [
    { id: 'nome',  fn: validarNome },
    { id: 'email', fn: validarEmail },
    { id: 'tel',   fn: validarTel },
    { id: 'idade', fn: validarIdade },
  ];
  campos.forEach(({ id, fn }) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', fn);
  });

  const lgpd = document.getElementById('lgpd');
  if (lgpd) lgpd.addEventListener('change', validarLgpd);
}

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
  // Preenche subtítulo com o nome da vaga
  try {
    const titulo  = localStorage.getItem('vagaTitulo');
    const empresa = localStorage.getItem('vagaEmpresa');
    const el = document.getElementById('form-subtitulo');
    if (el && titulo) el.textContent = `${empresa ? empresa + ' · ' : ''}${titulo}`;
  } catch { /* ignorar */ }

  const form = document.getElementById('form-candidatura');
  if (form) form.addEventListener('submit', enviarCandidatura);

  configurarValidacaoRealTime();
  iniciarMenuMobile();
});
