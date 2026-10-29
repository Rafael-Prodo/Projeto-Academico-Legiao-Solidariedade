// script.js — comportamento compartilhado entre todas as páginas.
// A navegação sem recarregar (PJAX) fica exclusivamente em js/spa.js.

(function () {
  'use strict';

  // Atualiza o ano no rodapé automaticamente
  function atualizarAno() {
    var anoAtual = document.getElementById('anoAtual');
    if (anoAtual) {
      anoAtual.textContent = new Date().getFullYear();
    }
  }

  // Menu mobile. O <header> não é trocado na navegação, então basta ligar uma vez.
  function configurarMenu() {
    var botaoMenu = document.getElementById('menuToggle');
    var nav = document.getElementById('navPrincipal');
    if (!botaoMenu || !nav) return;

    botaoMenu.addEventListener('click', function () {
      var aberto = nav.classList.toggle('nav--aberto');
      botaoMenu.setAttribute('aria-expanded', String(aberto));
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  atualizarAno();
  configurarMenu();
})();
