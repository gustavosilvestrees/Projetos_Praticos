let precos = [];
let totalCarrinho = 0; 


// Seleciona todas as divs de pizzas

const itensCardapio = document.querySelectorAll('.item');








itensCardapio.forEach(item => {
    item.addEventListener('click', () => {
        // Encontra o elemento com o preço dentro do item clicado
        const precoElemento = item.querySelector('.strongRed');

        // Obtém o texto do preço (ex: "R$31,90")
        const precoString = precoElemento.textContent;

        // Limpa a string e converte para número
        const precoLimpo = precoString.replace('R$', '').replace(',', '.').trim();
        const precoNumero = parseFloat(precoLimpo);

        // Adiciona o preço ao array
        precos.push(precoNumero);
        alert(`Preço adicionado: ${precoNumero}`);



        // Opcional: Chama uma função para atualizar o total na página
        exibirTotalCarrinho();

    });
});

// A nova função para exibir o total
function exibirTotalCarrinho() {
    // 1. Calcula o total somando todos os itens do array 'precos'
    let total = 0;
    precos.forEach(preco => {
        total += preco;
    });
    



}
