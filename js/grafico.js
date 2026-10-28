// grafico.js — gráfico de evolução de voluntários ativos.

var EloGrafico = (function () {
  'use strict';

  var grafico;

  function iniciar() {
    var canvas = document.getElementById('grafico-voluntarios');

    if (grafico) {
      grafico.destroy();
      grafico = null;
    }

    if (!canvas) return;

    if (typeof Chart === 'undefined') {
      console.error('Não foi possível exibir o gráfico: a biblioteca Chart.js não foi carregada.');
      return;
    }

    var contexto = canvas.getContext('2d');
    if (!contexto) {
      console.error('Não foi possível exibir o gráfico: o canvas não oferece contexto 2D.');
      return;
    }

    var corPrimaria = getComputedStyle(document.documentElement)
      .getPropertyValue('--cor-primaria')
      .trim();

    grafico = new Chart(contexto, {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2024', '2025', '2026'],
        datasets: [{
          label: 'Voluntários ativos',
          data: [180, 260, 340, 410, 480],
          backgroundColor: corPrimaria || '#d96508',
          borderRadius: 6,
          maxBarThickness: 56
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        locale: 'pt-BR',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ano'
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 500,
            ticks: {
              precision: 0
            },
            title: {
              display: true,
              text: 'Voluntários ativos'
            }
          }
        }
      }
    });
  }

  return { iniciar: iniciar };
})();

window.EloGrafico = EloGrafico;

// Carregamento tradicional: inicializa quando o canvas já existe no documento.
EloGrafico.iniciar();
