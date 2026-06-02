# weather_db.py
import random

MUNDO = {
    "BR": {
        "acre": "BRacreIA.png",
        "alagoas": "BRalagoasIA.png",
        "amapa": "BRamapaJPG.png",
        "amazonas": "BRamazonasIA.png",
        "bahia": "BRbahia.png",
        "para": "BRPara.png",
        "belem do para": "BRbelemdoparaIA.jpg",
        "distrito federal": "BRbrasiliaIA.png", 
        "ceara": "BRcearaIA.jpg",
        "espirito santo": "BRespiritosantoIA.jpg",
        "goias": "BRgoiasIA.jpg",
        "maranhao": "BRmaranhaoIA.jpg",
        "mato grosso do sul": "BRmatogrossodosulIA.jpg",
        "mato grosso": "BRmatogrossoIA.jpg",
        "minas gerais": "BRminasgeraisIA.jpg",
        "paraiba": "BRparaiba.png",
        "pernambuco": "BRpernambucoIA.png",
        "parana": "BRparanaIA.jpg",
        "roraima": "BRroraima.png",
        "rio de janeiro": "BRriodejaneiroIA.png",
        "rio grande do norte": "BRriograndedonorteIA.png",
        "rio grande do sul": "BRriograndedosulIA.png",
        "rondonia": "BRrondoniaIA.jpg",
        "santa catarina": "BRsantacatarinaIA.png",
        "sao paulo": "BRSãoPauloIA.png",
        "sergipe": "BRsergipeIA.png",
        "tocantins": "BRtocantinsIA.png"
    },
    "INT": {
        "africa": [
            "INTAfrica1.png", 
            "INTAfrica2.png", 
            "INTAfrica3.png"
        ],
        "america do norte": [
            "INTAmericadoNorteCanada.png", 
            "INTAmericadoNorteestadosunidos.png", 
            "INTAmericadoNorteMexico.png"
        ],
        "america do sul": [
            "INTAmericadoSulargentina.png", 
            "INTAmericadoSulChile.jpg", 
            "INTAmericadoSulPeru.png"
        ],
        "antartida": [
            "INTAntartida.png"
        ],
        "asia": [
            "INTAsiaChina.png", 
            "INTAsiaDeserto.png", 
            "INTAsiaindia.png", 
            "INTAsiaJapao.png", 
            "INTAsiaoceanopacifico.png"
        ],
        "europa": [
            "IntEuropagrecia.png", 
            "IntEuropainglaterra.png", 
            "IntEuropaparis.png"
        ],
        "oceania": [
            "INTOceania2.png", 
            "INTOceania3.png"
        ]
    }
}

def obter_imagem_fundo(escopo, chave_limpa):
    """
    Retorna a imagem correta do banco.
    - Se escopo for BR, traz a imagem estática daquele estado.
    - Se escopo for INT, pega a categoria do continente e sorteia uma imagem aleatória.
    """
    if escopo == "BR":
        return MUNDO["BR"].get(chave_limpa, "placeholder.png")
        
    elif escopo == "INT":
        lista_imagens = MUNDO["INT"].get(chave_limpa)
        if lista_imagens:
            return random.choice(lista_imagens)
            
    return "placeholder.png"