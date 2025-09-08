

function Mensagem(){
   let coleta = parseInt(prompt('Digite um número inteiro qualquer'));
   let ant = coleta - 1;
   let suc = coleta + 1;
   alert(`O número digitado foi ${coleta}`);
   Mostrar(coleta,ant,suc);

}

function Mostrar(col,n1,n2){
   alert(`Antes de ${col} temos ${n1}. Depois de ${col} temos ${n2}`);
}