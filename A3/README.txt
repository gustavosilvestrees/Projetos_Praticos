# Synapse Climate Intelligence - Front-End (P.O.U.R.)

Este repositório contém a aplicação de interface gráfica de alta fidelidade visual para o ecossistema de monitoramento climático inteligente **Synapse Anemo**. Desenvolvido inteiramente sobre a arquitetura Python 3 e PyQt6, o software traz uma estética futurista com layouts baseados em Glassmorphism, Neon Glow e renderização acelerada por GPU de planos de fundo dinâmicos em vídeo.

## 🛠️ Arquitetura e Seções do Front-End

A interface do programa está estruturada de maneira modular nas seguintes camadas visuais:

1. **Plano de Fundo Dinâmico (`VideoBackgroundFrame`)**: Gerenciador customizado para renderizar vídeos `.mp4` em loop responsivo contínuo através do `QMediaPlayer`.
2. **Barra Lateral Integrada (Sidebar)**: Área operacional de controle contendo branding da aplicação, botões de ação e o **LED Indicador de Status do ESP32**.
3. **Barra de Pesquisa Fluida**: Caixa de entrada interativa com ganchos ativados pela tecla `Enter` que aciona as consultas analíticas de localização.
4. **Cards Avançados em Grid**: Quatro painéis de telemetria individuais equipados com filtros gráficos de desfoque e sombras de brilho neon contendo:
   * 🌡️ Temperatura
   * 💧 Umidade
   * ⏲️ Pressão Atmosférica
   * 🌧️ Status de Chuva Ativa
5. **Pop-up de Detalhes Contextuais**: Painel de informações em três linhas simétricas idênticas, exibindo localização, métricas alinhadas aos cards neon e status operacional do sistema de monitoramento regional.

## 🚀 Orientações para Desenvolvimento Backend (Integração)

O arquivo principal `interface.py` já foi pré-estruturado e catalogado para receber as seguintes pontes de dados:

* **Integração com o n8n e Gemini AI**: A classe `SynapseBackendIntegration` deve ser utilizada para mapear os webhooks do n8n para enviar os prompts e as análises climáticas da IA para os componentes de interface.
* **Lógica ESP32 via Wi-Fi**: A classe `ESP32DataReceiver` serve como ponto de entrada para capturar dados vindos do microcontrolador na rede e atualizar a variável `dados_meteorologicos` na rotina de busca, além de alternar dinamicamente o método `.atualizar_status_esp(True/False)`.

## 📦 Requisitos e Dependências

Para executar este projeto em outra máquina, certifique-se de possuir o Python 3.10+ instalado e execute o download das bibliotecas gráficas oficiais via gerenciador de pacotes:

```bash
pip install PyQt6
pip install PyQt6-Multimedia