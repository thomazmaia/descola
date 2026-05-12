// VERSÃO ANTES — contém dívidas técnicas propositais para fins acadêmicos
// Problemas: função gigante sem separação de responsabilidades,
// variáveis globais, sem tratamento de erro, innerHTML inseguro,
// repetição de lógica, magic numbers

var todasVagas = [];
var vagaAtual = null;
var paginaAtual = 1;
var vagasPorPagina = 6;

// DÍVIDA TÉCNICA: função gigante que faz tudo (viola SRP)
function carregarVagas() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/vagas.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      todasVagas = JSON.parse(xhr.responseText);
      renderizarCards(todasVagas);
      renderizarPaginacao(todasVagas.length);
    }
    // DÍVIDA TÉCNICA: sem tratamento de erro (status != 200)
  };
  xhr.send();
}

// DÍVIDA TÉCNICA: innerHTML com dados externos sem sanitização
function renderizarCards(vagas) {
  var container = document.getElementById('vagas-container');
  if (!container) return;

  var inicio = (paginaAtual - 1) * vagasPorPagina;
  var fim = inicio + vagasPorPagina;
  var vagasPagina = vagas.slice(inicio, fim);

  var html = '';
  for (var i = 0; i < vagasPagina.length; i++) {
    var v = vagasPagina[i];
    // DÍVIDA TÉCNICA: lógica de badge repetida aqui e em vaga-detalhe.js
    var classModal = 'badge-modalidade-' + v.modalidade.toLowerCase();
    html += '<div class="card-vaga" onclick="irParaDetalhe(' + v.id + ')">';
    html += '  <div class="badges">';
    html += '    <span class="badge-tipo">' + v.tipo + '</span>';
    html += '    <span class="' + classModal + '">' + v.modalidade + '</span>';
    html += '  </div>';
    html += '  <h3>' + v.titulo + '</h3>';
    html += '  <p class="empresa">' + v.empresa + ' · ' + v.cidade + ', ' + v.estado + '</p>';
    html += '  <div class="rodape">';
    html += '    <span class="tempo">Publicada há ' + v.publicada + ' dia' + (v.publicada > 1 ? 's' : '') + '</span>';
    html += '    <button class="btn-primary">Ver vaga</button>';
    html += '  </div>';
    html += '</div>';
  }

  if (vagasPagina.length === 0) {
    html = '<p style="text-align:center;color:#6B6B67;padding:40px;">Nenhuma vaga encontrada.</p>';
  }

  container.innerHTML = html;
}

function renderizarPaginacao(total) {
  var container = document.getElementById('paginacao');
  if (!container) return;
  var totalPaginas = Math.ceil(total / vagasPorPagina);
  var html = '';
  html += '<button class="pag-btn" onclick="mudarPagina(' + (paginaAtual - 1) + ')">&#8249;</button>';
  for (var p = 1; p <= totalPaginas; p++) {
    var ativo = p === paginaAtual ? ' ativo' : '';
    html += '<button class="pag-btn' + ativo + '" onclick="mudarPagina(' + p + ')">' + p + '</button>';
  }
  html += '<button class="pag-btn" onclick="mudarPagina(' + (paginaAtual + 1) + ')">&#8250;</button>';
  container.innerHTML = html;
}

function mudarPagina(p) {
  var total = todasVagas.length;
  var totalPaginas = Math.ceil(total / vagasPorPagina);
  if (p < 1 || p > totalPaginas) return;
  paginaAtual = p;
  renderizarCards(todasVagas);
  renderizarPaginacao(total);
}

function irParaDetalhe(id) {
  localStorage.setItem('vagaId', id);
  window.location.href = 'vaga-detalhe.html';
}

// DÍVIDA TÉCNICA: lógica de filtro e busca misturada na mesma função
function filtrarVagas() {
  var busca = document.getElementById('busca') ? document.getElementById('busca').value.toLowerCase() : '';
  var tipoAtivo = document.querySelector('.chip-ativo') ? document.querySelector('.chip-ativo').dataset.tipo : 'todos';

  var resultado = todasVagas.filter(function(v) {
    var matchBusca = v.titulo.toLowerCase().includes(busca) ||
                     v.empresa.toLowerCase().includes(busca) ||
                     v.cidade.toLowerCase().includes(busca) ||
                     v.area.toLowerCase().includes(busca);
    var matchTipo = tipoAtivo === 'todos' || v.tipo === tipoAtivo || v.modalidade === tipoAtivo || v.area === tipoAtivo;
    return matchBusca && matchTipo;
  });

  paginaAtual = 1;
  renderizarCards(resultado);
  renderizarPaginacao(resultado.length);

  var contador = document.getElementById('contador');
  if (contador) {
    contador.textContent = resultado.length + ' vagas encontradas';
  }
}

function ativarChip(el) {
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function(c) { c.classList.remove('chip-ativo'); });
  el.classList.add('chip-ativo');
  filtrarVagas();
}

// DÍVIDA TÉCNICA: inicialização misturada com lógica de negócio
window.onload = function() {
  carregarVagas();

  var inputBusca = document.getElementById('busca');
  if (inputBusca) {
    inputBusca.addEventListener('input', filtrarVagas);
  }

  var formBusca = document.getElementById('form-busca');
  if (formBusca) {
    formBusca.addEventListener('submit', function(e) {
      e.preventDefault();
      filtrarVagas();
    });
  }
};
