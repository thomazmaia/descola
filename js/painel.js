// VERSÃO ANTES — dívidas técnicas propositais
// DÍVIDA TÉCNICA CRÍTICA: credenciais hardcoded no JS (visível no código-fonte)
// Qualquer pessoa pode ver usuário e senha abrindo o DevTools

var USUARIO_FIXO = 'recrutador@descola.app';
var SENHA_FIXA = 'descola123';

function fazerLogin(e) {
  e.preventDefault();
  var usuario = document.getElementById('login-usuario').value;
  var senha = document.getElementById('login-senha').value;

  // DÍVIDA TÉCNICA: comparação de senha em texto puro no frontend
  if (usuario === USUARIO_FIXO && senha === SENHA_FIXA) {
    localStorage.setItem('logado', 'true');
    localStorage.setItem('nomeEmpresa', 'Empresa Exemplo');
    mostrarPainel();
  } else {
    // DÍVIDA TÉCNICA: alert() inacessível
    alert('Usuário ou senha incorretos.');
  }
}

// DÍVIDA TÉCNICA: sem verificação real de sessão — localStorage trivialmente manipulável
function verificarLogin() {
  if (localStorage.getItem('logado') !== 'true') {
    mostrarLogin();
  } else {
    mostrarPainel();
  }
}

function mostrarLogin() {
  document.getElementById('area-login').style.display = 'flex';
  document.getElementById('area-painel').style.display = 'none';
}

function mostrarPainel() {
  document.getElementById('area-login').style.display = 'none';
  document.getElementById('area-painel').style.display = 'block';

  var nome = localStorage.getItem('nomeEmpresa') || 'Empresa';
  // DÍVIDA TÉCNICA: innerHTML com dado do localStorage sem sanitização
  document.getElementById('nome-empresa').innerHTML = nome;

  carregarVagasRecrutador();
}

// DÍVIDA TÉCNICA: dados de vagas do recrutador hardcoded no JS (deveria vir de API)
var vagasRecrutador = [
  { id: 1, titulo: 'Assistente de marketing', meta: 'Publicada há 1 dia · 8 candidatos', status: 'Ativa' },
  { id: 2, titulo: 'Auxiliar de atendimento', meta: 'Publicada há 5 dias · 14 candidatos', status: 'Ativa' },
  { id: 6, titulo: 'Jovem aprendiz — TI', meta: 'Encerrada há 10 dias · 5 candidatos', status: 'Encerrada' }
];

var candidatosRecentes = [
  { nome: 'João Oliveira', vaga: 'Assistente de marketing', tempo: 'Há 2h' },
  { nome: 'Maria Silva', vaga: 'Auxiliar de atendimento', tempo: 'Há 5h' },
  { nome: 'Pedro Costa', vaga: 'Assistente de marketing', tempo: 'Ontem' }
];

// DÍVIDA TÉCNICA: função gigante sem separação
function carregarVagasRecrutador() {
  var container = document.getElementById('vagas-recrutador');
  if (!container) return;

  var html = '';
  for (var i = 0; i < vagasRecrutador.length; i++) {
    var v = vagasRecrutador[i];
    var statusClass = v.status === 'Ativa' ? 'status-ativa' : 'status-encerrada';
    html += '<div class="vaga-rec-item">';
    html += '  <div class="vaga-rec-top">';
    html += '    <div><h3>' + v.titulo + '</h3><p class="meta">' + v.meta + '</p></div>';
    html += '    <span class="' + statusClass + '">' + v.status + '</span>';
    html += '  </div>';
    html += '  <div class="vaga-rec-acoes">';
    html += '    <button class="btn-xs btn-xs-ver">Ver candidatos</button>';
    if (v.status === 'Ativa') {
      html += '    <button class="btn-xs btn-xs-editar">Editar</button>';
      html += '    <button class="btn-xs btn-xs-encerrar">Encerrar</button>';
    } else {
      html += '    <button class="btn-xs btn-xs-editar">Reabrir</button>';
    }
    html += '  </div>';
    html += '</div>';
  }
  container.innerHTML = html;

  var contCand = document.getElementById('candidatos-recentes');
  if (!contCand) return;
  var htmlC = '';
  for (var j = 0; j < candidatosRecentes.length; j++) {
    var c = candidatosRecentes[j];
    var iniciais = c.nome.split(' ').map(function(p) { return p[0]; }).join('').substring(0, 2);
    htmlC += '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:0.5px solid #E0DED9;">';
    htmlC += '  <div style="width:36px;height:36px;border-radius:50%;background:#E6F1FB;color:#0C447C;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">' + iniciais + '</div>';
    htmlC += '  <div style="flex:1;"><div style="font-size:13px;font-weight:600;">' + c.nome + '</div>';
    htmlC += '    <div style="font-size:11px;color:#6B6B67;">' + c.vaga + ' · ' + c.tempo + '</div></div>';
    htmlC += '  <button class="btn-xs btn-xs-ver">Ver</button>';
    htmlC += '</div>';
  }
  contCand.innerHTML = htmlC;
}

function sair() {
  localStorage.removeItem('logado');
  localStorage.removeItem('nomeEmpresa');
  mostrarLogin();
}

window.onload = function() {
  verificarLogin();
  var formLogin = document.getElementById('form-login');
  if (formLogin) formLogin.addEventListener('submit', fazerLogin);
};
