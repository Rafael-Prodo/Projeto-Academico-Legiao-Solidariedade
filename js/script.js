// script.js comportamento compartilhado entre todas as páginas

(function () {
    'use strict';

    var paginaAtual = 0;

    // Atualiza o ano no rodapé automaticamente
    function atualizarAno() {
        var anoAtual = document.getElementById('anoAtual');
        if (anoAtual) {
            anoAtual.textContent = new Date().getFullYear();
        }
    }

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

    function atualizarNavegacao(url) {
        document.querySelectorAll('#navPrincipal .nav__link').forEach(function (link) {
            var destino = new URL(link.href, window.location.href);
            if (destino.pathname === url.pathname) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        var nav = document.getElementById('navPrincipal');
        var botaoMenu = document.getElementById('menuToggle');
        if (nav) nav.classList.remove('nav--aberto');
        if (botaoMenu) botaoMenu.setAttribute('aria-expanded', 'false');
    }

    function carregarScripts(documento, url, idPagina) {
        var scripts = Array.from(documento.querySelectorAll('script[src]'));
        var fila = Promise.resolve();

        scripts.forEach(function (scriptOriginal) {
            var src = new URL(scriptOriginal.getAttribute('src'), url);
            if (src.pathname.endsWith('/js/script.js')) return;

            fila = fila.then(function () {
                if (idPagina !== paginaAtual) return;
                return new Promise(function (resolver, rejeitar) {
                    var script = document.createElement('script');
                    script.src = src.href;
                    script.onload = resolver;
                    script.onerror = function () {
                        rejeitar(new Error('Não foi possível carregar ' + src.pathname));
                    };
                    document.body.appendChild(script);
                });
            });
        });

        return fila;
    }

    function navegar(url, adicionarHistorico) {
        if (!/^https?:$/.test(url.protocol)) {
            window.location.href = url.href;
            return Promise.resolve();
        }

        var idPagina = ++paginaAtual;
        return fetch(url.href, { headers: { Accept: 'text/html' } })
            .then(function (resposta) {
                if (!resposta.ok) throw new Error('A página não foi encontrada.');
                return resposta.text();
            })
            .then(function (html) {
                if (idPagina !== paginaAtual) return;

                var documento = new DOMParser().parseFromString(html, 'text/html');
                var novoConteudo = documento.querySelector('#conteudo-principal');
                var conteudoAtual = document.getElementById('conteudo-principal');
                if (!novoConteudo || !conteudoAtual) throw new Error('Conteúdo principal ausente.');

                conteudoAtual.replaceWith(document.importNode(novoConteudo, true));
                document.title = documento.title;

                var descricaoAtual = document.querySelector('meta[name="description"]');
                var novaDescricao = documento.querySelector('meta[name="description"]');
                if (descricaoAtual && novaDescricao) {
                    descricaoAtual.content = novaDescricao.content;
                }

                if (adicionarHistorico) {
                    window.history.pushState({}, '', url.href);
                }

                atualizarNavegacao(url);
                atualizarAno();
                var conteudoPrincipal = document.getElementById('conteudo-principal');
                conteudoPrincipal.setAttribute('tabindex', '-1');
                conteudoPrincipal.focus();
                window.scrollTo(0, 0);

                return carregarScripts(documento, url, idPagina).catch(function (erro) {
                    console.error(erro);
                });
            });
    }

    document.addEventListener('click', function (evento) {
        if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

        var link = evento.target.closest('a[href]');
        if (!link || link.target || link.hasAttribute('download') || link.getAttribute('href').charAt(0) === '#') return;

        var url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || !url.pathname.endsWith('.html')) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;

        evento.preventDefault();
        navegar(url, true).catch(function () {
            window.location.href = url.href;
        });
    });

    window.addEventListener('popstate', function () {
        navegar(new URL(window.location.href), false).catch(function () {
            window.location.reload();
        });
    });

    atualizarAno();
    configurarMenu();
})();