# global_db.py
import unicodedata

def normalizar_texto(texto):
    if not texto:
        return ""
    texto = texto.lower().strip()
    return "".join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')

CONTINENTES = {
    "africa": "África",
    "america do norte": "América do Norte",
    "america do sul": "América do Sul",
    "antartida": "Antártida",
    "asia": "Ásia",
    "europa": "Europa",
    "oceania": "Oceania"
}

ESTADOS_BR = {
    "acre": {"nome": "Acre", "capital": "Rio Branco", "cidades": ["cruzeiro do sul", "tarauaca", "sena madureira"]},
    "alagoas": {"nome": "Alagoas", "capital": "Maceió", "cidades": ["arapiraca", "palmeira dos indios", "maragogi"]},
    "amapa": {"nome": "Amapá", "capital": "Macapá", "cidades": ["santana", "laranjal do jari", "oiapoque"]},
    "amazonas": {"nome": "Amazonas", "capital": "Manaus", "cidades": ["parintins", "itacoatiara", "coari", "manacapuru"]},
    "bahia": {"nome": "Bahia", "capital": "Salvador", "cidades": ["feira de santana", "vitoria da conquista", "camacari", "ilheus", "porto seguro"]},
    "ceara": {"nome": "Ceará", "capital": "Fortaleza", "cidades": ["juazeiro do norte", "sobral", "caucaia", "maracanau"]},
    "distrito federal": {"nome": "Distrito Federal", "capital": "Brasília", "cidades": ["brasilia", "taguatinga", "ceilandia"]},
    "espirito santo": {"nome": "Espírito Santo", "capital": "Vitória", "cidades": ["vila velha", "serra", "cariacica"]},
    "goias": {"nome": "Goiás", "capital": "Goiânia", "cidades": ["aparecida de goiania", "anapolis", "rio verde"]},
    "maranhao": {"nome": "Maranhão", "capital": "São Luís", "cidades": ["imperatriz", "timon", "caxias"]},
    "mato grosso": {"nome": "Mato Grosso", "capital": "Cuiabá", "cidades": ["varzea grande", "rondonopolis", "sinop"]},
    "mato grosso do sul": {"nome": "Mato Grosso do Sul", "capital": "Campo Grande", "cidades": ["dourados", "tres lagoas"]},
    "minas gerais": {"nome": "Minas Gerais", "capital": "Belo Horizonte", "cidades": ["uberlandia", "contagem", "juiz de fora", "betim"]},
    "para": {"nome": "Pará", "capital": "Belém", "cidades": ["ananindeua", "santarem", "maraba", "belem do para"]},
    "paraiba": {"nome": "Paraíba", "capital": "João Pessoa", "cidades": ["campina grande", "santa rita", "patos"]},
    "parana": {"nome": "Paraná", "capital": "Curitiba", "cidades": ["londrina", "maringa", "ponta grossa", "cascavel", "foz do iguacu"]},
    "pernambuco": {"nome": "Pernambuco", "capital": "Recife", "cidades": ["jaboatao dos guararapes", "olinda", "caruaru", "petrolina"]},
    "piaui": {"nome": "Piauí", "capital": "Teresina", "cidades": ["parnaiba", "picos"]},
    "rio de janeiro": {"nome": "Rio de Janeiro", "capital": "Rio de Janeiro", "cidades": ["duque de caixias", "sao goncalo", "nova iguacu", "niteroi"]},
    "rio grande do norte": {"nome": "Rio Grande do Norte", "capital": "Natal", "cidades": ["mossoro", "parnamirim"]},
    "rio grande do sul": {"nome": "Rio Grande do Sul", "capital": "Porto Alegre", "cidades": ["caxias do sul", "canoas", "pelotas", "santa maria"]},
    "rondonia": {"nome": "Rondônia", "capital": "Porto Velho", "cidades": ["ji-parana", "ariquemes"]},
    "roraima": {"nome": "Roraima", "capital": "Boa Vista", "cidades": ["rorainopolis"]},
    "santa catarina": {"nome": "Santa Catarina", "capital": "Florianópolis", "cidades": ["joinville", "blumenau", "sao jose", "chapeco"]},
    "sao paulo": {"nome": "São Paulo", "capital": "São Paulo", "cidades": ["campinas", "santo andre", "osasco", "santos", "interlagos"]},
    "sergipe": {"nome": "Sergipe", "capital": "Aracaju", "cidades": ["nossa senhora do socorro", "lagarto"]},
    "tocantins": {"nome": "Tocantins", "capital": "Palmas", "cidades": ["araguaina", "gurupi"]}
}

