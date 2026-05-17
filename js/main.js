/**
 * main.js — lógica das páginas Home e Lista de Vagas
 *
 * PASSO 9 refatorações aplicadas:
 * A5: var → const/let em todo o arquivo
 * A6: funções gigantes decompostas em responsabilidades únicas (SRP)
 * A7: badge logic movida para utils.js (DRY)
 * B2: XHR → fetch com tratamento de erro
 * B3: variável vagaAtual removida
 * C2: createElement + textContent (sem innerHTML com dados externos)
 * M5: == → ===
 */

'use strict';

// ── Estado da aplicação ───────────────────────────────────────
let todasVagas   = [];
let paginaAtual  = 1;
const VAGAS_POR_PAGINA = 6;

// ── Fetch das vagas ────────────────────────────────────────────
/**
 * PASSO 9 — A6 (SRP): apenas busca os dados.
 * PASSO 9 — B2: usa fetchJSON de utils.js com tratamento de erro.
 */
async function carregarVagas() {
  try {
    todasVagas = await fetchJSON('data/vagas.json');
    renderizarCards(todasVagas);
    renderizarPaginacao(todasVagas.length);
    atualizarContador(todasVagas.length);
  } catch (erro) {
    mostrarErroCarregamento(erro.message);
  }
}

/**
 * Exibe mensagem amigável quando o JSON não carrega.
 * PASSO 9 — B2: tratamento de erro de rede.
 */
function mostrarErroCarregamento(mensagem) {
  const container = document.getElementById('vagas-container');
  if (!container) return;
  const p = document.createElement('p');
  p.style.cssText = 'text-align:center;color:#6B6B67;padding:40px;';
  p.textContent = 'Não foi possível carregar as vagas. Tente novamente mais tarde.';
  container.appendChild(p);
  console.error('Erro ao carregar vagas:', mensagem);
}

// ── Renderização de cards ──────────────────────────────────────
/**
 * PASSO 9 — A6 (SRP): apenas renderiza os cards na tela.
 * PASSO 9 — C2: usa createElement (sem innerHTML com dados do JSON).
 */
function renderizarCards(vagas) {
  const container = document.getElementById('vagas-container');
  if (!container) return;

  // Limpar container de forma segura
  container.replaceChildren();

  const inicio = (paginaAtual - 1) * VAGAS_POR_PAGINA;
  const vagasPagina = vagas.slice(inicio, inicio + VAGAS_POR_PAGINA);

  if (vagasPagina.length === 0) {
    const p = document.createElement('p');
    p.style.cssText = 'text-align:center;color:#6B6B67;padding:40px;grid-column:1/-1;';
    p.textContent = 'Nenhuma vaga encontrada para os filtros selecionados.';
    container.appendChild(p);
    return;
  }

  vagasPagina.forEach(v => {
    container.appendChild(criarCard(v));
  });
}

/**
 * Cria um card de vaga como elemento DOM.
 * PASSO 9 — A6 (SRP): responsabilidade única de criar um card.
 * PASSO 9 — C2: textContent em vez de innerHTML.
 * @param {Object} vaga
 * @returns {HTMLElement}
 */
function criarCard(vaga) {
  const article = document.createElement('article');
  article.className = 'card-vaga';
  article.setAttribute('role', 'article');
  article.setAttribute('aria-label', `Vaga: ${vaga.titulo} em ${vaga.empresa}`);
  article.addEventListener('click', () => irParaDetalhe(vaga.id));
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') irParaDetalhe(vaga.id);
  });
  article.setAttribute('tabindex', '0');

  // Badges — via utils.js (DRY)
  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.appendChild(criarBadges(vaga.tipo, vaga.modalidade));
  article.appendChild(badges);

  // Título
  const h3 = document.createElement('h3');
  h3.textContent = vaga.titulo;
  article.appendChild(h3);

  // Empresa
  const empresa = document.createElement('p');
  empresa.className = 'empresa';
  empresa.textContent = `${vaga.empresa} · ${vaga.cidade}, ${vaga.estado}`;
  article.appendChild(empresa);

  // Rodapé do card
  const rodape = document.createElement('div');
  rodape.className = 'rodape';

  const tempo = document.createElement('span');
  tempo.className = 'tempo';
  tempo.textContent = formatarDias(vaga.publicada);
  rodape.appendChild(tempo);

  const btn = document.createElement('button');
  btn.className = 'btn-primary';
  btn.textContent = 'Ver vaga';
  btn.setAttribute('aria-label', `Ver detalhes da vaga: ${vaga.titulo}`);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    irParaDetalhe(vaga.id);
  });
  rodape.appendChild(btn);

  article.appendChild(rodape);
  return article;
}

