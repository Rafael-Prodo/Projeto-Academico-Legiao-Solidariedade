// validacao-cadastro.js — orquestra máscaras e validação do formulário de cadastro.
// Depende de mascaras.js (objeto global EloMascaras) já carregado antes deste arquivo.
//
// Exposto como window.EloCadastro.iniciar() em vez de rodar automaticamente,
// pois na SPA o formulário pode ser injetado dinamicamente no DOM bem depois
// deste script já ter sido carregado (ver js/spa.js).

var EloCadastro = (function () {
  'use strict';

  function iniciar() {
    var form = document.getElementById('formCadastro');
    if (!form) return; // a view atual não contém o formulário

    // Evita religar os mesmos listeners caso iniciar() seja chamado mais de
    // uma vez sobre a MESMA instância do formulário.
    if (form.dataset.inicializado === 'true') return;
    form.dataset.inicializado = 'true';

    var campoCPF = document.getElementById('cpf');
    var campoTelefone = document.getElementById('telefone');
    var campoCEP = document.getElementById('cep');
    var campoNascimento = document.getElementById('dataNascimento');
    var campoMensagem = document.getElementById('mensagem');
    var campoNome = document.getElementById('nomeCompleto');
    var campoArea = document.getElementById('areaInteresse');
    var contadorMensagem = document.getElementById('contador-mensagem');
    var feedback = document.getElementById('feedbackFormulario');

    var IDADE_MINIMA = 16;

    /* ---------- 1. Aplicação das máscaras de entrada ---------- */

    EloMascaras.aplicarMascaraEmCampo(campoCPF, EloMascaras.mascararCPF);
    EloMascaras.aplicarMascaraEmCampo(campoTelefone, EloMascaras.mascararTelefone);
    EloMascaras.aplicarMascaraEmCampo(campoCEP, EloMascaras.mascararCEP);

    /* ---------- 1.1 Biblioteca externa: Flatpickr no campo de nascimento ----------
       Substitui a caixa de seleção de data nativa (cuja aparência varia muito
       entre navegadores) por um calendário visual consistente, em português,
       já limitando a seleção à idade mínima exigida (IDADE_MINIMA). */

    if (window.flatpickr) {
      var limiteData = new Date();
      limiteData.setFullYear(limiteData.getFullYear() - IDADE_MINIMA);

      window.flatpickr(campoNascimento, {
        locale: 'pt',
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'd/m/Y',
        maxDate: limiteData,
        disableMobile: true // preserva o seletor nativo do sistema em telas touch
      });
    }

    /* ---------- 2. Contador de caracteres da mensagem ---------- */

    if (campoMensagem && contadorMensagem) {
      campoMensagem.addEventListener('input', function () {
        contadorMensagem.textContent = campoMensagem.value.length + ' / 500 caracteres';
      });
    }

    /* ---------- 3. Validações customizadas (além das nativas do HTML5) ---------- */

    function exibirErro(campo, mensagem) {
      var elErro = document.getElementById('erro-' + campo.id);
      campo.setCustomValidity(mensagem);
      campo.classList.remove('campo--valido');
      if (elErro) elErro.textContent = mensagem;
    }

    function limparErro(campo) {
      var elErro = document.getElementById('erro-' + campo.id);
      campo.setCustomValidity('');
      if (elErro) elErro.textContent = '';
      if (campo.value) campo.classList.add('campo--valido');
    }

    function calcularIdade(dataNascimentoISO) {
      var hoje = new Date();
      var nascimento = new Date(dataNascimentoISO + 'T00:00:00');
      var idade = hoje.getFullYear() - nascimento.getFullYear();
      var aindaNaoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
      if (aindaNaoFezAniversario) idade--;
      return idade;
    }

    function validarCampoCPF() {
      if (campoCPF.value === '') {
        exibirErro(campoCPF, 'O CPF é obrigatório.');
      } else if (!EloMascaras.validarCPF(campoCPF.value)) {
        exibirErro(campoCPF, 'CPF inválido. Verifique os números digitados.');
      } else {
        limparErro(campoCPF);
      }
    }

    function validarCampoTelefone() {
      if (campoTelefone.value === '') {
        exibirErro(campoTelefone, 'O telefone é obrigatório.');
      } else if (!EloMascaras.validarTelefone(campoTelefone.value)) {
        exibirErro(campoTelefone, 'Informe um telefone válido com DDD.');
      } else {
        limparErro(campoTelefone);
      }
    }

    function validarCampoCEP() {
      if (campoCEP.value === '') {
        exibirErro(campoCEP, 'O CEP é obrigatório.');
      } else if (!EloMascaras.validarCEP(campoCEP.value)) {
        exibirErro(campoCEP, 'CEP inválido. Use o formato 00000-000.');
      } else {
        limparErro(campoCEP);
      }
    }

    function validarCampoNascimento() {
      if (!campoNascimento.value) {
        exibirErro(campoNascimento, 'Informe sua data de nascimento.');
        return;
      }
      var idade = calcularIdade(campoNascimento.value);
      if (idade < IDADE_MINIMA) {
        exibirErro(campoNascimento, 'É necessário ter ao menos ' + IDADE_MINIMA + ' anos para se voluntariar.');
      } else if (idade > 110) {
        exibirErro(campoNascimento, 'Verifique a data informada.');
      } else {
        limparErro(campoNascimento);
      }
    }

    campoCPF.addEventListener('blur', validarCampoCPF);
    campoCPF.addEventListener('input', function () {
      if (campoCPF.value.length === 14) validarCampoCPF();
      else { campoCPF.setCustomValidity(''); campoCPF.classList.remove('campo--valido'); }
    });

    campoTelefone.addEventListener('blur', validarCampoTelefone);
    campoTelefone.addEventListener('input', function () {
      campoTelefone.setCustomValidity('');
      campoTelefone.classList.remove('campo--valido');
    });

    campoCEP.addEventListener('blur', validarCampoCEP);
    campoCEP.addEventListener('input', function () {
      campoCEP.setCustomValidity('');
      campoCEP.classList.remove('campo--valido');
    });

    campoNascimento.addEventListener('change', validarCampoNascimento);

    // Validação genérica de campos nativos (required, pattern, minlength, e-mail etc.)
    form.querySelectorAll('input, select, textarea').forEach(function (campo) {
      campo.addEventListener('invalid', function () {
        var elErro = document.getElementById('erro-' + campo.id);
        if (!elErro) return;
        if (campo.validity.valueMissing) {
          elErro.textContent = 'Este campo é obrigatório.';
        } else if (campo.validity.patternMismatch || campo.validity.typeMismatch) {
          elErro.textContent = campo.title || 'Formato inválido.';
        } else if (campo.validity.tooShort) {
          elErro.textContent = 'Digite pelo menos ' + campo.minLength + ' caracteres.';
        } else if (!campo.validity.customError) {
          elErro.textContent = 'Verifique o valor informado.';
        }
      });

      campo.addEventListener('input', function () {
        if (campo.checkValidity() && campo.value) {
          var elErro = document.getElementById('erro-' + campo.id);
          if (elErro && campo.type !== 'checkbox') elErro.textContent = '';
        }
      });
    });

    /* ---------- 4. Envio do formulário ---------- */

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();

      validarCampoCPF();
      validarCampoTelefone();
      validarCampoCEP();
      validarCampoNascimento();

      if (!form.checkValidity()) {
        form.reportValidity();
        mostrarFeedback('Há campos com erro. Revise as informações destacadas.', 'erro');
        return;
      }

      // Neste projeto acadêmico não há back-end: apenas simulamos o envio.
      mostrarFeedback(
        'Cadastro enviado com sucesso! Em breve nossa equipe entrará em contato por e-mail.',
        'sucesso'
      );

      if (window.EloHistorico) {
        window.EloHistorico.adicionarRegistro({
          nome: campoNome.value.trim(),
          area: campoArea.options[campoArea.selectedIndex].text,
          data: new Date().toLocaleDateString('pt-BR')
        });
      }

      form.reset();
      if (campoNascimento._flatpickr) {
        campoNascimento._flatpickr.clear(); // form.reset() não sincroniza o altInput do Flatpickr
      }
      form.querySelectorAll('.campo--valido').forEach(function (c) {
        c.classList.remove('campo--valido');
      });
      if (contadorMensagem) contadorMensagem.textContent = '0 / 500 caracteres';
    });

    function mostrarFeedback(mensagem, tipo) {
      feedback.hidden = false;
      feedback.textContent = mensagem;
      feedback.className = 'formulario__feedback formulario__feedback--' + tipo;
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return { iniciar: iniciar };
})();

window.EloCadastro = EloCadastro;