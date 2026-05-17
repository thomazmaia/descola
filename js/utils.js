/**
 * utils.js — funções utilitárias compartilhadas
 *
 * PASSO 9 — A7 (DRY): lógica de badge extraída de main.js e detalhe.js
 * para um módulo único. Antes estava duplicada nos dois arquivos.
 */

'use strict';

/**
 * Retorna um elemento <span> de badge criado de forma segura.
 * PASSO 9 — C2: usa createElement + textContent (sem innerHTML)
 * @param {string} texto
 * @param {string} classe CSS
 * @returns {HTMLElement}
 */
function criarBadge(texto, classe) {
  const span = document.createElement('span');
  span.className = classe;
  span.textContent = texto;
  return span;
}

/**
 * Retorna o nome da classe CSS para a modalidade da vaga.
 * PASSO 9 — A7 (DRY): antes duplicado em main.js e detalhe.js
 * @param {string} modalidade
 * @returns {string}
 */
function getClasseModalidade(modalidade) {
  const mapa = {
    'Presencial': 'badge-modalidade-presencial',
    'Hibrido':   'badge-modalidade-hibrido',
    'Remoto':    'badge-modalidade-remoto',
  };
  return mapa[modalidade] || 'badge-tipo';
}

/**
 * Cria e retorna o fragment com os badges de tipo e modalidade.
 * @param {string} tipo
 * @param {string} modalidade
 * @param {string} [nivel]
 * @returns {DocumentFragment}
 */
function criarBadges(tipo, modalidade, nivel) {
  const frag = document.createDocumentFragment();
  frag.appendChild(criarBadge(tipo, 'badge-tipo'));
  frag.appendChild(criarBadge(modalidade, getClasseModalidade(modalidade)));
  if (nivel) frag.appendChild(criarBadge(nivel, 'badge-tipo'));
  return frag;
}

/**
 * Escapa texto para uso seguro em contextos de texto.
 * Não necessário com textContent, mas útil para atributos.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Formata "publicada há N dia(s)"
 * @param {number} dias
 * @returns {string}
 */
function formatarDias(dias) {
  return `Publicada há ${dias} dia${dias !== 1 ? 's' : ''}`;
}

/**
 * Busca JSON de forma segura com tratamento de erro.
 * PASSO 9 — B2: XHR substituído por fetch com tratamento de erro
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Erro ao carregar ${url}: ${resposta.status}`);
  }
  return resposta.json();
}

/**
 * Mostra mensagem de erro inline em um campo de formulário.
 * PASSO 8 — A4: substitui alert() por feedback inline acessível
 * @param {string} campoId — id do input
 * @param {string} erroId  — id do span de erro
 * @param {string} mensagem
 */
function mostrarErro(campoId, erroId, mensagem) {
  const campo = document.getElementById(campoId);
  const erro  = document.getElementById(erroId);
  if (campo) campo.setAttribute('aria-invalid', 'true');
  if (erro) {
    erro.textContent = mensagem;
    erro.style.display = 'block';
  }
}

/**
 * Limpa o erro de um campo de formulário.
 * @param {string} campoId
 * @param {string} erroId
 */
function limparErro(campoId, erroId) {
  const campo = document.getElementById(campoId);
  const erro  = document.getElementById(erroId);
  if (campo) campo.removeAttribute('aria-invalid');
  if (erro) {
    erro.textContent = '';
    erro.style.display = 'none';
  }
}
