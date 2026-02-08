document.addEventListener('DOMContentLoaded', () => { // Espera a pagina carregar
    const container = document.getElementById('f2'); // Espaço do desenho SVG
    const svg = document.getElementById('svg-conexoes'); // Elemento SVG onde as linhas serão desenhadas
    const pontoOrigem = document.querySelector('.feito-com'); // Ponto de inicio das linhas
    const icones = document.querySelectorAll('.icon'); // AS bolinhas onde as linhas vão chegar

    // Função para desenhar as linhas tecnológicas

    function desenharLinhasTecnologicas() {
        svg.innerHTML = ''; // Limpa o desenho antigo para começar um novo
        
        const rectC = container.getBoundingClientRect(); // Mede o container para as linhas nao voarem para fora da tela
        const rectO = pontoOrigem.getBoundingClientRect(); // Mede o ponto de origem para calcular o centro

        // Função auxiliar para pegar o centro de um elemento
        const getCentro = (el) => { //Descobre o meio de cada icone para que a linha começe no meio e nao na ponta
            const r = el.getBoundingClientRect();
            return {
                x: r.left + r.width / 2 - rectC.left,
                y: r.top + r.height / 2 - rectC.top
            };
        };

        const centroTexto = getCentro(pontoOrigem);
        const pts = Array.from(icones).map(icon => getCentro(icon)); // Pega o centro de cada ícone e guarda em um array



        // --- LINHA 1 (VERMELHA / CONEXÃO 1 E 2) ---
        // Conecta o ícone 1 ao 2 (índices 0 e 1)
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d1 = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
        configurarLinha(path1, d1, "#ff4d4d"); // M

        // --- LINHA 2 (LARANJA / CONEXÃO 3, 4 E 5) ---
        // Conecta 3 -> 4 -> 5 (índices 2, 3 e 4)
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // Faz uma quebra tecnológica entre o 4 e o 5 para não ser apenas uma diagonal
        const d2 = `M ${pts[2].x} ${pts[2].y} 
                    L ${pts[3].x} ${pts[3].y} 
                    L ${pts[3].x} ${pts[4].y} 
                    L ${pts[4].x} ${pts[4].y}`;
        configurarLinha(path2, d2, "#ffa500"); // Laranja

        // --- LINHA 3 (AZUL / TEXTO PARA O GRUPO) ---
        // Conecta o texto central ao primeiro ícone
        const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d3 = `M ${centroTexto.x} ${centroTexto.y} 
                    L ${pts[0].x} ${centroTexto.y} 
                    L ${pts[0].x} ${pts[0].y}`;
        configurarLinha(path3, d3, "#00ffff"); // Azul/Cyan original

        // Adiciona todas ao SVG
        svg.appendChild(path1);
        svg.appendChild(path2);
        svg.appendChild(path3);
    }

    // Função para aplicar os estilos padrão das linhas
    function configurarLinha(path, d, cor) {
        path.setAttribute("d", d);
        path.setAttribute("stroke", cor);
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("fill", "none");
        path.style.filter = `drop-shadow(0 0 3px ${cor})`;
        path.style.opacity = "0.8";
    }

    // Inicializa e trata o redimensionamento da tela
    desenharLinhasTecnologicas();
    window.addEventListener('resize', desenharLinhasTecnologicas);
});