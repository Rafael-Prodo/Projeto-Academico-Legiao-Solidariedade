// historico.js — persiste, no localStorage do navegador, um histórico leve
// dos cadastros enviados com sucesso, e restaura essa lista na interface a
// cada carregamento da view de cadastro.
//
// Decisão de projeto: apenas nome, área de interesse e data são armazenados.
// CPF, telefone, CEP e e-mail nunca são gravados em localStorage, pois trata-se
// de um armazenamento não criptografado e acessível a qualquer script no
// mesmo domínio — manter dados sensíveis fora dele é uma medida de segurança
// deliberada, não uma limitação técnica.

var EloHistorico = (function () {
  'use strict';

  var CHAVE = 'legiaoSolidariedade:historicoCadastros';
  var MAXIMO_REGISTROS = 5;

  function lerHistorico() {
    var bruto;
    try {
      bruto = localStorage.getItem(CHAVE);
    } catch (erro) {
      return []; // localStorage indisponível (modo privado restrito, por exemplo)
    }
    if (!bruto) return [];
    try {
      var lista = JSON.parse(bruto);
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      return []; // conteúdo corrompido: trata como histórico vazio
    }
  }

  function salvarHistorico(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch (erro) {
      // Cota excedida ou armazenamento bloqueado: falha silenciosa, sem
      // interromper o fluxo de cadastro do usuário.
    }
  }

  function adicionarRegistro(registro) {
    var lista = lerHistorico();
    lista.unshift(registro); // mais recente primeiro
    lista = lista.slice(0, MAXIMO_REGISTROS);
    salvarHistorico(lista);
    renderizar();
  }

  function renderizar() {
    var listaEl = document.getElementById('lista-historico');
    var vazioEl = document.getElementById('historico-vazio');
    var template = document.getElementById('template-historico-item');
    if (!listaEl || !template) return; // esta view não contém o histórico

    var historico = lerHistorico();
    listaEl.innerHTML = '';

    if (historico.length === 0) {
      if (vazioEl) vazioEl.hidden = false;
      return;
    }
    if (vazioEl) vazioEl.hidden = true;

    var fragmento = document.createDocumentFragment();
    historico.forEach(function (registro) {
      var no = template.content.cloneNode(true);
      no.querySelector('.historico-item__nome').textContent = registro.nome;
      no.querySelector('.historico-item__area').textContent = registro.area;
      no.querySelector('.historico-item__data').textContent = registro.data;
      fragmento.appendChild(no);
    });
    listaEl.appendChild(fragmento);
  }

  return { renderizar: renderizar, adicionarRegistro: adicionarRegistro };
})();

window.EloHistorico = EloHistorico;

// Carregamento tradicional: restaura o histórico assim que o script executa.
EloHistorico.renderizar();