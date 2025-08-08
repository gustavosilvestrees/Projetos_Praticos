function atualizarTempo(){ // é necessario uma função para utilizar o setInterval

var display =  document.querySelector('.display'); // armazeno o relogio na var display

var agora = new Date();// Retorna o horario do dispositivo que esta o aplicativo

var horario = corrigirHorario(agora.getHours()) + ':' + corrigirHorario(agora.getMinutes()) + ':' + corrigirHorario(agora.getSeconds()); // puxa o horario da var agora e fala pra pegar as horas que foram armazenados no Date(), concatenando com dois pontos(:) em formato de string e usa isso nos minutos e segundos também concatenando todos

// OBS: o corrigirHorario() foi add depois no getHours, getMinutes e getSeconds o valor em cada um deles vai servir como parametro dentro do corrigir o horario ele pega e confere se é necessario colocar um 0 antes do numero caso ele seja menor do que 10

display.textContent = horario; // pede para que a div onde esta o relogio seja alterado para um novo texto ou um textContent e a var display ai receber o conteudo que esta dentro de horario

}

function corrigirHorario(numero){  // crio função para mostrar o numero 0 na frente dos outros numeros
    if (numero < 10){
        numero = '0' + numero;
    }
    return numero
    
    // caso o numero que estiver no relogio for menor < que 10 a variavel numero vai receber um 0 como string e vai concatenar o valor que esta em numero ficando um do lado do outro. Ex: 01, 02, 03 e vai retornar o parametro numero seja com o valor modificado ou não

}


atualizarTempo() // chama a função atualizarTempo logo no inicio para mostrar o horario antes do setInterval ser atualizado para evitar erros como 00:00:00

setInterval(atualizarTempo, 1000); // o setInterval junto do 1000 pede para a pagina atualizar a função atualizarTempo a cada 1 seg



/* Códigos novos aprendidos

new Date(): retorna o horario do dispositivo e o new instancia esse horario

getHours(): Mostra somente as horas do dispositivo
getMinutes(): Mostra somente os minutos
getSeconds(): Retorna os segundos do dispositivo

Dica Extra: para ver esse relogio em qualquer dispositivo é só abrir o projeto com o Live Server e copiar o endereço do link com o ip do seu computador e o servidor que ele esta sendo rodado(servidor 5000 por exemplo)
e o nome do seu arquivo tipo index html
*/
