import sys
import os
from PyQt6.QtWidgets import (QApplication, QWidget, QLabel, QLineEdit, 
                             QPushButton, QHBoxLayout, QVBoxLayout, 
                             QGridLayout, QFrame, QGraphicsDropShadowEffect)
from PyQt6.QtCore import Qt, QUrl, QRect
from PyQt6.QtGui import QFont, QIcon, QPixmap, QPainter, QColor
from PyQt6.QtMultimedia import QMediaPlayer, QAudioOutput, QVideoSink

# Importando a inteligência dos bancos de dados configurados
from global_db import consultar_banco_global, normalizar_texto
from weather_db import obter_imagem_fundo


# =====================================================================
# SEÇÃO DE INTEGRAÇÃO BACKEND (API, WORKFLOWS N8N & GEMINI CHAT AI)
# =====================================================================
class SynapseBackendIntegration:
    """
    Espaço reservado para o Desenvolvedor Backend.
    Aqui deve ser implementada a comunicação com o servidor central,
    autenticação, logs de requisições e ganchos de automação do n8n
    para processamento de linguagem natural via API do Gemini.
    """
    def __init__(self):
        self.n8n_webhook_url = "CONF_SEU_WEBHOOK_N8N_AQUI"
        self.gemini_api_key = "CONF_SUA_CHAVE_GEMINI_AQUI"

    def enviar_requisicao_gemini(self, comando_texto):
        """ Envia o prompt coletado na interface para o n8n/Gemini AI e retorna a resposta """
        pass

    def buscar_dados_meteorologicos_api(self, localidade):
        """ Realiza a chamada HTTP para obter telemetria externa atualizada em tempo real """
        pass


# =====================================================================
# SEÇÃO DE LÓGICA ESP32 (TELEMETRIA WI-FI & PROCESSAMENTO DE SENSORES)
# =====================================================================
class ESP32DataReceiver:
    """
    Espaço reservado para o Desenvolvedor Backend.
    Aqui deve ser inserida a lógica de recepção de dados via WebSockets, MQTT
    ou requisições POST HTTP vindas diretamente da placa ESP32 (Hardware).
    """
    def __init__(self):
        self.esp32_ip_padrao = "192.168.1.100"

    def processar_dados_sensores(self, payload_json):
        """ 
        Coleta dados brutos de Temperatura (DHT22), Umidade, Pressão (BMP280) 
        e Sensor de Chuva enviados pelo hardware e converte para uso na aplicação.
        """
        pass

    def verificar_ping_esp32(self):
        """ Monitora o status de conexão ativa da placa na rede local (Online/Offline) """
        pass


# =====================================================================
# INTERFACE GRÁFICA EM PYQT6 (FRONT-END)
# =====================================================================

class VideoBackgroundFrame(QFrame):
    """
    DESCRIÇÃO: Componente customizado (Widget) responsável pelo motor de renderização
    do vídeo de fundo dinâmico. Gerencia o aspecto responsivo em loop infinito.
    """
    def __init__(self, video_path, parent=None):
        """ Inicializa o player multimédia interno, define renderização sem áudio e inicia o loop do vídeo """
        super().__init__(parent)
        self.current_frame = QPixmap()

        self.media_player = QMediaPlayer()
        self.video_sink = QVideoSink()
        self.media_player.setVideoOutput(self.video_sink)
        self.video_sink.videoFrameChanged.connect(self.process_frame)

        self.audio_output = QAudioOutput()
        self.audio_output.setMuted(True)
        self.media_player.setAudioOutput(self.audio_output)
        self.media_player.setLoops(QMediaPlayer.Loops.Infinite)
        
        if os.path.exists(video_path):
            self.media_player.setSource(QUrl.fromLocalFile(video_path))
            self.media_player.play()

    def process_frame(self, frame):
        """ Evento de gatilho que captura o frame de vídeo atual da GPU e solicita atualização de tela """
        image = frame.toImage()
        if not image.isNull():
            self.current_frame = QPixmap.fromImage(image)
            self.update() 

    def paintEvent(self, event):
        """ Desenha o frame de vídeo na tela calculando o fator de redimensionamento (efeito 'cover') """
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        painter.setRenderHint(QPainter.RenderHint.SmoothPixmapTransform)

        if not self.current_frame.isNull():
            container_w = self.width()
            container_h = self.height()
            video_w = self.current_frame.width()
            video_h = self.current_frame.height()

            scale = max(container_w / video_w, container_h / video_h)
            new_w = int(video_w * scale)
            new_h = int(video_h * scale)

            x = (container_w - new_w) // 2
            y = (container_h - new_h) // 2

            target_rect = QRect(x, y, new_w, new_h)
            painter.drawPixmap(target_rect, self.current_frame)
        else:
            painter.fillRect(self.rect(), QColor("#0B0F14"))
            
        super().paintEvent(event)


