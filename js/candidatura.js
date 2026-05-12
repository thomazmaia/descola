// VERSÃO ANTES — dívidas técnicas propositais
// Problemas: validação manual duplicada, sem feedback acessível,
// sem aria-invalid, mensagens de erro genéricas

function validarForm() {
  var nome = document.getElementById('nome').value.trim();
  var email = document.getElementById('email').value.trim();
  var tel = document.getElementById('tel').value.trim();
  var lgpd = document.getElementById('lgpd').checked;

  // DÍVIDA TÉCNICA: alert() como feedback — inacessível e bloqueante
  if (!nome) { alert('Por favor, informe seu nome.'); return false; }
  if (!email) { alert('Por favor, informe seu e-mail.'); return false; }
  if (!tel) { alert('Por favor, informe seu telefone.'); return false; }
  if (!lgpd) { alert('Você precisa aceitar a política de privacidade.'); return false; }

  // DÍVIDA TÉCNICA: sem aria-invalid nos campos com erro
  // DÍVIDA TÉCNICA: email não validado com regex
  return true;
}

function enviarCandidatura(e) {
  e.preventDefault();
  if (!validarForm()) return;

  // Simula envio
  var titulo = localStorage.getItem('vagaTitulo') || 'vaga';
  var empresa = localStorage.getItem('vagaEmpresa') || '';

  // DÍVIDA TÉCNICA: innerHTML para exibir dado do usuário sem escape
  document.getElementById('form-card').innerHTML =
    '<div style="text-align:center;padding:40px;">' +
    '<div style="font-size:48px;margin-bottom:16px;">✅</div>' +
    '<h2 style="color:#1A3A2A;margin-bottom:8px;">Candidatura enviada!</h2>' +
    '<p style="color:#6B6B67;">Você se candidatou para <strong>' + titulo + '</strong>' +
    (empresa ? ' na ' + empresa : '') + '.</p>' +
    '<p style="color:#6B6B67;margin-top:8px;">Aguarde o contato da empresa.</p>' +
    '<a href="index.html" style="display:inline-block;margin-top:24px;" class="btn-primary">Voltar ao início</a>' +
    '</div>';
}

window.onload = function() {
  var titulo = localStorage.getItem('vagaTitulo');
  var empresa = localStorage.getItem('vagaEmpresa');
  if (titulo) {
    var el = document.getElementById('form-subtitulo');
    if (el) el.textContent = (empresa ? empresa + ' · ' : '') + titulo;
  }

  var form = document.getElementById('form-candidatura');
  if (form) form.addEventListener('submit', enviarCandidatura);
};
