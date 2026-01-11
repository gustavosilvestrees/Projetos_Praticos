// Seleção de elementos do DOM
const displayRelogioTopo = document.getElementById('current-time');
const displayCronometro = document.getElementById('display-timer');
const btnAction = document.getElementById('btn-action');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');


// Variáveis de controle do cronômetro
let horaInicio = "";
let segundos = 0;
let intervaloCronometro = null;
let estaRodando = false;

/* ================================= 1. LÓGICA DO RELÓGIO (HORA ATUAL) ================================= */



function atualizarRelogio() {
    const agora = new Date(); // Recebe data atual do computador
    const horas = String(agora.getHours()).padStart(2, '0'); //Pega as horas, garante que essas horas tenham 2 digitos com o padStart
    const minutos = String(agora.getMinutes()).padStart(2, '0'); // Faz a mesma coisa que let horas mas com minutos
    const segundosRelogio = String(agora.getSeconds()).padStart(2, '0'); // Mesma coisa só que com segs

    displayRelogioTopo.textContent = `${horas}:${minutos}:${segundosRelogio}`; //Mostra no display o relogio atualizado
}



setInterval(atualizarRelogio, 1000); // Inicia o relógio e atualiza a cada 1 segundo para que o tempo nao congele
atualizarRelogio(); // Chamada inicial para não esperar 1 segundo







/* ================================= 2. LÓGICA DO CRONÔMETRO DE ESTUDO ================================= */


function formatarTempo(totalSegundos) { //OBS: o Math.floor arredonda para baixo tirando decimais
    const h = Math.floor(totalSegundos / 3600); //1h tem 3600 segundos dividindo o total de segundos por 3600 assim ele pega quantas horas tem
    const m = Math.floor((totalSegundos % 3600) / 60); //Pega o resto do totalSegundos e divide por 60 para pegar os minutos
    const s = totalSegundos % 60; //Pega o que sobrou da conta anterior e divide por 60 para pegar os segundos restantes

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; //Retorna o formato HH:MM:SS garantindo que cada parte tenha 2 digitos
}


const inputArea = document.getElementById('input-area');
const notasEstudo = document.getElementById('study-notes');

function gerenciarBotao() {
    estaRodando = !estaRodando; //Inverte o valor da variavel se for TRUE vira FALSE e vice versa

    if (estaRodando) {
        horaInicio = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

        // Mudar para estado "Estudando"
        btnAction.textContent = "Finalizar Estudo"; //Altera o texto do botao
        btnAction.classList.remove('btn-start'); //Remove o btn-start
        btnAction.classList.add('btn-stop'); //Add no lugar o btn-stop


        statusDot.style.backgroundColor = "var(--mango-sunset)"; //Muda a cor do botao stop
        statusText.textContent = "Estudando..."; //Muda o texto do status de disponivel para estudando


        // Começa a contagem
        intervaloCronometro = setInterval(() => { //A cada 1000 milisegundos ele executa a funcao e atualiza o tempo que esta na tela
            segundos++;  //Adiciona 1 segundo a variavel segundos
            displayCronometro.textContent = formatarTempo(segundos); //Usa o formatar tempo para atualizar o tempo na tela
        }, 1000);

        inputArea.classList.remove('show-area'); //Remove a classe show-area escondendo a area de notas
        inputArea.classList.add('hidden'); //Adiciona a classe hidden para esconder o text area
        notasEstudo.value = ""; // Limpa as notas anteriores

    } else {

        // Parar contagem
        clearInterval(intervaloCronometro); //Caso seja false ele para a contagem no navegador parando o cronometro

        // Voltar ao estado inicial (ou preparar para salvar)
        btnAction.textContent = "Iniciar Estudo"; // O botão volta ao estado original
        btnAction.classList.remove('btn-stop'); //Remove o btn-stop
        btnAction.classList.add('btn-start'); //Add no lugar o btn-start

        statusDot.style.backgroundColor = "var(--teal-pool)"; //Muda a cor do botao start para a cor do inicio
        statusText.textContent = "Disponível"; //Volta o texto do status para disponivel

        // MOSTRAR A ÁREA DE NOTAS
        inputArea.classList.remove('hidden'); //Remove a classe hidden deixando a area visivel
        inputArea.classList.add('show-area'); //Adiciona a classe show-area para mostrar o text area

        // Colocar o foco automático no texto para você já começar a digitar
        notasEstudo.focus();

        // Aqui futuramente chamaremos a função de salvar no LocalStorage


        // Resetar (opcional, dependendo se você quer que o tempo fique na tela até salvar)
        // segundos = 0;
        // displayCronometro.textContent = "00:00:00";
    }
}



