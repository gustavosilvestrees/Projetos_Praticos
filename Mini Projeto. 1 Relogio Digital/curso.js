class Dev {
    constructor(nome, idade, principalLinguagem) {
        this.nome = nome;
        this.idade = idade;
        this.principalLinguagem = principalLinguagem
    }


    saudacao() {
        console.log(`Oi! Sou dev FrontEnd, trabalho com ${this.principalLinguagem} e me chamo ${this.nome} \n\n`);
    }

}

const dev = new Dev("Pedro", 25, "Javascript");



console.log(dev);
dev.saudacao();