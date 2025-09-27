let precos = [];
let totalCarrinho = 0;


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
            alert(`Preço adicionado: R$${precoNumero.toFixed(2).replace('.', ',')}`); // alert mostra o que você add e o toFixed() define quantos decimais cada numero

            exibirTotalCarrinho(); //Exibe tudo que convertemos ate agora
        });
    });
}

// ------------------------------------------------
// Lógica para a página do carrinho (2pedidos.html)
// ------------------------------------------------
function criarTarefa(){
    let containerPedidos = document.querySelector('.itens-sacola'); // puxa a section itens sacola
    let novoPedido = document.createElement("div");  //cria div vazia e armazena

    novoPedido.classList.add('item-sacola'); //cria a class dessa div nova todas as divs criadas terão essa classe
    novoPedido.innerHTML = `
        <p class="numP">Número do pedido: <span>#${gerarNumeroPedido()}</span></p>
    `; // cria o conteudo da div


    

    containerPedidos.appendChild(novoPedido); //add novoPedido como filho da section


}

function gerarNumeroPedido() {
  return Math.floor(Math.random() * 100000) + 10000;
} // funçao que gera numero aleatorio




function deletarPedido() {
  let containerPedidos = document.querySelector('.itens-sacola') // encontra aonde estão os;

  // 2. Pega o último pedido na lista, se houver
  let ultimoPedido = containerPedidos.lastElementChild;

  // 3. Verifica se existe um último pedido e o remove
  if (ultimoPedido) {
    containerPedidos.removeChild(ultimoPedido);
  }
}




// ------------------------------------------------
// Lógica para a página do carrinho (3carrinho.html)
// ------------------------------------------------

// A função exibirTotalCarrinho() precisa ser chamada também
// quando a página do carrinho é carregada.
    
carregarCarrinho();
exibirTotalCarrinho();
