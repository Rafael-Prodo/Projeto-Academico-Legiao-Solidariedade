// mascaras.js — máscaras de entrada e validações de formato reutilizáveis.
// Expõe o objeto global EloMascaras (nome usado por validacao-cadastro.js).

var EloMascaras = (function () {
  'use strict';

  function apenasDigitos(valor) {
    return (valor || '').replace(/\D/g, '');
  }

  function mascararCPF(valor) {
    var d = apenasDigitos(valor).slice(0, 11);
    d = d.replace(/(\d{3})(\d)/, '$1.$2');
    d = d.replace(/(\d{3})(\d)/, '$1.$2');
    d = d.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return d;
  }

  function mascararTelefone(valor) {
    var d = apenasDigitos(valor).slice(0, 11);
    if (d.length === 0) return '';
    var celular = d.length > 10; // 11 dígitos = celular, 10 = fixo
    d = d.replace(/(\d{2})(\d)/, '($1) $2');
    if (celular) {
      d = d.replace(/(\d{5})(\d)/, '$1-$2');
    } else {
      d = d.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return d;
  }

  function mascararCEP(valor) {
    var d = apenasDigitos(valor).slice(0, 8);
    return d.replace(/(\d{5})(\d)/, '$1-$2');
  }

  function validarCPF(valor) {
    var cpf = apenasDigitos(valor);
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    function digito(base, pesoInicial) {
      var soma = 0;
      for (var i = 0; i < base.length; i++) {
        soma += parseInt(base.charAt(i), 10) * (pesoInicial - i);
      }
      var resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    }

    if (digito(cpf.substring(0, 9), 10) !== parseInt(cpf.charAt(9), 10)) return false;
    if (digito(cpf.substring(0, 10), 11) !== parseInt(cpf.charAt(10), 10)) return false;
    return true;
  }

  function validarCEP(valor) {
    return apenasDigitos(valor).length === 8;
  }

  function validarTelefone(valor) {
    var t = apenasDigitos(valor);
    return t.length === 10 || t.length === 11;
  }

  function aplicarMascaraEmCampo(campo, funcaoMascara) {
    if (!campo) return;
    campo.addEventListener('input', function () {
      var posicao = campo.selectionStart;
      var antes = campo.value.length;
      campo.value = funcaoMascara(campo.value);
      var nova = Math.max(0, (posicao || 0) + (campo.value.length - antes));
      campo.setSelectionRange(nova, nova);
    });
  }

  return {
    apenasDigitos: apenasDigitos,
    mascararCPF: mascararCPF,
    mascararTelefone: mascararTelefone,
    mascararCEP: mascararCEP,
    validarCPF: validarCPF,
    validarCEP: validarCEP,
    validarTelefone: validarTelefone,
    aplicarMascaraEmCampo: aplicarMascaraEmCampo
  };
})();
