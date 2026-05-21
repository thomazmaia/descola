# Descola 🚀

> **Descole sua vaga. Comece hoje.**

Plataforma web gratuita que conecta jovens em situação de vulnerabilidade (16–24 anos) às suas primeiras oportunidades de emprego, estágio e aprendizagem — sem cadastro obrigatório, sem exigência de currículo e sem burocracia.

[![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-100%2F100-1A3A2A?style=flat-square&logo=lighthouse)](https://thomazmaia.github.io/descola/)
[![Lighthouse Performance](https://img.shields.io/badge/Performance-94--99%2F100-1A3A2A?style=flat-square&logo=lighthouse)](https://thomazmaia.github.io/descola/)
[![Lighthouse SEO](https://img.shields.io/badge/SEO-100%2F100-1A3A2A?style=flat-square&logo=lighthouse)](https://thomazmaia.github.io/descola/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2E7D52?style=flat-square&logo=githubactions)](https://github.com/thomazmaia/descola/actions)
[![ODS 8](https://img.shields.io/badge/ODS%208-Trabalho%20Decente-F5A623?style=flat-square)](https://brasil.un.org/pt-br/sdgs/8)

---

## 🌐 Acesse o projeto

**[https://thomazmaia.github.io/descola/](https://thomazmaia.github.io/descola/)**

---

## 📋 Sobre o projeto

O **Descola** nasceu como projeto de extensão universitária da disciplina de Transformação Digital da Universidade de Fortaleza (Unifor), alinhado ao **ODS 8 — Trabalho Decente e Crescimento Econômico** da Agenda 2030 da ONU.

O desemprego juvenil no Brasil atinge mais de 30% dos jovens entre 18 e 24 anos. Entre os que vivem em regiões periféricas e têm baixa escolaridade, a barreira de entrada ao mercado formal é ainda maior — agravada pela falta de acesso a plataformas de emprego que sejam realmente inclusivas, simples e gratuitas.

O Descola endereça essa lacuna diretamente.

---

## ✨ Funcionalidades

| Tela | Funcionalidade |
|---|---|
| **Home** | Busca por cargo/área, filtros rápidos, vagas em destaque |
| **Lista de vagas** | Grid filtráveis por tipo, modalidade e área, com paginação |
| **Detalhe da vaga** | Informações completas, requisitos, benefícios e candidatura |
| **Formulário de candidatura** | Dados pessoais, currículo opcional, aceite LGPD |
| **Painel do recrutador** | Gestão de vagas publicadas e candidatos recebidos |
| **Sobre / Ajuda** | Missão ODS 8, como funciona, FAQ e declaração de acessibilidade |

---

## 🛠️ Stack tecnológica

```
HTML5 semântico · CSS3 (com variáveis CSS) · JavaScript ES6+
Dados: vagas.json (estático)
Deploy: GitHub Pages
CI/CD: GitHub Actions
Análise estática: ESLint · Stylelint · HTMLHint
```

Sem frameworks, sem dependências externas — projeto acessível a qualquer nível de experiência.

---

## 📁 Estrutura do projeto

```
descola/
├── index.html              # Home
├── vagas.html              # Lista de vagas
├── vaga-detalhe.html       # Detalhe da vaga
├── candidatura.html        # Formulário de candidatura
├── painel.html             # Painel do recrutador
├── sobre.html              # Sobre / Ajuda
├── css/
│   └── style.css           # Estilos com variáveis CSS e media queries
├── js/
│   ├── utils.js            # Funções compartilhadas (DRY)
│   ├── main.js             # Lógica de busca, filtros e paginação
│   ├── detalhe.js          # Lógica da página de detalhe
│   ├── candidatura.js      # Validação inline e envio do formulário
│   └── painel.js           # Lógica do painel do recrutador
├── data/
│   ├── vagas.json          # Base de dados de vagas
│   └── painel-data.json    # Dados do painel do recrutador
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # Pipeline: lint → build → deploy
└── CHECKLIST_PRE_LANCAMENTO.md
```

---

## ⚡ Pipeline CI/CD

A cada `push` para a branch `main`, o GitHub Actions executa automaticamente:

```
Job 1 — Análise estática (14s)
  ├── ESLint (JavaScript)
  ├── Stylelint (CSS)
  └── HTMLHint (HTML)

Job 2 — Build e validação (6s)
  ├── Verifica arquivos obrigatórios
  └── Valida vagas.json

Job 3 — Deploy (10s)
  └── GitHub Pages → https://thomazmaia.github.io/descola/
```

**Duração total: ~38 segundos do push ao ar.**

---

## ♿ Acessibilidade

O Descola foi construído com acessibilidade como requisito de arquitetura, não como correção posterior.

| Critério | Status |
|---|---|
| WCAG 2.1 nível AA | ✅ Conforme |
| Score Lighthouse Accessibility | ✅ 100/100 em todas as páginas |
| Navegação por teclado | ✅ Suportada (Tab, Enter, Space) |
| Skip link | ✅ Presente em todas as páginas |
| `lang="pt-BR"` | ✅ Em todos os HTMLs |
| Roles ARIA | ✅ navigation, main, search, contentinfo, status, alert |
| Responsividade mobile | ✅ 3 breakpoints (1024px, 768px, 400px) |

---

## 📊 Resultados do teste de usabilidade

Teste conduzido com **10 alunos de escola pública de Fortaleza** (16–20 anos):

| KPI | Meta | Resultado |
|---|---|---|
| Taxa de candidatura | > 15% | **100%** |
| Tempo médio por tarefa | < 4 min | **2min 51s** |
| Taxa de erro técnico | < 5% | **0%** |
| Intenção de retorno | > 20% | **60% "Sim"** |
| NPS | > 50 | **+30** |

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/thomazmaia/descola.git
cd descola

# Sirva os arquivos com qualquer servidor estático
# Opção 1: VS Code com extensão Live Server
# Opção 2: Python
python3 -m http.server 8080

# Acesse em: http://localhost:8080
```

> Não há instalação de dependências — o projeto é 100% estático.

---

## 🔍 Análise estática

```bash
# Instalar ferramentas globalmente
npm install -g eslint stylelint htmlhint stylelint-config-standard

# Rodar análise
eslint js/*.js
stylelint "css/style.css"
htmlhint "*.html"
```

---

## 👥 Equipe — Grupo 8 · Unifor 2026

| Nome | Matrícula |
|---|---|
| Amanda Duarte Macedo | 2415526 |
| Giuseppe Sarto Carvalho Rodrigues | 2425265 |
| José Aurélio Basílio Madeira Neto | 2425116 |
| Lara Luisa Félix Nunes da Silva | 2425072 |
| Luiz Felipe Sousa Paiva | 2425122 |
| Thomaz Maia de Almeida | 2425266 |

**Disciplina:** Transformação Digital  
**Professor:** Belmondo Rodrigues Aragão  
**Universidade de Fortaleza — Graduação em Análise e Desenvolvimento de Sistemas**  
**Maio de 2026**

---

## 🌱 Alinhamento ODS 8

> *"Promover o crescimento econômico inclusivo e sustentável, o emprego pleno e produtivo e o trabalho digno para todos."*
> — ONU, Agenda 2030

O Descola endereça diretamente as metas **8.5** (emprego pleno e produtivo), **8.6** (redução do desemprego jovem) e **8.b** (estratégia global para emprego jovem), oferecendo uma solução gratuita, acessível e sem barreiras para quem mais precisa de uma primeira chance.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e de extensão universitária.  
Livre para uso educacional com atribuição à equipe original.