// Event Listeners
btnAction.addEventListener('click', gerenciarBotao);




/* ================================= 3. LÓGICA DE SALVAR REGISTRO DE ESTUDO ================================= */

const btnSave = document.getElementById('btn-save'); // Botão de salvar registro
const historyList = document.getElementById('history-list'); //Recebe a tabela de historico




// Função para salvar no LocalStorage
function salvarRegistro() {
    const resumo = notasEstudo.value;

    if (resumo.trim() === "") { // Verifica se o campo de resumo está vazio
        alert("Por favor, descreva brevemente o que estudou.");
        return;
    }


    // Criamos o objeto com os dados da sessão atual
    const novoPonto = { // aqui criamos um objeto molde para salvar os dados
        data: new Date().toLocaleDateString('pt-BR'),
        inicio: "Pegar do sistema", // Vamos ajustar isso abaixo
        fim: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        total: formatarTempo(segundos),
        conteudo: resumo
    };

    // 1. Pegar o que já existe no LocalStorage ou criar lista vazia
    let registros = JSON.parse(localStorage.getItem('pontos_estudo')) || []; //usa o JSON.parse para converter o texto salvo em objeto JS

    // 2. Adicionar o novo ponto na lista
    registros.push(novoPonto); // Adiciona o novo ponto ao array de registros

    // 3. Salvar de volta no LocalStorage (convertendo para texto)
    localStorage.setItem('pontos_estudo', JSON.stringify(registros)); // Usa o JSON.stringify para converter o objeto JS em texto para salvar no LocalStorage

    // Limpar e esconder campo
    inputArea.classList.add('hidden');
    segundos = 0; // Reseta o cronômetro para o próximo estudo
    displayCronometro.textContent = "00:00:00";

    alert("Estudo registrado com sucesso!");
    carregarHistorico(); // Atualiza a tabela na tela

    /*
    Conceitos dessa funçao:
    Aqui estão os novos conceitos que você precisa dominar:

    localStorage.getItem('nome'): Vai até a gaveta do navegador e tenta buscar algo guardado com aquele nome.

    JSON.stringify(objeto): O LocalStorage só entende texto (strings). Essa função transforma sua lista de objetos em um texto gigante para o navegador conseguir guardar.

    JSON.parse(texto): Faz o contrário: pega o texto guardado e transforma de volta em uma lista de JavaScript que podemos manipular.

    .trim() === "": Verifica se você não deixou o campo de texto apenas com espaços em branco.
    */
}

btnSave.addEventListener('click', salvarRegistro);



function carregarHistorico() {
    // 1. Pega os dados (em texto) e transforma de volta em Lista (Array)
    const registros = JSON.parse(localStorage.getItem('pontos_estudo')) || []; /* caso não tenha nada salvo, cria um array vazio [] para evitar erros */
    
    // 2. Seleciona o corpo da tabela onde as linhas vão entrar
    const tabelaCorpo = document.getElementById('history-list');
    
    // 3. Limpa a tabela para não duplicar os dados ao recarregar
    tabelaCorpo.innerHTML = "";

    // 4. Cria uma linha para cada registro guardado
    registros.forEach((ponto) => { // o forEach diz para cada item da lista roda o script uma vez
        const linha = document.createElement('tr'); // Vai criar uma linha nova na tabela


        // LÓGICA DE TRUNCAMENTO DE STRING
        // Se o texto for maior que 55, ele corta e add "...", se não, mostra normal.
        const resumoExibicao = ponto.conteudo.length > 55 
            ? ponto.conteudo.substring(0, 55) + "..." 
            : ponto.conteudo;


        

        // Preenche a linha com os dados do ponto de estudo

        linha.innerHTML = `
            <td>${ponto.data}</td>
            <td>${ponto.inicio}</td>
            <td>${ponto.fim}</td>
            <td>${ponto.total}</td>
            <td title="${ponto.conteudo}">${resumoExibicao}</td>
            <td>
                <button class="btn-delete-row" onclick="apagarLinha(${index})">
                    🗑️
                </button>
            </td>
        `; // Cada <td> e um dado da tabela

        // Adiciona a linha na tabela
        tabelaCorpo.appendChild(linha); // Com a tabela criada add a linha com os dados
    });
}

