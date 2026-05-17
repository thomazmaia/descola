/**
 * detalhe.js — lógica da página de detalhe da vaga
 *
 * PASSO 9 refatorações:
 * A5: var → const/let
 * A6: funções menores com SRP
 * A7: badge logic removida (agora em utils.js)
 * B2: XHR → fetch com tratamento de erro
 * C2: createElement + textContent (sem innerHTML inseguro)
 * M5: == → ===
 */

'use strict';

// ── Busca e renderização ───────────────────────────────────────
async function carregarDetalhe() {
  const id = obterIdVaga();
  if (!id) { window.location.href = 'vagas.html'; return; }

  try {
    const vagas = await fetchJSON('data/vagas.json');
    // PASSO 9 — M5: === em vez de ==
    const vaga = vagas.find(v => v.id === id);
    if (!vaga) { window.location.href = 'vagas.html'; return; }
    renderizarDetalhe(vaga);
  } catch (erro) {
    console.error('Erro ao carregar detalhe:', erro.message);
    mostrarErroDetalhe();
  }
}

/**
 * PASSO 9 — A6 (SRP): responsabilidade única de ler o id do storage.
 * Antes estava misturado na função gigante carregarDetalhe().
 */
function obterIdVaga() {
  try {
    return parseInt(localStorage.getItem('vagaId'), 10) || null;
  } catch {
    return null;
  }
}

/**
 * PASSO 9 — A6 (SRP): responsabilidade única de renderizar o detalhe.
 * PASSO 9 — C2: usa textContent (sem innerHTML com dados externos).
 * PASSO 9 — A7: badges via utils.js (sem duplicação).
 */
function renderizarDetalhe(vaga) {
  // Badges
  const badgesEl = document.getElementById('detalhe-badges');
  if (badgesEl) {
    badgesEl.replaceChildren();
    badgesEl.appendChild(criarBadges(vaga.tipo, vaga.modalidade, vaga.nivel));
  }

  // Campos de texto — textContent (seguro)
  setText('detalhe-titulo',    vaga.titulo);
  setText('detalhe-empresa',   `${vaga.empresa} · ${vaga.cidade}, ${vaga.estado}`);
  setText('detalhe-carga',     vaga.carga);
  setText('detalhe-bolsa',     vaga.bolsa);
  setText('detalhe-publicada', formatarDias(vaga.publicada));
  setText('detalhe-encerra',   `${vaga.encerra} dias`);
  setText('detalhe-descricao', vaga.descricao);

  // Requisitos — lista segura
  renderizarLista('detalhe-requisitos', vaga.requisitos);

  // Benefícios — grid seguro
  renderizarBeneficios('detalhe-beneficios', vaga.beneficios);

  // Título da aba
  document.title = `${vaga.titulo} — Descola`;

  // Salvar para o formulário
  try {
    localStorage.setItem('vagaTitulo',  vaga.titulo);
    localStorage.setItem('vagaEmpresa', vaga.empresa);
  } catch { /* ignorar se storage indisponível */ }
}

/** Define textContent de forma segura */
function setText(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

/**
 * Renderiza uma lista <ul> de forma segura.
 * PASSO 9 — C2: createElement + textContent (sem innerHTML).
 */
function renderizarLista(containerId, itens) {
  const ul = document.getElementById(containerId);
  if (!ul) return;
  ul.replaceChildren();
  itens.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

/**
 * Renderiza o grid de benefícios de forma segura.
 * PASSO 9 — C2: createElement + textContent (sem innerHTML).
 */
function renderizarBeneficios(containerId, beneficios) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.replaceChildren();
  beneficios.forEach(ben => {
    const div = document.createElement('div');
    div.className = 'beneficio-item';
    div.textContent = ben;
    grid.appendChild(div);
  });
}

function mostrarErroDetalhe() {
  const container = document.querySelector('.detalhe-container');
  if (!container) return;
  container.replaceChildren();
  const p = document.createElement('p');
  p.style.cssText = 'text-align:center;color:#6B6B67;padding:60px 20px;';
  p.textContent = 'Não foi possível carregar os detalhes desta vaga. Tente novamente.';
  container.appendChild(p);
}

function irParaCandidatura() {
  window.location.href = 'candidatura.html';
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
  carregarDetalhe();
  iniciarMenuMobile();
});
