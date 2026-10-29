// spa.js — camada de Single Page Application sobre as três páginas estáticas.
//
// Estratégia adotada: PJAX (pushState + AJAX). Em vez de reescrever o site como
// um app 100% client-side, reaproveitamos os três documentos HTML já validados
// (index.html, projetos.html, cadastro.html) como "fontes de verdade" de cada
// rota. A navegação interna passa a ser interceptada; em vez de o navegador
// descartar o documento e requisitar outro do zero, buscamos o HTML de destino
// via fetch, extraímos apenas o <main id="conteudo-principal"> e o injetamos
// no lugar do main atual, preservando header/nav/footer intactos.

(function () {
  'use strict';

  var PADRAO_ROTA_LOCAL = /\/(index|projetos|cadastro)\.html$/;

  var app = document.getElementById('conteudo-principal');
  if (!app) return;

  var anunciador = document.getElementById('anuncioRota');

  function inicializarViewAtual() {
    if (window.EloTemplates) {
      window.EloTemplates.renderizarPagina();
    }
    if (window.EloHistorico) {
      window.EloHistorico.renderizar();
    }
    if (window.EloGrafico) {
      window.EloGrafico.iniciar();
    }
    if (window.EloCadastro && document.getElementById('formCadastro')) {
      window.EloCadastro.iniciar();
    }
  }

  function atualizarLinkAtivo(caminho) {
    document.querySelectorAll('.nav__link').forEach(function (link) {
      var destino = new URL(link.getAttribute('href'), window.location.origin).pathname;
      if (destino === caminho) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function renderizarDocumento(doc, caminho, empilharHistorico) {
    var novoMain = doc.getElementById('conteudo-principal');
    if (!novoMain) {
      // Documento de destino não segue o mesmo contrato estrutural: recorre
      // à navegação tradicional do navegador em vez de deixar a página quebrada.
      window.location.href = caminho;
      return;
    }

    app.innerHTML = novoMain.innerHTML;
    document.title = doc.title;

    var metaAtual = document.querySelector('meta[name="description"]');
    var metaNova = doc.querySelector('meta[name="description"]');
    if (metaAtual && metaNova) {
      metaAtual.setAttribute('content', metaNova.getAttribute('content'));
    }

    atualizarLinkAtivo(caminho);

    if (empilharHistorico) {
      history.pushState({ caminho: caminho }, '', caminho);
    }

    // Gestão de foco e anúncio de rota: compensa a ausência do "salto" de
    // contexto que um carregamento tradicional de página dá a leitores de tela.
    window.scrollTo(0, 0);
    app.setAttribute('tabindex', '-1');
    app.focus();
    if (anunciador) {
      anunciador.textContent = 'Página carregada: ' + doc.title;
    }

    inicializarViewAtual();
  }

  function navegarPara(caminho, empilharHistorico) {
    fetch(caminho)
      .then(function (resposta) {
        if (!resposta.ok) throw new Error('Falha ao carregar ' + caminho);
        return resposta.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        renderizarDocumento(doc, caminho, empilharHistorico);
      })
      .catch(function () {
        // Falha de rede, servidor sem suporte a fetch local (file://) etc.:
        // cai para a navegação tradicional, que sempre funciona.
        window.location.href = caminho;
      });
  }

  document.addEventListener('click', function (evento) {
    var link = evento.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    if (href.indexOf('#') === 0) return; // âncora interna (ex.: link "pular para o conteúdo")

    var novaAba = evento.metaKey || evento.ctrlKey || evento.shiftKey || link.target === '_blank';
    if (novaAba) return;

    var url = new URL(link.href, window.location.href);
    var mesmaOrigem = url.origin === window.location.origin;
    if (!mesmaOrigem || !PADRAO_ROTA_LOCAL.test(url.pathname)) return;

    if (url.pathname === window.location.pathname) {
      evento.preventDefault(); // já estamos nesta página: apenas ignora o clique, sem recarregar
      return;
    }

    evento.preventDefault();
    navegarPara(url.pathname, true);
  });

  window.addEventListener('popstate', function () {
    navegarPara(window.location.pathname, false);
  });

  // Carregamento tradicional (primeira visita, atualização de página, link
  // direto): garante que o formulário, se presente nesta view, seja iniciado.
  inicializarViewAtual();
})();