// Chamar ao carregar a página para os dados antigos aparecerem logo
carregarHistorico();





/* ================================= EXPORTAÇÃO PARA PDF ================================= */

function exportarParaPDF() {
    const { jsPDF } = window.jspdf; // Acessa a biblioteca jsPDF
    const doc = new jsPDF(); // Cria um novo documento PDF
    

    // Título do documento
    doc.setFontSize(18); // Tamanho da fonte do titulo
    doc.text("Relatório de Estudos - StudyFlow", 20, 20); // Adiciona o texto do titulo na posiçao x=20, y=20 Desenha o texto na folha.
    

    // Pegamos os registros do localStorage
    const registros = JSON.parse(localStorage.getItem('pontos_estudo')) || []; //Usa o JSON.parse para converter o texto salvo em objeto JS 
    
    if (registros.length === 0) { // Verifica se há registros para exportar caso não tenha
        alert("Não há registros para exportar!");
        return;
    }

    doc.setFontSize(12); // Tamanho da fonte do conteudo
    let linhaPosicao = 40; // Posição inicial da linha no PDF
    const larguraMaxima = 170; // Largura útil da folha A4 (210mm - margens)



  registros.forEach((item, index) => {
        // 1. Quebra o texto automaticamente para caber na largura
        const textoQuebrado = doc.splitTextToSize(`Resumo: ${item.conteudo}`, larguraMaxima); // Quebra o texto em linhas que cabem na larguraMaxima
        /* no split to size você passa o texto e a largura (170mm), e ele te devolve uma lista de linhas já cortadas perfeitamente. */
        
        // 2. Limita a 20 linhas (caso o usuário escreva demais)
        const textoLimitado = textoQuebrado.slice(0, 20); // Esse comando de JavaScript diz: "Pegue da linha 0 até a linha 20 e descarte o resto". Isso garante que ninguém escreva um livro em um único registro.

        // Verifica se precisa de nova página antes de imprimir o bloco
        const espacoNecessario = (textoLimitado.length * 7) + 20; // Agora o pulo de linha não é fixo em 20mm. Ele calcula: "Se o texto tem 10 linhas, eu preciso de 70mm de espaço". Isso evita que um registro atropele o outro.
        if (linhaPosicao + espacoNecessario > 280) {
            doc.addPage();
            linhaPosicao = 20;
        }

        // Imprime cabeçalho do registro
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. Data: ${item.data} | Duração: ${item.total}`, 20, linhaPosicao);
        
        // Imprime o texto quebrado/limitado
        doc.setFont("helvetica", "normal");
        doc.text(textoLimitado, 20, linhaPosicao + 7);
        
        // Calcula a próxima posição baseada na quantidade de linhas que o texto ocupou
        linhaPosicao += espacoNecessario;
    });

    doc.save("meu-historico-estudos.pdf");
}

// Ligar a função ao botão do HTML
document.getElementById('btn-export').addEventListener('click', exportarParaPDF);





/* ================================= LIMPEZA DE HISTORICO ================================= */


const btnClear = document.getElementById('btn-clear');

function limparHistorico() {
    // 1. Pedir confirmação (para não apagar por acidente!)
    const confirmacao = confirm("Tem certeza que deseja apagar todos os seus registros de estudo? Esta ação não pode ser desfeita.");

    if (confirmacao) {
        // 2. Remove apenas a nossa chave do LocalStorage
        localStorage.removeItem('pontos_estudo');

        // 3. Atualiza a tabela na tela (que agora ficará vazia)
        carregarHistorico();

        alert("Histórico apagado com sucesso!");
    }
}

btnClear.addEventListener('click', limparHistorico);




