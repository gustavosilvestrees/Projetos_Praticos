/*function menuShow(){
    let menuMobile = document.querySelector('menuMobile') // Cria uma variavel que vai receber nossa classe .mobileMenu

    if(menuMobile.classList.contains('open')){ //Vai checar se o conteúdo armazenado na nossa let menuMobile tem contem o elemento CSS .open, ele checa isso atraves do classList e usa o atributo contains() que checa se open está dentro do mobileMenu
        menuMobile.classList.remove('open') // Se der verdadeiro o Open será removido do menuMobile
        document.querySelector('.mobileMenuIcon').src = "icones/menu.svg"
    } else {
        menuMobile.classList.add('open') // Se der falso vai add Open dentro do menuMobile
        document.querySelector('.mobileMenuIcon').src = "icones/close.svg"
    } //
}*/

const janela = document.querySelector('.menuMobile')
const botao = document.querySelector('.mobileMenuIcon')
let isVisible = false



 botao.addEventListener('click', () => {
    if(isVisible){
    janela.style.display = 'none';
    isVisible = false
} else {
     janela.style.display = 'block';
     isVisible = true
}  
    });