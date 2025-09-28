
// Variaveis Globais
let precos = [];
let totalCarrinho = 0;
let numerosDePedidos = [];  // <-- NOVO: Array para armazenar todos os números de pedidos



function salvarPedidos() { // --- Nova Função: Salva os números de pedidos no localStorage
    localStorage.setItem('numerosDePedidos', JSON.stringify(numerosDePedidos));
}


// --- Nova Função: Puxa os números de pedidos do localStorage
function carregarPedidos() {
    const pedidosSalvos = localStorage.getItem('numerosDePedidos');
    if (pedidosSalvos) {
        numerosDePedidos = JSON.parse(pedidosSalvos);
    }
}




const mostra = document.querySelector('.special3'); // Exibe o total do carrinho

// --- Nova Função: Salva os preços no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinhoPrecos', JSON.stringify(precos));
     /* usa o localStorage para guardar let precos que vai ficar em carrinhosPrecos
        usa o JSON.stringfy para converter precos de array para string para poder navegar entre paginas sem resetar let precos  */
}

// --- Nova Função: Puxa os preços do localStorage e joga no carrinho
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinhoPrecos'); // puxa o valor guaraddo em localStorage
    if (carrinhoSalvo) { // se tiver valor salvo no carrinho(ou seja se for diferente de 0) 
        precos = JSON.parse(carrinhoSalvo); // converte o valor em carrinhoSalvo de volta para array
    }
}

// --- Nova Função: Atualiza o display do total na tela
function atualizaDisplayTotal() {
    if (mostra) { // Garante que o elemento existe antes de tentar manipulá-lo
        mostra.textContent = `R$${totalCarrinho.toFixed(2).replace('.', ',')}`; // converte o valor que vai aparecer na div trocando a acentuaçao apra virgula
    }
}






// --- Nova Função: Calcula e exibe o total cada vez que dar um clique vai atualizar todas as funçoes anteriores
function exibirTotalCarrinho() {
    totalCarrinho = precos.reduce((resultado, precoAtual) => resultado + precoAtual, 0);
    salvarCarrinho(); // Ativa a função salvando os dados no localStorage após cada atualização
    atualizaDisplayTotal(); // Após salvar o preço em salvarCarrinho atualiza a div na pagina de pedidos
}

// ------------------------------------------------
// Lógica para a página de pedidos (1pedidos_principais.html)
// ------------------------------------------------

// Seleciona todas as divs de pizzas
const itensCardapio = document.querySelectorAll('.item');

// Verifica se estamos na página de pedidos e adiciona os event listeners
if (itensCardapio.length > 0) { //se tiver no itensCardapio for diferente de 0 ou seja se tiver conteudo
    itensCardapio.forEach(item => {
        item.addEventListener('click', () => { // Add evento de clique e cria as variaveis abaixo
            const precoElemento = item.querySelector('.strongRed'); // seleciona o span com preço
            const precoString = precoElemento.textContent;  // pega o texto somente que esta em precoElemento
            const precoLimpo = precoString.replace('R$', '').replace(',', '.').trim(); // converte o texto em precoString para R$ trocando virgula para ponto
            const precoNumero = parseFloat(precoLimpo); // Add decimais em precoLimpo

            precos.push(precoNumero); // Add cada valor add dentro do array
            //alert(`Preço adicionado: R$${precoNumero.toFixed(2).replace('.', ',')}`); // alert mostra o que você add e o toFixed() define quantos decimais cada numero

            exibirTotalCarrinho(); //Exibe tudo que convertemos ate agora
        });
    });
}

// ------------------------------------------------
// Lógica para a página do carrinho (2pedidos.html)
// ------------------------------------------------
function criarPedido(){
    let containerPedidos = document.querySelector('.itens-sacola'); // puxa a section itens sacola
    let novoPedido = document.createElement("div");  //cria div vazia e armazena

    const numeroUnico = gerarNumeroPedido();

    novoPedido.classList.add('item-sacola'); //cria a class dessa div nova todas as divs criadas terão essa classe
    novoPedido.innerHTML = `
        <p class="numP">Número do pedido: <span>#${numeroUnico}</span></p>
    `; // cria o conteudo da div


    

    containerPedidos.appendChild(novoPedido); //add novoPedido como filho da section


}

// cria numero do pedido

