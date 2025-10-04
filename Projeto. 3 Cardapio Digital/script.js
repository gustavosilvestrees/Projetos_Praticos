
// Variaveis Globais
// let precos = [];
let totalCarrinho = 0;
let numerosDePedidos = [];  // <-- NOVO: Array para armazenar todos os números de pedidos
let carrinhoItens = []; // NOVO: Armazenará os objetos do carrinho (ID, QTD, Preço Total)


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
function salvarItensCarrinho() {
    localStorage.setItem('carrinhoItens', JSON.stringify(carrinhoItens));
}

// --- Nova Função: Puxa os preços do localStorage e joga no carrinho
function carregarItensCarrinho() {
    const itensSalvos = localStorage.getItem('carrinhoItens');
    if (itensSalvos) {
        carrinhoItens = JSON.parse(itensSalvos);
    }
}

function exibirItensCarrinho() {
    const container = document.querySelector('.itens-sacola');
    
    // Verifica se o container existe (para evitar erros em outras páginas)
    if (!container) return; 

    // Limpa o conteúdo (importante para recarregar após um clique de +/- ou exclusão)
    container.innerHTML = ''; 

    // Se o carrinho estiver vazio, exibe a mensagem de carrinho vazio (opcional)
    if (carrinhoItens.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio">
                <p>Sua sacola está vazia. Adicione algumas pizzas deliciosas!</p>
                <a href="1pedidos_principais.html">
                    <button class="btn-voltar-cardapio">Voltar ao Cardápio</button>
                </a>
            </div>
        `;
        return;
    }


    carrinhoItens.forEach(item => {
        // Usa o ID para buscar os detalhes fixos (nome, foto) no CATALOGO_PIZZAS
        const pizzaInfo = CATALOGO_PIZZAS[item.id]; 

        // Se por algum motivo o ID não existir mais no catálogo (pizzas.js), ignora o item
        if (!pizzaInfo) return; 

        // Formata o preço total do item para exibição (R$ X,XX)
        const precoFormatado = item.precoTotal.toFixed(2).replace('.', ',');

        const novoItemHTML = `
            <div class="item-sacola" data-id-pizza="${item.id}">
                <div class="item-sacola-img">
                    <img src="${pizzaInfo.foto}" alt="${pizzaInfo.nome}">
                </div>
                <div class="item-info">
                    <div class="nome-e-preco">
                        <p class="item-nome">${pizzaInfo.nome}</p>
                        <p class="item-preco">R$ ${precoFormatado}</p>
                    </div>
                    
                    <div class="quantidade-container">
                        <button class="btn-quantidade btn-menos" onclick="mudarQuantidade(${item.id}, -1)">-</button>
                        <input type="number" class="input-quantidade" value="${item.quantidade}" min="1" readonly>
                        <button class="btn-quantidade btn-mais" onclick="mudarQuantidade(${item.id}, 1)">+</button>
                    </div>
                    
                    <div class="btn-excluir" onclick="removerItem(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += novoItemHTML;
    });
}




// --- Nova Função: Atualiza o display do total na tela
function atualizaDisplayTotal() {
    if (mostra) { // Garante que o elemento existe antes de tentar manipulá-lo
        mostra.textContent = `R$${totalCarrinho.toFixed(2).replace('.', ',')}`; // converte o valor que vai aparecer na div trocando a acentuaçao apra virgula
    }
}






