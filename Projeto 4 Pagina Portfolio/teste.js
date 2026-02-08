function desenharLinha(x1, y1, x2, y2, cor, espessura) {
    // 1. Criamos o elemento "line" dentro do espaço SVG
    // Usamos esse link estranho porque o SVG é uma linguagem "especial" para o navegador
    const linha = document.createElementNS("http://www.w3.org/2000/svg", "line");

    // 2. Definimos onde começa (x1, y1) e onde termina (x2, y2)
    linha.setAttribute("x1", x1);
    linha.setAttribute("y1", y1);
    linha.setAttribute("x2", x2);
    linha.setAttribute("y2", y2);

    // 3. Definimos a cor e a grossura
    linha.setAttribute("stroke", cor);
    linha.setAttribute("stroke-width", espessura);

    // 4. Colocamos a linha dentro do nosso container SVG na tela
    document.getElementById("meu-svg").appendChild(linha);
}

// Exemplo de uso: Desenha uma linha azul do ponto (50,50) ao (200,200)
desenharLinha(0, 200, 200, 200, "pink", "3");

desenharLinha(0, 150, 200, 150, "blue", "3");


