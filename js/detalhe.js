// VERSÃO ANTES — dívidas técnicas propositais
// Problemas: lógica de badge duplicada de main.js, sem tratamento de erro,
// innerHTML sem sanitização, acesso direto ao localStorage sem try/catch

// DÍVIDA TÉCNICA: lógica de badge duplicada (viola DRY)
function getBadgeModalidade(modalidade) {
  if (modalidade === 'Presencial') return '<span class="badge-modalidade-presencial">Presencial</span>';
  if (modalidade === 'Hibrido') return '<span class="badge-modalidade-hibrido">Híbrido</span>';
  if (modalidade === 'Remoto') return '<span class="badge-modalidade-remoto">Remoto</span>';
  return '<span class="badge-tipo">' + modalidade + '</span>';
}

// DÍVIDA TÉCNICA: função gigante, sem separação de responsabilidades
function carregarDetalhe() {
  // DÍVIDA TÉCNICA: sem try/catch no localStorage
  var id = parseInt(localStorage.getItem('vagaId'));
  if (!id) {
    window.location.href = 'vagas.html';
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/vagas.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var vagas = JSON.parse(xhr.responseText);
      // DÍVIDA TÉCNICA: magic number — loop manual sem find()
      var vaga = null;
      for (var i = 0; i < vagas.length; i++) {
        if (vagas[i].id == id) { vaga = vagas[i]; break; }
      }
      if (!vaga) { window.location.href = 'vagas.html'; return; }

      // DÍVIDA TÉCNICA: innerHTML massivo sem sanitização
      document.getElementById('detalhe-badges').innerHTML =
        '<span class="badge-tipo">' + vaga.tipo + '</span>' +
        getBadgeModalidade(vaga.modalidade) +
        '<span class="badge-tipo">' + vaga.nivel + '</span>';

      document.getElementById('detalhe-titulo').textContent = vaga.titulo;
      document.getElementById('detalhe-empresa').textContent = vaga.empresa + ' · ' + vaga.cidade + ', ' + vaga.estado;

      document.getElementById('detalhe-carga').textContent = vaga.carga;
      document.getElementById('detalhe-bolsa').textContent = vaga.bolsa;
      document.getElementById('detalhe-publicada').textContent = 'Há ' + vaga.publicada + ' dia' + (vaga.publicada > 1 ? 's' : '');
      document.getElementById('detalhe-encerra').textContent = vaga.encerra + ' dias';

      document.getElementById('detalhe-descricao').textContent = vaga.descricao;

      var reqHtml = '';
      for (var r = 0; r < vaga.requisitos.length; r++) {
        reqHtml += '<li>' + vaga.requisitos[r] + '</li>';
      }
      document.getElementById('detalhe-requisitos').innerHTML = reqHtml;

      var benHtml = '';
      for (var b = 0; b < vaga.beneficios.length; b++) {
        benHtml += '<div class="beneficio-item">' + vaga.beneficios[b] + '</div>';
      }
      document.getElementById('detalhe-beneficios').innerHTML = benHtml;

      document.title = vaga.titulo + ' — Descola';

      // salva para uso no formulário
      localStorage.setItem('vagaTitulo', vaga.titulo);
      localStorage.setItem('vagaEmpresa', vaga.empresa);
    }
  };
  xhr.send();
}

function irParaCandidatura() {
  window.location.href = 'candidatura.html';
}

window.onload = function() {
  carregarDetalhe();
};