PAISES_MUNDO = {
    # EUROPA
    "albania": "Europa", "alemanha": "Europa", "andorra": "Europa", "austria": "Europa", "belgica": "Europa",
    "bielorrussia": "Europa", "bosnia e herzegovina": "Europa", "bulgaria": "Europa", "croacia": "Europa",
    "dinamarca": "Europa", "eslovaquia": "Europa", "eslovenia": "Europa", "espanha": "Europa", "estonia": "Europa",
    "finlandia": "Europa", "franca": "Europa", "grecia": "Europa", "hungria": "Europa", "irlanda": "Europa",
    "islandia": "Europa", "italia": "Europa", "letonia": "Europa", "liechtenstein": "Europa", "lituania": "Europa",
    "luxemburgo": "Europa", "macedonia do norte": "Europa", "malta": "Europa", "moldavia": "Europa", "monaco": "Europa",
    "montenegro": "Europa", "noruega": "Europa", "paises baixos": "Europa", "holanda": "Europa", "polonia": "Europa",
    "portugal": "Europa", "reino unido": "Europa", "inglaterra": "Europa", "escocia": "Europa", "republica tcheca": "Europa", 
    "romenia": "Europa", "russia": "Europa", "san marino": "Europa", "servia": "Europa", "suecia": "Europa", "suica": "Europa", 
    "ucrania": "Europa", "vaticano": "Europa",
    # AMÉRICA DO NORTE
    "canada": "América do Norte", "estados unidos": "América do Norte", "usa": "América do Norte", "mexico": "América do Norte", "groenlandia": "América do Norte",
    # AMÉRICA DO SUL
    "argentina": "América do Sul", "bolivia": "América do Sul", "chile": "América do Sul", "colombia": "América do Sul", "equador": "América do Sul", 
    "guiana": "América do Sul", "paraguai": "América do Sul", "peru": "América do Sul", "suriname": "América do Sul", "uruguai": "América do Sul", "venezuela": "América do Sul",
    # ÁSIA
    "afeganistao": "Ásia", "arabia saudita": "Ásia", "armenia": "Ásia", "azerbaijao": "Ásia", "bangladesh": "Ásia", "china": "Ásia", "coreia do norte": "Ásia", 
    "coreia do sul": "Ásia", "emirados arabes unidos": "Ásia", "filipinas": "Ásia", "india": "Ásia", "indonesia": "Ásia", "iraque": "Ásia", "ira": "Ásia", 
    "israel": "Ásia", "japao": "Ásia", "jordania": "Ásia", "kuwait": "Ásia", "libano": "Ásia", "malasia": "Ásia", "maldivas": "Ásia", "mongolia": "Ásia", 
    "nepal": "Ásia", "paquistao": "Ásia", "catar": "Ásia", "singapura": "Ásia", "siria": "Ásia", "tailandia": "Ásia", "taiwan": "Ásia", "turquia": "Ásia", "vietna": "Ásia",
    # ÁFRICA
    "africa do sul": "África", "angola": "África", "argelia": "África", "cabo verde": "África", "camaroes": "África", "congo": "África", "egito": "África", 
    "etiopia": "África", "gana": "África", "libia": "África", "madagascar": "África", "marrocos": "África", "mocambique": "África", "nigeria": "África", 
    "quenia": "África", "senegal": "África", "somalia": "África", "sudao": "África", "tanzania": "África", "tunisia": "África", "uganda": "África", "zimbabue": "África",
    # OCEANIA
    "australia": "Oceania", "fiji": "Oceania", "nova zelandia": "Oceania", "papua nova guine": "Oceania", "samoa": "Oceania", "tonga": "Oceania"
}

CIDADES_INT = {
    "paris": {"pais": "França", "continente": "Europa"},
    "londres": {"pais": "Reino Unido", "continente": "Europa"},
    "madri": {"pais": "Espanha", "continente": "Europa"},
    "roma": {"pais": "Itália", "continente": "Europa"},
    "berlim": {"pais": "Alemanha", "continente": "Europa"},
    "nova york": {"pais": "Estados Unidos", "continente": "América do Norte"},
    "new york": {"pais": "Estados Unidos", "continente": "América do Norte"},
    "miami": {"pais": "Estados Unidos", "continente": "América do Norte"},
    "toronto": {"pais": "Canadá", "continente": "América do Norte"},
    "buenos aires": {"pais": "Argentina", "continente": "América do Sul"},
    "santiago": {"pais": "Chile", "continente": "América do Sul"},
    "toquio": {"pais": "Japão", "continente": "Ásia"},
    "pequim": {"pais": "China", "continente": "Ásia"},
    "seul": {"pais": "Coreia do Sul", "continente": "Ásia"},
    "cairo": {"pais": "Egito", "continente": "África"},
    "sydney": {"pais": "Austrália", "continente": "Oceania"}
}

def consultar_banco_global(texto):
    termo = normalizar_texto(texto)
    if not termo:
        return None
        
    if termo == "brasil":
        return {"tipo": "pais_br", "nome_exibicao": "Brasil"}
        
    if termo in ESTADOS_BR:
        return {"tipo": "estado_br", "estado": ESTADOS_BR[termo]["nome"]}
        
    for est_chave, est_dados in ESTADOS_BR.items():
        if termo == normalizar_texto(est_dados["capital"]) or termo in est_dados["cidades"]:
            return {
                "tipo": "cidade_br",
                "cidade": texto.title(),
                "estado": est_dados["nome"]
            }
            
    if termo in CIDADES_INT:
        return {
            "tipo": "cidade_int",
            "nome_exibicao": texto.title(),
            "pais": CIDADES_INT[termo]["pais"],
            "continente_nome": CIDADES_INT[termo]["continente"],
            "continente": normalizar_texto(CIDADES_INT[termo]["continente"])
        }
        
    if termo in PAISES_MUNDO:
        cont_nome = PAISES_MUNDO[termo]
        return {
            "tipo": "pais",
            "nome_exibicao": texto.title() if termo != "usa" else "Estados Unidos",
            "continente_nome": cont_nome,
            "continente": normalizar_texto(cont_nome)
        }
        
    if termo in CONTINENTES:
        return {"tipo": "continente", "nome_exibicao": CONTINENTES[termo], "continente": termo}
        
    return None