// templates.js — sistema de templates para componentes repetitivos.
//
// Técnica adotada: elemento <template> do HTML5 + cloneNode(true), em vez de
// interpolação de strings com Template Literals + innerHTML. O <template> tem
// seu conteúdo inerte (não é renderizado, scripts internos não executam, e
// imagens/recursos não são baixados até a clonagem), e a clonagem devolve nós
// reais do DOM, preenchidos via querySelector + textContent — não via
// concatenação de HTML, o que evita reprocessar/reparsear marcação e afasta
// riscos de injeção caso os dados de origem um dia venham de fora do projeto.

var EloTemplates = (function () {
  'use strict';

  var DADOS_PROJETOS = [
    {
      categoria: 'Educação',
      titulo: 'Reforço Escolar Comunitário',
      descricao: 'Aulas de reforço em português e matemática para crianças e adolescentes de escolas públicas em situação de vulnerabilidade, com apoio de voluntários da área da educação.',
      frequencia: 'Segundas e quartas',
      voluntarios: '32 ativos'
    },
    {
      categoria: 'Meio Ambiente',
      titulo: 'Coleta Seletiva Solidária',
      descricao: 'Parceria com cooperativas de catadores para ampliar a renda de famílias por meio da coleta seletiva, incluindo oficinas de educação ambiental nas escolas parceiras.',
      frequencia: 'Aos sábados',
      voluntarios: '18 ativos'
    },
    {
      categoria: 'Assistência Social',
      titulo: 'Cesta Solidária',
      descricao: 'Arrecadação e distribuição mensal de cestas básicas para famílias em situação de insegurança alimentar, com triagem social feita por assistentes sociais voluntários.',
      frequencia: 'Mensal',
      voluntarios: '45 ativos'
    },
    {
      categoria: 'Tecnologia',
      titulo: 'Inclusão Digital Sênior',
      descricao: 'Oficinas gratuitas de introdução ao uso de smartphones e internet para idosos, promovendo autonomia digital e combate ao isolamento social.',
      frequencia: 'Quinzenal',
      voluntarios: '12 ativos'
    },
    {
      categoria: 'Saúde',
      titulo: 'Bem-Estar em Ação',
      descricao: 'Rodas de conversa e orientação básica sobre saúde mental e prevenção de doenças, conduzidas por profissionais voluntários da área da saúde.',
      frequencia: 'Mensal',
      voluntarios: '9 ativos'
    },
    {
      categoria: 'Cultura',
      titulo: 'Arte na Comunidade',
      descricao: 'Oficinas de teatro, música e artes visuais para crianças e jovens, utilizando a expressão artística como ferramenta de desenvolvimento social e emocional.',
      frequencia: 'Semanal',
      voluntarios: '21 ativos'
    }
  ];

  var DADOS_NUMEROS = [
    { valor: '3.200+', rotulo: 'Pessoas impactadas' },
    { valor: '480', rotulo: 'Voluntários ativos' },
    { valor: '27', rotulo: 'Projetos em andamento' },
    { valor: '12', rotulo: 'Anos de atuação' }
  ];

  function renderizarProjetos() {
    var contêiner = document.getElementById('projetos-grade');
    var template = document.getElementById('template-projeto');
    if (!contêiner || !template) return; // esta view não tem grade de projetos
    if (contêiner.dataset.renderizado === 'true') return;

    var fragmento = document.createDocumentFragment();

    DADOS_PROJETOS.forEach(function (projeto, indice) {
      var no = template.content.cloneNode(true);
      var idBase = 'projeto-' + (indice + 1);

      var artigo = no.querySelector('.projeto-card');
      artigo.setAttribute('aria-labelledby', idBase);

      no.querySelector('.projeto-card__categoria').textContent = projeto.categoria;

      var titulo = no.querySelector('h3');
      titulo.id = idBase;
      titulo.textContent = projeto.titulo;

      no.querySelector('.projeto-card__descricao').textContent = projeto.descricao;

      var metas = no.querySelectorAll('.projeto-card__meta dd');
      metas[0].textContent = projeto.frequencia;
      metas[1].textContent = projeto.voluntarios;

      fragmento.appendChild(no);
    });

    contêiner.appendChild(fragmento);
    contêiner.dataset.renderizado = 'true';
  }

  function renderizarNumeros() {
    var contêiner = document.getElementById('numeros-grade');
    var template = document.getElementById('template-numero');
    if (!contêiner || !template) return; // esta view não tem grade de números
    if (contêiner.dataset.renderizado === 'true') return;

    var fragmento = document.createDocumentFragment();

    DADOS_NUMEROS.forEach(function (item) {
      var no = template.content.cloneNode(true);
      no.querySelector('.numero-card__valor').textContent = item.valor;
      no.querySelector('.numero-card__rotulo').textContent = item.rotulo;
      fragmento.appendChild(no);
    });

    contêiner.appendChild(fragmento);
    contêiner.dataset.renderizado = 'true';
  }

  function renderizarPagina() {
    renderizarProjetos();
    renderizarNumeros();
  }

  return { renderizarPagina: renderizarPagina };
})();

window.EloTemplates = EloTemplates;

// Carregamento tradicional (primeira visita, atualização de página): os
// contêineres já existem no HTML inicial, então renderiza imediatamente.
EloTemplates.renderizarPagina();