// --- Nova Função: Calcula e exibe o total cada vez que dar um clique vai atualizar todas as funçoes anteriores
function exibirTotalCarrinho() {
    //  vamos calcular na hora
    let subtotal = 0; 
    
    // Soma os precoTotal de todos os itens no novo array
    carrinhoItens.forEach(item => {
        subtotal += item.precoTotal;
    });

    const taxaEntrega = 10.00; // Valor fixo da taxa de entrega
    const totalGeral = subtotal + taxaEntrega;
    
    // Atualiza os displays
    const subtotalDisplay = document.querySelector('.resumo-subtotal span');
    const totalGeralDisplay = document.querySelector('.resumo-total .special3');
    
    if (subtotalDisplay) {
        subtotalDisplay.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
    
    if (totalGeralDisplay) {
        totalGeralDisplay.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }
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

function mudarQuantidade(pizzaId, mudanca) {
    // 1. Encontra o objeto do item no array
    const item = carrinhoItens.find(i => i.id === pizzaId);
    
    if (!item) return;

    // 2. Aplica a Regra de Negócio (mínimo de 1)
    let novoValor = item.quantidade + mudanca;
    if (novoValor < 1) {
        novoValor = 1;
    }
    
    // Se a quantidade não mudou (clicou '-' quando já era 1), apenas retorna
    if (novoValor === item.quantidade) return; 

    // 3. Atualiza a quantidade e recalcula o preço total do item
    item.quantidade = novoValor;
    item.precoTotal = item.precoUnitario * novoValor;

    // 4. Salva o array modificado no localStorage
    salvarItensCarrinho();
    
    // 5. ATUALIZA A TELA (Recarrega o HTML e o Total)
    exibirItensCarrinho(); 
    exibirTotalCarrinho();
}



function adicionarAoCarrinho(pizzaId) {
    const itemExistente = carrinhoItens.find(item => item.id === pizzaId); // find procura o primeiro item que satisfaça a condiçao e retorna true ou false

    const pizza = CATALOGO_PIZZAS[pizzaId];

    if (!pizza) {
        console.error(`Pizza com ID ${pizzaId} não encontrada no catálogo.`);
        return;
    }

    if (itemExistente) {
        // Se já existe, apenas aumenta a quantidade e recalcula o preço total
        itemExistente.quantidade++;
        itemExistente.precoTotal = pizza.preco * itemExistente.quantidade;
    } else {
        // Se é novo, adiciona o objeto completo ao carrinho
        carrinhoItens.push({
            id: pizza.id,
            nome: pizza.nome,
            precoUnitario: pizza.preco,
            quantidade: 1,
            precoTotal: pizza.preco // Inicia com o preço unitário
        });
    }

    salvarItensCarrinho(); // Salva a nova estrutura de itens
    // Não precisa atualizar a tela de pedidos, apenas o carrinho precisa ser atualizado na sua página
    alert(`${pizza.nome} adicionada(o) ao carrinho!`);
}


// script.js (Adicionar em qualquer lugar antes das chamadas de inicialização)


// --- NOVA Função: Adiciona um item ao carrinho ou aumenta a quantidade
function adicionarAoCarrinho(pizzaId) {
    // 1. Converte o ID, se necessário (o catálogo usa números como chaves, mas o HTML passa string)
    const idNumerico = Number(pizzaId);

    // 2. Encontra o objeto da pizza no catálogo (do pizzas.js)
    const pizza = CATALOGO_PIZZAS[idNumerico];

    if (!pizza) {
        console.error('Pizza com ID ' + idNumerico + ' não encontrada no catálogo.');
        return;
    }

    // 3. Procura se o item já existe no carrinhoItens
    const itemExistente = carrinhoItens.find(item => item.id === idNumerico);

    if (itemExistente) {
        // Se existir, apenas aumenta a quantidade e recalcula o preço total
        itemExistente.quantidade++;
        itemExistente.precoTotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
        // Se não existir, adiciona o novo item ao array
        carrinhoItens.push({
            id: pizza.id,
            quantidade: 1,
            precoUnitario: pizza.preco, // Preço unitário (importante para o cálculo)
            precoTotal: pizza.preco // Preço inicial (1 * preco)
        });
    }

    // 4. Salva o carrinho atualizado no localStorage
    salvarItensCarrinho();

    // OPCIONAL: Abrir a Janela Modal para dar feedback
    // if (typeof abrirModal === 'function') {
    //     abrirModal(`"${pizza.nome}" adicionada à sacola!`);
    // }

    console.log(`Pizza ID ${idNumerico} adicionada. Carrinho atual:`, carrinhoItens);
}

// Sua função salvarItensCarrinho() já existe:

function salvarItensCarrinho() {
    localStorage.setItem('carrinhoItens', JSON.stringify(carrinhoItens));
}





// Lógica para a página do carrinho (3carrinho.html)
if (document.title === 'Minha Sacola - Trattoria Pizzaria') {
    // Carrega o carrinho para garantir que os dados de persistência estejam prontos
    carregarItensCarrinho(); 
    // Exibe o HTML dos itens
    exibirItensCarrinho();   
    // Calcula e exibe o total
    exibirTotalCarrinho();   
}


carregarPedidos(); // NOVO: Carrega os números de pedidos existentes ao iniciar










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
