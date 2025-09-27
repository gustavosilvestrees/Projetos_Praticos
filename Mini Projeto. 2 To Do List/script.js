/* 
Lista de tarefas
[x] Saber quando o botão foi clicado
[x] Pegar o texto dentro do Input
[x] Colocar esse texto na tela
[x] Deletar tarefa da tela(quando clicar no X)
*/

function addTarefa(){
    let inputValue = document.querySelector("input").value; // traz o valor que esta dentro de input

    let li = document.createElement("li") //cria li vazio e armazena
    li.innerHTML = inputValue + '<span onclick="deletarTarefa(this)">❌</span>'; // usa o inner html para alterar o que vai aparecer dentro de li que é o valor de inputValue + a caixa com xzinho

    // OBS: o this dentro de deletarTarefa vai apontar para o valor dentro do proprio li então ele vai retornar o li para eu poder modificar em outra variavel

    document.querySelector("ul").appendChild(li); // usa o appendChild para fazer o li ser filho de ul ou seja li vai ficar dentro de ul
    
    document.querySelector("input").value = '';  /* zera o inputValue para que quando for add uma nova tarefa ele esteja vazio não concatenando com o texto anterior */
}

function deletarTarefa(li){ /* Usa o li como parametro da function */
    li.parentElement.remove(); // remove o li

}