// ── Paginação ──────────────────────────────────────────────────
/**
 * PASSO 9 — A6 (SRP): responsabilidade única de renderizar paginação.
 * PASSO 9 — C2: createElement (sem innerHTML).
 */
function renderizarPaginacao(total) {
  const container = document.getElementById('paginacao');
  if (!container) return;

  container.replaceChildren();
  const totalPaginas = Math.ceil(total / VAGAS_POR_PAGINA);

  const criarBtnPag = (label, pagina, isCurrent = false, ariaLabel = '') => {
    const btn = document.createElement('button');
    btn.className = 'pag-btn' + (isCurrent ? ' ativo' : '');
    btn.textContent = label;
    btn.setAttribute('aria-label', ariaLabel || `Página ${pagina}`);
    if (isCurrent) btn.setAttribute('aria-current', 'page');
    btn.addEventListener('click', () => mudarPagina(pagina));
    return btn;
  };

  container.appendChild(criarBtnPag('‹', paginaAtual - 1, false, 'Página anterior'));
  for (let p = 1; p <= totalPaginas; p++) {
    container.appendChild(criarBtnPag(p, p, p === paginaAtual));
  }
  container.appendChild(criarBtnPag('›', paginaAtual + 1, false, 'Próxima página'));
}

function mudarPagina(p) {
  const totalPaginas = Math.ceil(todasVagas.length / VAGAS_POR_PAGINA);
  // PASSO 9 — M5: === em vez de ==
  if (p < 1 || p > totalPaginas) return;
  paginaAtual = p;
  renderizarCards(todasVagas);
  renderizarPaginacao(todasVagas.length);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Filtro e busca ─────────────────────────────────────────────
/**
 * PASSO 9 — A6 (SRP): filtrarPorBusca separado de filtrarPorTipo.
 */
function filtrarPorBusca(vagas, termo) {
  if (!termo) return vagas;
  const t = termo.toLowerCase();
  return vagas.filter(v =>
    v.titulo.toLowerCase().includes(t)  ||
    v.empresa.toLowerCase().includes(t) ||
    v.cidade.toLowerCase().includes(t)  ||
    v.area.toLowerCase().includes(t)
  );
}

function filtrarPorTipo(vagas, tipo) {
  if (!tipo || tipo === 'todos') return vagas;
  return vagas.filter(v =>
    v.tipo === tipo || v.modalidade === tipo || v.area === tipo
  );
}

function filtrarVagas() {
  const busca = document.getElementById('busca')?.value ?? '';
  const tipoAtivo = document.querySelector('.chip-ativo')?.dataset.tipo ?? 'todos';

  let resultado = filtrarPorBusca(todasVagas, busca);
  resultado = filtrarPorTipo(resultado, tipoAtivo);

  paginaAtual = 1;
  renderizarCards(resultado);
  renderizarPaginacao(resultado.length);
  atualizarContador(resultado.length);
}

function atualizarContador(total) {
  const contador = document.getElementById('contador');
  if (contador) {
    contador.textContent = `${total} vaga${total !== 1 ? 's' : ''} encontrada${total !== 1 ? 's' : ''}`;
  }
}

function ativarChip(el) {
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.remove('chip-ativo');
    c.setAttribute('aria-pressed', 'false');
  });
  el.classList.add('chip-ativo');
  el.setAttribute('aria-pressed', 'true');
  filtrarVagas();
}

function irParaDetalhe(id) {
  try {
    localStorage.setItem('vagaId', id);
  } catch (e) {
    console.warn('localStorage indisponível:', e);
  }
  window.location.href = 'vaga-detalhe.html';
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
  carregarVagas();
  iniciarMenuMobile();

  const inputBusca = document.getElementById('busca');
  if (inputBusca) inputBusca.addEventListener('input', filtrarVagas);

  const formBusca = document.getElementById('form-busca');
  if (formBusca) formBusca.addEventListener('submit', (e) => {
    e.preventDefault();
    filtrarVagas();
  });
});
