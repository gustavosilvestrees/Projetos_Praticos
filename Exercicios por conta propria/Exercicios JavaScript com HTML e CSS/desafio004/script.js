

function Comprar(){
    const nomeProduto = prompt(`Que produto você está comprando?`);
    const valorProd = parseFloat(prompt(`Quando custa o ${nomeProduto} que você está comprando?`));
    const dindin = parseFloat(prompt(`Qual foi o valor que você deu para pagar ${nomeProduto}?`));

    checar(nomeProduto, valorProd, dindin)

}

function checar(prod, valorProd, valorDado){
    if(valorDado == valorProd){
        alert(`Você comprou ${prod} que custou R$${valorProd}. Você deu R$${valorDado} em Dinheiro. Volte Sempre!`);
    } 
    else if(valorDado > valorProd){
        let newTroco = valorDado - valorProd;

        alert(`Você comprou ${prod} que custou R$${valorProd}. Você deu R$${valorDado} em Dinheiro e vai receber ${newTroco} de Troco. Volte Sempre!`);
    } 
    else if(valorDado < valorProd){
        alert('Valor menor que o preço do produto, não é possível comprar pobre!')
    }

}