function gerarNumeroPedido() {
    let novoNumero;
    let numeroEhDuplicado = false;

    do {
        // Gera um número aleatório de 5 dígitos (entre 10000 e 99999)
        novoNumero = Math.floor(Math.random() * 90000) + 10000; 
        
        // Verifica se o número já existe no array
        // A função .includes() é ideal para essa checagem rápida.
        numeroEhDuplicado = numerosDePedidos.includes(novoNumero);
        
    } while (numeroEhDuplicado); // Repete se o número gerado já existir no array

    // Adiciona o novo número único ao array de controle
    numerosDePedidos.push(novoNumero);
    salvarPedidos(); // Salva o array atualizado no localStorage

    return novoNumero;
} // funçao que gera numero aleatorio e agora checa duplicidade




function deletarPedido() { //remove o numero do pedido do html e do localStorage
    let containerPedidos = document.querySelector('.itens-sacola'); // encontra aonde estão os pedidos
    
    // 1. Pega o último pedido na lista, se houver
    let ultimoPedido = containerPedidos.lastElementChild;

    // 2. Verifica se existe um último pedido
    if (ultimoPedido) {
        
        // 3. Extrai o número do pedido do HTML

        const numPedidoElement = ultimoPedido.querySelector('.numP span'); // localiza a tag <span> dentro do último pedido, que é onde o número único (#${numeroUnico}) está.
        if (numPedidoElement) {
            // Remove o '#' e converte para número inteiro
            const numeroParaDeletar = parseInt(numPedidoElement.textContent.replace('#', ''));
            
            // 4. Remove o número do array 'numerosDePedidos'
            const index = numerosDePedidos.indexOf(numeroParaDeletar);
            if (index > -1) {
                numerosDePedidos.splice(index, 1); // Remove 1 elemento na posição 'index' e Usa o método splice para remover o número da lista.
                salvarPedidos(); // Salva o array atualizado no localStorage
                console.log(`Número de pedido #${numeroParaDeletar} deletado e removido do localStorage.`);
            }
        }

        // 5. Remove o pedido da tela (Elemento HTML)
        containerPedidos.removeChild(ultimoPedido);
    }
}




// ------------------------------------------------
// Lógica para a página do carrinho (3carrinho.html)
// ------------------------------------------------

function mudarQuantidade(botaoClicado, mudanca) { // Aumenta/Diminui a quantidade de um item no carrinho e tem 2 parametros
    // 1. Encontra o container pai do botão clicado
    const container = botaoClicado.parentElement;
    
    // 2. Encontra o input dentro desse container
    const input = container.querySelector('.input-quantidade');
    
    // 3. valor atual obtem o valor atual do input e garante que é um número inteiro
    let valorAtual = parseInt(input.value);
    
    // 4. Calcula o novo valor que pode ser +1 ou -1 dependendo do botão clicado
    let novoValor = valorAtual + mudanca;
    
    // 5. Garante que o valor mínimo é 1 (nunca negativo ou zero, a não ser que você queira permitir a remoção)
    if (novoValor < 1) {
        novoValor = 1;
    }
    
    // 6. Atualiza o input com o novo valor
    input.value = novoValor;
    
    // NOTA: Futuramente, aqui será onde você vai chamar a função para:
    // a) Atualizar o preço total daquele item.
    // b) Recalcular o Total Geral do Carrinho.
    // c) Atualizar o localStorage para persistir a nova quantidade.
}




// A função exibirTotalCarrinho() precisa ser chamada também
// quando a página do carrinho é carregada.
    
carregarCarrinho();
carregarPedidos(); // NOVO: Carrega os números de pedidos existentes ao iniciar
exibirTotalCarrinho();









// ------------------------------------------------
// Janela Modal
// ------------------------------------------------


function abrirModal(){
            const modal = document.getElementById('janelaModal');
            
            modal.classList.add('abrir');
            
        modal.addEventListener('click', (e) => { // o E é um parametro
            if(e.target.id == 'close' || e.target.id == 'janelaModal'){ //vai procurar o id close ou janelaModal como alvo(target)
                
                // Lógica de Fechamento (Animação de Saída)
                modal.classList.remove('abrir') // Remove a classe 'abrir', o CSS fará a opacidade ir para 0 em 0.3s
                
                // Oculta completamente o elemento após a animação de 0.3s
                setTimeout(() => {
                    // Sem a classe 'abrir', o CSS fará com que a modal volte a ter:
                    // opacity: 0;
                    // visibility: hidden;
                    // display: none; // O display: none deve estar no CSS base da .janelaModal para funcionar
                }, 3000); // 300 milissegundos é o tempo da nossa transition no CSS
            }
        }, { once: true }) // Adiciona o { once: true } para que o listener só seja ativado uma vez
    }
