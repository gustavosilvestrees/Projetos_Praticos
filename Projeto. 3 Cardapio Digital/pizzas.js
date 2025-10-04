

const CATALOGO_PIZZAS = {
    // ID 1
    1: {
        id: 1,
        nome: 'Pizza de Calabresa',
        preco: 55.00, // Use ponto para decimal
        foto: 'cardapio/1calabresa.png'
    },
    // ID 2
    2: {
        id: 2,
        nome: 'Pizza Bacon e Mussarela',
        preco: 62.50,
        foto: 'cardapio/7bacon_e_mussarela.png'
    },
    // ID 3
    3: {
        id: 3,
        nome: 'Pizza de Frango com Catupiry',
        preco: 60.00,
        foto: 'cardapio/3frango_catupiry.png'
    }
    // Adicione mais pizzas aqui seguindo o padrão
};

// Exportar o catálogo para que o script principal possa usá-lo
// (Em um ambiente de navegador simples, basta que o script seja carregado antes)