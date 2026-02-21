# 100 Days of Creative Code

![License](https://img.shields.io/badge/license-MIT-blue.svg)

Desafio pessoal de criar **um experimento criativo por dia** na web — animações, arte generativa, canvas, SVG, scroll e interação.

---

## Ideia do projeto

O **100 Days of Creative Code** é um desafio de prática constante: um experimento por dia, durante 100 dias. O foco é explorar _creative coding_ no browser: partículas, flow fields, SVG, GSAP, WebGL/3D, efeitos de scroll e outras técnicas visuais e interativas.

Cada dia é um pequeno projeto em HTML/CSS/JS que fica registrado na página inicial. O **Day 1** é um [Flow Field](day1/) — simulação de partículas guiadas por um campo de vetores com ruído Perlin. O **Day 2** é um [Harmonograph](day2/) — máquina de desenho pendular que traça figuras de Lissajous com amortecimento natural.

---

## Ver ao vivo

Se o projeto estiver publicado (por exemplo no Netlify), coloque aqui o link:

> **🔗 [Ver site ao vivo](https://codetddia.netlify.app/)**

_(Remova ou edite esta seção se ainda não tiver o link.)_

---

## Estrutura do repositório

```
100dayofcreativecode/
├── index.html      # Página inicial (grid de dias)
├── main.js         # Lista de dias (DAYS) e montagem dos cards
├── style.css       # Estilos da landing
├── netlify.toml    # Config de deploy (Netlify)
└── dayN/           # Cada dia em uma pasta
    ├── index.html
    ├── style.css
    └── script.js
```

A página inicial lê o array `DAYS` em `main.js` e gera os cards. Só aparecem na grid os dias que estiverem nesse array.

---

## Como rodar localmente

Não há dependências nem passo de build — só HTML, CSS e JavaScript.

**Opção 1 — Abrir direto**

- Abra o arquivo `index.html` no navegador. Em alguns casos, abrir via `file://` pode limitar recursos (por exemplo, carregar outros arquivos).

**Opção 2 — Servidor local (recomendado)**

Com Node.js:

```bash
npx serve .
# ou
npx live-server .
```

Com Python:

```bash
python3 -m http.server 8000
```

Depois acesse no navegador o endereço indicado (por exemplo `http://localhost:3000` ou `http://localhost:8000`).

---

## Como adicionar um novo dia

1. **Crie a pasta do dia**  
   Crie `dayN/` (ex.: `day2/`) com três arquivos:
   - `index.html` — estrutura da página do experimento
   - `style.css` — estilos
   - `script.js` — lógica e animação

2. **Registre o dia em `main.js`**  
   Adicione um objeto no array `DAYS` com:
   - `n` — número do dia (1–100)
   - `title` — nome curto do experimento
   - `desc` — descrição em uma linha (aparece no card)
   - `tags` — array de tags (ex.: `["canvas", "particles"]`)
   - `path` — caminho da pasta (ex.: `"./day2/"`)

Exemplo para o Day 3:

```js
{
  n:     3,
  title: "My Animation",
  desc:  "Short description of what this day explores.",
  tags:  ["svg", "gsap"],
  path:  "./day3/"
}
```

Após salvar, o novo dia aparece na grid da página inicial.

---

## Deploy

O projeto está preparado para deploy estático no **Netlify**. A configuração está em `netlify.toml` (sem comando de build; publicar a pasta raiz).

1. Envie o repositório para o GitHub (ou outro Git).
2. No [Netlify](https://app.netlify.com): **Add new site** → **Import an existing project**.
3. Conecte o repositório e faça o deploy (o Netlify usa a config do `netlify.toml`).
4. Opcional: configurar um domínio em **Site settings** → **Domain management**.

---

## Tecnologias

- **HTML5**, **CSS3**, **JavaScript** (vanilla)
- **Netlify** — hospedagem estática e headers de cache/segurança

---

## Autor e licença

**Luiz Cipriano**

- Repositório: [github.com/luizcipriano/100dayofcreativecode](https://github.com/luizcipriano/100dayofcreativecode)
- Licença: [MIT](LICENSE)