class App(QWidget):
    """
    DESCRIÇÃO: Janela principal do sistema Synapse Climate Intelligence.
    Controla o posicionamento global de todos os elementos visuais, eventos de inputs
    e renderização dos layouts de monitoramento.
    """
    def __init__(self):
        """ Inicializa as configurações da janela principal, monta os layouts (sidebar e painel) e aplica o tema neon """
        super().__init__()

        self.pasta_do_script = os.path.dirname(os.path.abspath(__file__))

        self.setWindowTitle("Synapse Climate Intelligence")
        self.resize(1250, 900)
        self.setMinimumSize(1000, 850)
        self.setStyleSheet("background-color: #0B0F14;")
        self.set_window_emoji_icon("🌧️")

        main_layout = QHBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # ================= SIDEBAR =================
        sidebar = QFrame()
        sidebar.setFixedWidth(320)  
        sidebar.setStyleSheet("background-color: #10141A; border: none;")
        
        sidebar_shadow = QGraphicsDropShadowEffect()
        sidebar_shadow.setBlurRadius(15)             
        sidebar_shadow.setColor(QColor(0, 0, 0, 255)) 
        sidebar_shadow.setOffset(6, 0)                
        sidebar.setGraphicsEffect(sidebar_shadow)

        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(25, 50, 25, 25) 
        sidebar_layout.setSpacing(25)

        logo_container = QFrame()
        logo_container.setStyleSheet("background: transparent; border: none;")
        logo_layout = QHBoxLayout(logo_container)
        logo_layout.setContentsMargins(0, 0, 0, 0)
        logo_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        logo_label = QLabel(
            '<span style="color: #00D2FF; text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.95);">Synapse</span> '
            '<span style="color: white; text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.95);">Anemo</span>'
        )
        logo_label.setStyleSheet("""
            QLabel {
                font-family: Orbitron; 
                font-size: 26px; 
                font-weight: bold;
                background: transparent;
                border: none;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 20px;  
                padding-right: 20px; 
            }
        """)
        
        synapse_glow = QGraphicsDropShadowEffect()
        synapse_glow.setBlurRadius(20)          
        synapse_glow.setColor(QColor("#00D2FF")) 
        synapse_glow.setOffset(0, 0)
        logo_label.setGraphicsEffect(synapse_glow)
        
        logo_layout.addWidget(logo_label)
        sidebar_layout.addWidget(logo_container)
        sidebar_layout.addSpacing(5) 

        dash_btn = QPushButton("📊 DASHBOARD")
        dash_btn.setFixedHeight(45)
        dash_btn.setStyleSheet("""
            QPushButton {
                background-color: #3D2022; 
                color: #FF3131; 
                border: 1.5px solid #FF3131; 
                font-weight: bold;
                font-size: 13px;
                border-radius: 6px;
            }
            QPushButton:hover { background-color: #5A2D2F; }
        """)
        sidebar_layout.addWidget(dash_btn)

        btn_glow = QGraphicsDropShadowEffect()
        btn_glow.setBlurRadius(22)  
        btn_glow.setColor(QColor("#FF3131")) 
        btn_glow.setOffset(0, 0)
        dash_btn.setGraphicsEffect(btn_glow)

        sidebar_layout.addStretch() 

        status_container = QFrame()
        status_container.setStyleSheet("background: transparent;")
        status_layout = QVBoxLayout(status_container)
        status_layout.setContentsMargins(5, 0, 5, 0)
        status_layout.setSpacing(6)

        self.status_led = QLabel()
        self.ip_label = QLabel("IP: 192.168.1.100")
        self.ip_label.setStyleSheet("color: gray; font-size: 12px; background: transparent;")
        
        status_layout.addWidget(self.status_led)
        status_layout.addWidget(self.ip_label)
        sidebar_layout.addWidget(status_container)

        self.atualizar_status_esp(True)
        main_layout.addWidget(sidebar)

        # ================= PAINEL PRINCIPAL =================
        caminho_video = os.path.join(self.pasta_do_script, "fundo1.mp4")

        content_panel = VideoBackgroundFrame(caminho_video)
        content_panel.setStyleSheet("border: none;")
        
        content_layout = QVBoxLayout(content_panel)
        content_layout.setContentsMargins(50, 35, 35, 35) 
        content_layout.setSpacing(25) 

        title = QLabel("Monitoramento Meteorológico em Tempo Real")
        title.setStyleSheet("color: white; font-size: 26px; font-weight: bold; background: transparent;")
        content_layout.addWidget(title)

        # --- BARRA DE PESQUISA ---
        self.search_entry = QLineEdit()
        self.search_entry.setPlaceholderText(" 🔍  Pesquisar cidade, país ou continente... (Pressione Enter)")
        self.search_entry.setFixedHeight(45)
        self.search_entry.setStyleSheet("""
            QLineEdit {
                background-color: rgba(16, 20, 26, 0.40); 
                border: 1px solid #00D2FF; 
                color: white; 
                padding-left: 15px;
                font-size: 14px;
                border-radius: 6px;
            }
        """)
        self.search_entry.returnPressed.connect(self.executar_pesquisa)
        content_layout.addWidget(self.search_entry)

        search_glow = QGraphicsDropShadowEffect()
        search_glow.setBlurRadius(25)  
        search_glow.setColor(QColor("#00D2FF")) 
        search_glow.setOffset(0, 0)
        self.search_entry.setGraphicsEffect(search_glow)

        cards_grid = QGridLayout()
        cards_grid.setSpacing(24) 
        cards_grid.addWidget(self.create_card("🌡️ Temperatura", "26.5°C", "#FF3131", "▲ +0.2°C/min"), 0, 0)
        cards_grid.addWidget(self.create_card("💧 Umidade", "71.2%", "#00D2FF", "Está Chovendo?"), 0, 1)
        cards_grid.addWidget(self.create_card("⏲️ Pressão", "1013.2 hPa", "#39FF14", "Tendência: Estável"), 0, 2)
        cards_grid.addWidget(self.create_card("🌧️ Status Chuva", "SIM", "#FF00FF", "Ativo há: 5 min"), 0, 3)
        content_layout.addLayout(cards_grid)

        # ================= SEÇÃO CIDADE (IMAGEM DINÂMICA) =================
        self.city_frame = QFrame()
        self.city_frame.setObjectName("MainCityFrame") 
        self.city_frame.setFixedHeight(240) 

        city_box_shadow = QGraphicsDropShadowEffect()
        city_box_shadow.setBlurRadius(45)                  
        city_box_shadow.setColor(QColor(0, 0, 0, 160))      
        city_box_shadow.setOffset(0, 5)                    
        self.city_frame.setGraphicsEffect(city_box_shadow)

        city_layout = QHBoxLayout(self.city_frame)
        city_layout.setContentsMargins(30, 30, 30, 30)
        
        popup_box = QFrame()
        popup_box.setObjectName("CityPopupBox")
        popup_box.setStyleSheet("""
            QFrame#CityPopupBox {
                background-color: rgba(16, 20, 26, 0.85);
                border: 1px solid #1E242C;
                border-radius: 6px;
            }
            QLabel {
                background: transparent;
                border: none;
            }
        """)
        
        popup_shadow = QGraphicsDropShadowEffect()
        popup_shadow.setBlurRadius(18)
        popup_shadow.setColor(QColor(0, 0, 0, 200)) 
        popup_shadow.setOffset(2, 4)
        popup_box.setGraphicsEffect(popup_shadow)
        
        popup_layout = QVBoxLayout(popup_box)
        popup_layout.setContentsMargins(22, 18, 22, 18)
        popup_layout.setSpacing(10)  
        
        # LINHA 1: Informações de Localidade
        self.city_info = QLabel("São Paulo, Brasil")
        self.city_info.setStyleSheet("color: white; font-size: 22px; font-weight: bold;")
        popup_layout.addWidget(self.city_info)
        
        # LINHA 2: Métricas Meteorológicas em conformidade com os Cards Neon
        self.city_metrics = QLabel("Temp: 26.5°C | Umidade: 71.2% | Pressão: 1013.2 hPa | Chuva: SIM")
        self.city_metrics.setStyleSheet("color: #A0AAB5; font-size: 14px; font-weight: 500;")
        popup_layout.addWidget(self.city_metrics)
        
        # LINHA 3: Status Operacional do Backend
        self.city_status = QLabel("Estação de Monitoramento Regional Operando via Synapse Anemo")
        self.city_status.setStyleSheet("color: #A0AAB5; font-size: 14px;")
        popup_layout.addWidget(self.city_status)
        
        city_layout.addWidget(popup_box)
        city_layout.addStretch()

        content_layout.addWidget(self.city_frame)
        content_layout.addStretch() 

        main_layout.addWidget(content_panel)

        self.aplicar_fundo_por_nome("BRSãoPauloIA.png")

    def executar_pesquisa(self):
        """
        DESCRIÇÃO: Captura a string de pesquisa, consulta os dados locais estruturados,
        atualiza dinamicamente as 3 linhas de texto simétricas do popup e altera
        a imagem de exibição contextualizada.
        
        * NOTA PARA BACKEND: Vincular ganchos para atualizar 'dados_meteorologicos'
          com dados reais de APIs externas ou sensores dinâmicos do ESP32.
        """
        texto_pesquisa = self.search_entry.text().strip()
        if not texto_pesquisa: 
            return
        
        resultado = consultar_banco_global(texto_pesquisa)
        
        if resultado:
            tipo = resultado["tipo"]
            
            # String padronizada e unificada com os valores dos cards neon
            dados_meteorologicos = "Temp: 26.5°C | Umidade: 71.2% | Pressão: 1013.2 hPa | Chuva: SIM"
            self.city_metrics.setText(dados_meteorologicos)
            
            # ----------------- SE FOR BRASIL -----------------
            if tipo in ["estado_br", "cidade_br", "pais_br"]:
                if tipo == "cidade_br":
                    self.city_info.setText(f"{resultado['cidade']}, {resultado['estado']} - Brasil")
                    chave_imagem = normalizar_texto(resultado['estado'])
                elif tipo == "estado_br":
                    self.city_info.setText(f"{resultado['estado']} - Brasil")
                    chave_imagem = normalizar_texto(resultado['estado'])
                else:
                    self.city_info.setText("Brasil")
                    chave_imagem = "sao paulo"
                
                nome_imagem = obter_imagem_fundo("BR", chave_imagem)
                self.city_status.setText("Estação de Monitoramento Regional Operando via Synapse Anemo")
                self.aplicar_fundo_por_nome(nome_imagem)
                
            # ----------------- SE FOR INTERNACIONAL -----------------
            elif tipo in ["continente", "pais", "cidade_int"]:
                continente_chave = resultado["continente"]
                nome_imagem = obter_imagem_fundo("INT", continente_chave)
                
                if tipo == "cidade_int":
                    self.city_info.setText(f"{resultado['nome_exibicao']}, {resultado['pais']} - {resultado['continente_nome']}")
                elif tipo == "pais":
                    self.city_info.setText(f"{resultado['nome_exibicao']} - {resultado['continente_nome']}")
                else:
                    self.city_info.setText(f"{resultado['nome_exibicao']}")
                    
                self.city_status.setText("Telemetria Global Atualizada (Imagem do Continente Alternada)")
                self.aplicar_fundo_por_nome(nome_imagem)
        else:
            # ----------------- ERROS / LUGAR NÃO ENCONTRADO -----------------
            self.city_info.setText("Lugar não Encontrado! Digite novamente!")
            self.city_metrics.setText("---")
            self.city_status.setText("Aviso: Localização ausente ou incorreta nos registros do sistema.")
            self.aplicar_fundo_por_nome("placeholder.png")
            
        self.search_entry.clear()

    def aplicar_fundo_por_nome(self, nome_arquivo):
        """
        DESCRIÇÃO: Altera de forma dinâmica as folhas de estilo do container de imagens (city_frame)
        com base no mapeamento validado pelas consultas dos bancos locais.
        """
        caminho_completo = os.path.join(self.pasta_do_script, nome_arquivo).replace("\\", "/")
        
        if not os.path.exists(caminho_completo):
            nome_arquivo = "placeholder.png"
            caminho_completo = os.path.join(self.pasta_do_script, nome_arquivo).replace("\\", "/")

        if os.path.exists(caminho_completo):
            self.city_frame.setStyleSheet(f"""
                QFrame#MainCityFrame {{
                    background-image: url('{caminho_completo}');
                    background-repeat: no-repeat;
                    background-position: center;
                    border: 2px solid #1E242C;
                    border-radius: 8px;
                }}
            """)
        else:
            self.city_frame.setStyleSheet("""
                QFrame#MainCityFrame {
                    background-color: #10141A;
                    border: 2px solid #FF3131;
                    border-radius: 8px;
                }
            """)

    def atualizar_status_esp(self, online: bool):
        """
        DESCRIÇÃO: Controla a alternância visual e o estilo do widget de LED presente
        na barra lateral, fornecendo feedback instantâneo sobre a saúde física da conexão do ESP32.
        """
        if online:
            self.status_led.setText("● ESP32 Online")
            self.status_led.setStyleSheet("color: #39FF14; font-size: 14px; font-weight: bold; background: transparent;")
        else:
            self.status_led.setText("● ESP32 Offline")
            self.status_led.setStyleSheet("color: #555555; font-size: 14px; font-weight: bold; background: transparent;")

    def create_card(self, title, value, neon_color, subtext):
        """
        DESCRIÇÃO: Fábrica estrutural (Factory Method). Instancia e estiliza de forma automatizada 
        os cartões neon de telemetria, injetando filtros individuais de DropShadow de alta fidelidade visual.
        """
        card = QFrame()
        card.setStyleSheet(f"""
            QFrame {{
                background-color: rgba(10, 14, 20, 0.75); 
                border: 1.5px solid {neon_color}; 
                border-radius: 6px;
            }}
            QLabel {{
                border: none;
                background: transparent;
            }}
        """)
        
        shadow_effect = QGraphicsDropShadowEffect()
        shadow_effect.setBlurRadius(28)                     
        shadow_effect.setColor(QColor(neon_color))          
        shadow_effect.setOffset(0, 0)                       
        card.setGraphicsEffect(shadow_effect)
        
        layout = QVBoxLayout(card)
        layout.setContentsMargins(18, 18, 18, 18)
        layout.setSpacing(8)

        lbl_title = QLabel(title)
        lbl_title.setStyleSheet("color: #D1D9E6; font-size: 13px; font-weight: bold;")
        layout.addWidget(lbl_title)

        lbl_value = QLabel(value)
        lbl_value.setStyleSheet("color: #FFFFFF; font-size: 24px; font-weight: bold;")
        layout.addWidget(lbl_value)

        lbl_sub = QLabel(subtext)
        lbl_sub.setStyleSheet(f"color: {neon_color}; font-size: 11px; font-weight: 500;")
        layout.addWidget(lbl_sub)

        return card

    def set_window_emoji_icon(self, emoji_str):
        """
        DESCRIÇÃO: Converte um caractere unicode/emoji em um mapa de pixels dinâmico e injeta 
        como o ícone de janela nativo do sistema operacional executável.
        """
        try:
            pixmap = QPixmap(32, 32)
            pixmap.fill(Qt.GlobalColor.transparent)
            
            painter = QPainter(pixmap)
            painter.setRenderHint(QPainter.RenderHint.Antialiasing)
            
            font = QFont("Segoe UI Emoji", 20)
            painter.setFont(font)
            painter.drawText(pixmap.rect(), Qt.AlignmentFlag.AlignCenter, emoji_str)
            painter.end()
            
            self.setWindowIcon(QIcon(pixmap))
        except Exception as e:
            print(f"Aviso: Não foi possível aplicar o emoji como ícone da janela: {e}")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = App()
    window.show()
    sys.exit(app.exec())

