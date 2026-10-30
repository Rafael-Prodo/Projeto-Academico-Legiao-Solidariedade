<div align="center">

# 🤝 Legião da Solidariedade

**Site institucional de uma ONG fictícia, construído com HTML, CSS e JavaScript puros: semântica, acessibilidade, design system próprio e navegação estilo SPA, sem frameworks.**

![HTML5](https://img.shields.io/badge/HTML5-semântico-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Grid%20%26%20Flexbox-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES5%20modular-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![Acessibilidade](https://img.shields.io/badge/a11y-WCAG%202.1-009f9a?style=flat-square)

[**🔗 Ver o projeto no ar**](https://rafael-prodo.github.io/Projeto-Academico-Legiao-Solidariedade/)

</div>

<!-- Dica: adicione aqui um print ou GIF do site (ex.: docs/preview.png) para aumentar muito o impacto do README.
     Exemplo: ![Prévia do projeto](docs/preview.png) -->

---

## 📌 Sobre o projeto

A **Legião da Solidariedade** é um estudo de caso aplicado ao terceiro setor: um site para uma ONG que conecta voluntários, doadores e comunidades. O objetivo foi ir além de "fazer um site bonito" e tomar **decisões de engenharia justificadas** em cada camada: estrutura, estilo, comportamento e acessibilidade.

O projeto começou como três páginas estáticas e evoluiu, de forma incremental e sem reescrever o que já estava validado, para uma aplicação com **roteamento client-side**, **componentes renderizados dinamicamente**, **validação em camadas** e **persistência local**.

> Projeto acadêmico de desenvolvimento front-end.

---

## ✨ Destaques técnicos

| Área | O que foi feito |
|---|---|
| **Arquitetura** | Navegação estilo SPA com **PJAX** (`fetch` + `history.pushState` + `popstate`), reaproveitando as três páginas HTML como fonte de verdade de cada rota |
| **Componentização** | Cards gerados com `<template>` + `cloneNode(true)` + `DocumentFragment`, preenchidos via `textContent` (sem `innerHTML` com dados, o que evita injeção de HTML) |
| **Formulário** | Validação em **duas camadas**: atributos nativos do HTML5 (`required`, `pattern`, `minlength`...) + regras de negócio com a Constraint Validation API (`setCustomValidity`) |
| **Regras de negócio** | Validação de **CPF** pelo algoritmo oficial de dígitos verificadores, telefone (10/11 dígitos), CEP (8 dígitos) e idade (16 a 110 anos) |
| **Máscaras** | Máscaras de CPF, telefone e CEP em tempo real, preservando a posição do cursor |
| **Persistência** | Histórico dos últimos 5 cadastros no `localStorage`, **sem dados sensíveis** (apenas nome, área e data) |
| **Visualização de dados** | Gráfico de barras responsivo com **Chart.js** e alternativa em tabela para leitores de tela |
| **Design System** | Tokens CSS de cor (primária, neutra e semântica), tipografia (escala modular 1.25) e espaçamento (base 8px) |
| **Layout** | **CSS Grid** para estrutura bidimensional e **Flexbox** para arranjos internos, com 5 breakpoints (`1280`, `1024`, `860`, `720` e `480px`) em abordagem desktop-first |
| **Acessibilidade** | HTML semântico, `aria-labelledby`, `aria-describedby`, `aria-live`, link "pular para o conteúdo", foco gerenciado e anúncio de rota na SPA, estados de foco visíveis |
| **Biblioteca externa** | **Flatpickr** (calendário localizado em pt-BR) com sincronização do `reset()` do formulário |

---

## 🧱 Funcionalidades

- **Página inicial** com apresentação institucional, indicadores de impacto, gráfico de evolução de voluntários (2022–2026), missão, visão e valores.
- **Iniciativas** com 6 projetos em cards (categoria, descrição, frequência e número de voluntários).
- **Cadastro de voluntário** com formulário acessível dividido em 4 grupos (`fieldset` + `legend`): dados pessoais, contato, endereço e engajamento.
- **Feedback de validação redundante**: cor da borda, sombra em anel, mensagem textual e região `aria-live`, sem depender só da cor.
- **Menu responsivo** com botão hambúrguer sincronizado com `aria-expanded`.
- **Navegação sem recarregar a página**, com botão voltar/avançar do navegador funcionando.

---

## 🗂️ Estrutura do projeto

```
experiencia-pratica-1/
├── index.html              # Página inicial
├── projetos.html           # Iniciativas
├── cadastro.html           # Cadastro de voluntário
├── css/
│   └── style.css           # Design tokens, componentes, grids e breakpoints
├── js/
│   ├── script.js           # Menu mobile e ano do rodapé
│   ├── spa.js              # Roteador PJAX (orquestra a inicialização de cada view)
│   ├── templates.js        # Componentes via <template> e dados dos cards
│   ├── grafico.js          # Gráfico de voluntários (Chart.js)
│   ├── historico.js        # Histórico de cadastros no localStorage
│   ├── mascaras.js         # Máscaras e validações de CPF, telefone e CEP
│   └── validacao-cadastro.js # Liga máscaras, validações e Flatpickr ao formulário
└── assets/
    └── logo.png
```

---

## 🧠 Decisões de projeto

**Por que PJAX em vez de reescrever como SPA?**
Para reaproveitar as três páginas já validadas semanticamente e manter a estrutura acessível e indexável, eliminando o recarregamento completo a cada navegação. A solução foi escolhida por ser proporcional ao problema, não por ser a mais sofisticada.

**Por que `<template>` em vez de template literals com `innerHTML`?**
O conteúdo do `<template>` é inerte, a clonagem devolve nós reais do DOM e o preenchimento com `textContent` elimina o vetor de injeção caso os dados passem a vir de uma API.

**Por que módulos com IIFE?**
Cada arquivo tem uma única responsabilidade e expõe apenas um objeto global (`EloMascaras`, `EloTemplates`, `EloHistorico`, `EloCadastro`, `EloGrafico`). Os módulos verificam se os elementos existem na view atual e se os outros módulos estão disponíveis, então qualquer um pode estar ausente sem quebrar os demais.

**Por que não guardar CPF e telefone no `localStorage`?**
Ele não é criptografado e fica acessível a qualquer script do mesmo domínio. Por isso o histórico guarda apenas dados não sensíveis, o que foi uma decisão de segurança deliberada.

**Acessibilidade na SPA.**
Como a troca de conteúdo não gera o "salto de contexto" de um carregamento tradicional, o foco é movido para o novo `<main>` e uma região `aria-live` anuncia o título da página carregada.

---

## 🐛 Desafios técnicos resolvidos

- **Conflito entre dois roteadores:** existiam duas implementações de navegação interceptando o mesmo clique, causando cards e gráfico que só apareciam após atualizar a página. Foi mantida uma única camada de roteamento, com cada módulo reinicializado de forma idempotente.
- **Sensibilidade a maiúsculas/minúsculas no GitHub Pages:** arquivos com nomes diferentes dos referenciados no HTML funcionavam localmente, mas retornavam 404 em produção, interrompendo a fila de scripts. Hoje os nomes são padronizados em minúsculas.
- **Flatpickr × `form.reset()`:** o reset nativo não sincroniza o campo alternativo da biblioteca; o ciclo de vida foi tratado manualmente.
- **Gráfico duplicado na troca de rota:** a inicialização passou a reaproveitar o gráfico quando o canvas é o mesmo e a destruí-lo quando a view muda.
- **Clique em link da própria página:** disparava recarregamento desnecessário; passou a ser ignorado.

---

## 🚀 Como executar localmente

Não há dependências nem etapa de build.

```bash
# 1. Clone o repositório
git clone https://rafael-prodo.github.io/Projeto-Academico-Legiao-Solidariedade/

# 2. Sirva a pasta com qualquer servidor estático
npx serve .
# ou use a extensão Live Server do VS Code
```

Abra o endereço indicado no terminal (por exemplo, `http://localhost:3000`).

> ⚠️ Abrir os arquivos direto pelo navegador (`file://`) funciona, mas a navegação SPA cai automaticamente para o carregamento tradicional, pois `fetch` não é suportado nesse protocolo.

---

## 🔭 Próximos passos

- [ ] Automatizar testes de acessibilidade (axe, Lighthouse CI) e validação de marcação.
- [ ] Adotar **Vite** (build multipágina, minificação e hashing de assets), migrando os scripts para módulos ES e instalando o Flatpickr via npm.
- [ ] Implementar **modo escuro e alto contraste** reaproveitando os tokens CSS (`prefers-color-scheme`, `prefers-contrast`, `forced-colors`) e alternância manual persistida.
- [ ] Mover os dados dos cards para uma fonte externa (JSON/API).
- [ ] Adicionar via de contribuição financeira, além do voluntariado.
- [ ] Adotar fluxo de branches **GitFlow** (`main`, `develop`, `feature/*`, `release/*`, `hotfix/*`).
- [ ] Carregar o Flatpickr apenas na página de cadastro.

---

## 🛠️ Stack

`HTML5` · `CSS3 (Grid, Flexbox, Custom Properties)` · `JavaScript (ES5, padrão module)` · `Chart.js` · `Flatpickr` · `GitHub Pages`

---

## 👤 Autor

**Rafael** · [GitHub](https://github.com/rafael-prodo) · [LinkedIn](https://www.linkedin.com/in/rafael-prosdoskimis) 

<sub>Projeto acadêmico de desenvolvimento front-end. Os dados institucionais (ONG, números e contatos) são fictícios.</sub>