# =====================================================================
# DEPENDÊNCIAS DE PACOTES E REQUISITOS DE AMBIENTE (PIP INSTALL)
# =====================================================================
# Para rodar este projeto e garantir o correto funcionamento multimédia e visual 
# em qualquer computador de desenvolvimento, execute os comandos abaixo no terminal:
#
# pip install PyQt6
# pip install PyQt6-Multimedia
#
# * Nota de Ambiente: Certifique-se de que os pacotes adicionais de codecs de áudio/vídeo 
#   do sistema operacional host estejam instalados para a leitura correta do arquivo 'fundo1.mp4'.


# ---

### Descrição Simples das Seções

#  ```text
# =================================================================================
#              DESCRIÇÃO BREVE DAS SEÇÕES DO SOFTWARE (ESTRUTURA)
# =================================================================================
# 1. CLASSES DE BACKEND & ESP32: Espaços livres criados no topo do arquivo para o 
#    desenvolvedor programar as conexões de rede, ler dados físicos da placa ESP32
#    e enviar mensagens de texto para a Inteligência Artificial Gemini usando n8n.

# 2. VIDEOBACKGROUNDFRAME: Motor visual que roda o vídeo em loop no fundo das telas
#    com ajuste automático de tamanho quando a janela é esticada ou diminuída.

# 3. APP (MAIN INTERFACE): Estrutura principal do aplicativo onde estão desenhados 
#    a barra de ferramentas cinzenta lateral, o pisca-alerta do ESP32, as caixas de 
#    pesquisa, e os 4 blocos brilhantes (cards neon) com os valores numéricos.

# 4. POPUP BOX (3 LINHAS): Cartão transparente que exibe o nome do lugar, os dados 
#    do clima organizados com distanciamento igualitário e o status do sistema.
# 
# 5. DEPENDÊNCIAS (PIP): Lista de comandos incluída no encerramento para instalar 
#    o PyQt6 de forma rápida no terminal de qualquer outro computador.
# =================================================================================