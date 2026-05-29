import sys
import os
from PyQt6.QtWidgets import (QApplication, QWidget, QLabel, QLineEdit, 
                             QPushButton, QHBoxLayout, QVBoxLayout, 
                             QGridLayout, QFrame, QGraphicsDropShadowEffect)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont, QIcon, QPixmap, QPainter, QColor

# Conectando com o banco de dados dinamicamente
from weather_db import IMAGENS_ESTADOS

class App(QWidget):
    def __init__(self):
        super().__init__()

        # 1. CONFIGURAÇÃO DA JANELA PRINCIPAL
        self.setWindowTitle("Synapse Climate Intelligence")
        self.resize(1250, 900)
        self.setMinimumSize(1000, 850)
        self.setStyleSheet("background-color: #0B0F14;")
        
        # Define o emoji de clima 🌧️ como ícone nativo da janela do Windows
        self.set_window_emoji_icon("🌧️")

        # LAYOUT PRINCIPAL (Horizontal: Sidebar | Painel Conteúdo)
        main_layout = QHBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # ================= SIDEBAR (MENU) =================
        sidebar = QFrame()
        sidebar.setFixedWidth(260) 
        sidebar.setStyleSheet("background-color: #10141A; border: none;")
        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(25, 50, 25, 25) 
        sidebar_layout.setSpacing(25)

        # --- LOGO SYNAPSE ANEMO (ESTRUTURA DE CONTAINERS VIA CSS) ---
        # 1. Container Maior que segura os dois lados
        logo_container = QFrame()
        logo_container.setStyleSheet("background: transparent; border: none;")
        logo_layout = QHBoxLayout(logo_container)
        logo_layout.setContentsMargins(0, 0, 0, 0)
        logo_layout.setSpacing(0) 
        logo_layout.setAlignment(Qt.AlignmentFlag.AlignHCenter)

        # 2. Wrapper intermediário exclusivo para o Synapse respirar via CSS/Padding
        synapse_wrapper = QFrame()
        # Aqui está o segredo: o padding no container pai deixa o neon se dissipar sem cortar as letras
        synapse_wrapper.setStyleSheet("""
            QFrame {
                background: transparent;
                border: none;
                padding: 10px 25px 10px 15px; # Topo, Direita (espaço pro "se"), Base, Esquerda
            }
        """)
        synapse_wrapper_layout = QHBoxLayout(synapse_wrapper)
        synapse_wrapper_layout.setContentsMargins(0, 0, 0, 0)

        # 3. A Label pura que recebe o brilho
        synapse_label = QLabel("Synapse")
        synapse_label.setStyleSheet("""
            QLabel {
                color: #00D2FF; 
                font-family: Orbitron; 
                font-size: 28px; 
                font-weight: bold;
                background: transparent;
                border: none;
            }
        """)
        
        # Efeito de brilho aplicado diretamente na label isolada
        synapse_glow = QGraphicsDropShadowEffect()
        synapse_glow.setBlurRadius(22)          
        synapse_glow.setColor(QColor("#00D2FF")) 
        synapse_glow.setOffset(0, 0)
        synapse_label.setGraphicsEffect(synapse_glow)
        
        # Adiciona a label no seu wrapper exclusivo
        synapse_wrapper_layout.addWidget(synapse_label)

        # 4. Lado do Anemo (com uma margem superior simples via CSS para alinhar perfeitamente)
        anemo_label = QLabel(" Anemo")
        anemo_label.setStyleSheet("""
            QLabel {
                color: white; 
                font-family: Orbitron; 
                font-size: 24px;
                background: transparent;
                border: none;
                padding-top: 14px; # Alinha perfeitamente com o centro vertical do Synapse
            }
        """)

        # Monta os blocos no container principal da Logo
        logo_layout.addWidget(synapse_wrapper)
        logo_layout.addWidget(anemo_label)
        
        sidebar_layout.addWidget(logo_container)
        sidebar_layout.addSpacing(5) 

        # Botão do Menu (Dashboard)
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

        # --- EFEITO NEON AUMENTADO EM 50% NO BOTÃO DASHBOARD ---
        btn_glow = QGraphicsDropShadowEffect()
        btn_glow.setBlurRadius(22)  
        btn_glow.setColor(QColor("#FF3131")) 
        btn_glow.setOffset(0, 0)
        dash_btn.setGraphicsEffect(btn_glow)

        sidebar_layout.addStretch() 

        # Container para os textos de status do dispositivo
        status_container = QFrame()
        status_container.setStyleSheet("background: transparent;")
        status_layout = QVBoxLayout(status_container)
        status_layout.setContentsMargins(5, 0, 5, 0)
        status_layout.setSpacing(6)

        # Labels de status armazenadas como atributos para modificação dinâmica
        self.status_led = QLabel()
        self.ip_label = QLabel("IP: 192.168.1.100")
        self.ip_label.setStyleSheet("color: gray; font-size: 12px; background: transparent;")
        
        status_layout.addWidget(self.status_led)
        status_layout.addWidget(self.ip_label)
        sidebar_layout.addWidget(status_container)

        # Inicializa o status do ESP32
        self.atualizar_status_esp(True)

        main_layout.addWidget(sidebar)

        # ================= PAINEL PRINCIPAL =================
        content_panel = QFrame()
        content_layout = QVBoxLayout(content_panel)
        content_layout.setContentsMargins(35, 35, 35, 35) 
        content_layout.setSpacing(25) 

        # --- TÍTULO ---
        title = QLabel("Monitoramento Meteorológico em Tempo Real")
        title.setStyleSheet("color: white; font-size: 26px; font-weight: bold; background: transparent;")
        content_layout.addWidget(title)

        # --- BARRA DE PESQUISA ---
        search_entry = QLineEdit()
        search_entry.setPlaceholderText(" 🔍  Pesquisar cidade ou comando Gemini...")
        search_entry.setFixedHeight(45)
        search_entry.setStyleSheet("""
            QLineEdit {
                background-color: #10141A; 
                border: 1px solid #00D2FF; 
                color: white; 
                padding-left: 15px;
                font-size: 14px;
                border-radius: 6px;
            }
        """)
        content_layout.addWidget(search_entry)

        # --- EFEITO NEON AUMENTADO EM 50% NA BARRA DE PESQUISA ---
        search_glow = QGraphicsDropShadowEffect()
        search_glow.setBlurRadius(25)  
        search_glow.setColor(QColor("#00D2FF")) 
        search_glow.setOffset(0, 0)
        search_entry.setGraphicsEffect(search_glow)

        # --- CONTAINER DOS CARDS ---
        cards_grid = QGridLayout()
        cards_grid.setSpacing(24) 

        # Criando e adicionando os cards com os novos efeitos aplicados
        cards_grid.addWidget(self.create_card("🌡️ Temperatura", "26.5°C", "#FF3131", "▲ +0.2°C/min"), 0, 0)
        cards_grid.addWidget(self.create_card("💧 Umidade", "71.2%", "#00D2FF", "Está Chovendo?"), 0, 1)
        cards_grid.addWidget(self.create_card("⏲️ Pressão", "1013.2 hPa", "#39FF14", "Tendência: Estável"), 0, 2)
        cards_grid.addWidget(self.create_card("🌧️ Status Chuva", "SIM", "#FF00FF", "Ativo há: 5 min"), 0, 3)
        
        content_layout.addLayout(cards_grid)

        # ================= SEÇÃO CIDADE =================
        self.city_frame = QFrame()
        self.city_frame.setObjectName("MainCityFrame") 
        self.city_frame.setFixedHeight(240) 
        
        # Resolução de caminhos absoluta para a imagem de fundo
        pasta_do_script = os.path.dirname(os.path.abspath(__file__))
        caminho_imagem = os.path.join(pasta_do_script, "sergipeIA.png").replace("\\", "/") 
        
        if os.path.exists(caminho_imagem):
            self.city_frame.setStyleSheet(f"""
                QFrame#MainCityFrame {{
                    background-image: url('{caminho_imagem}');
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
                    border: 2px solid #1E242C;
                    border-radius: 8px;
                }
            """)

        city_layout = QHBoxLayout(self.city_frame)
        city_layout.setContentsMargins(30, 30, 30, 30)
        
        # --- CAIXA ESTILO POP-UP ---
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
        
        # Box Shadow escuro para dar profundidade e destacar o pop-up
        popup_shadow = QGraphicsDropShadowEffect()
        popup_shadow.setBlurRadius(18)
        popup_shadow.setColor(QColor(0, 0, 0, 200)) 
        popup_shadow.setOffset(2, 4)
        popup_box.setGraphicsEffect(popup_shadow)
        
        popup_layout = QVBoxLayout(popup_box)
        popup_layout.setContentsMargins(22, 18, 22, 18)
        popup_layout.setSpacing(10)
        
        city_info = QLabel("São Paulo, Brasil\nCéu Parcialmente Nublado")
        city_info.setStyleSheet("color: white; font-size: 22px; font-weight: bold;")
        popup_layout.addWidget(city_info)
        
        city_data = QLabel("Temp: 27°C (Sente-se 29°C) | Vento: 15 km/h SE | UV: 6 (Moderado)")
        city_data.setStyleSheet("color: #A0AAB5; font-size: 14px;")
        popup_layout.addWidget(city_data)
        
        city_layout.addWidget(popup_box)
        city_layout.addStretch()

        content_layout.addWidget(self.city_frame)
        content_layout.addStretch() 

        main_layout.addWidget(content_panel)

    # === FUNÇÃO PARA ALTERAR DINAMICAMENTE O STATUS DO ESP32 ===
    def atualizar_status_esp(self, online: bool):
        if online:
            self.status_led.setText("● ESP32 Online")
            self.status_led.setStyleSheet("color: #39FF14; font-size: 14px; font-weight: bold; background: transparent;")
        else:
            self.status_led.setText("● ESP32 Offline")
            self.status_led.setStyleSheet("color: #555555; font-size: 14px; font-weight: bold; background: transparent;")

    # === FUNÇÃO PARA CRIAR OS CARDS COM BORDAS NEON E BOX SHADOW ===
    def create_card(self, title, value, neon_color, subtext):
        card = QFrame()
        card.setStyleSheet(f"""
            QFrame {{
                background-color: #10141A; 
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
        lbl_title.setStyleSheet("color: gray; font-size: 13px;")
        layout.addWidget(lbl_title)

        lbl_value = QLabel(value)
        lbl_value.setStyleSheet("color: white; font-size: 22px; font-weight: bold;")
        layout.addWidget(lbl_value)

        lbl_sub = QLabel(subtext)
        lbl_sub.setStyleSheet(f"color: {neon_color}; font-size: 11px;")
        layout.addWidget(lbl_sub)

        return card

    # === GERADOR DINÂMICO DE ÍCONE DE JANELA ATRAVÉS DE EMOJI ===
    def set_window_emoji_icon(self, emoji_str):
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

# === FUNÇÃO PARA CRIAR OS CARDS COM TEXTO CINZA BEM CLARO (BOLD) E IDENTIDADE NEON ===
    def create_card(self, title, value, neon_color, subtext):
        card = QFrame()
        
        # Converte a cor hexadecimal para RGBA suave para criar o preenchimento translúcido
        qcolor = QColor(neon_color)
        rgba_bg = f"rgba({qcolor.red()}, {qcolor.green()}, {qcolor.blue()}, 0.04)"

        card.setStyleSheet(f"""
            QFrame {{
                background-color: {rgba_bg}; 
                border: 1.5px solid {neon_color}; 
                border-radius: 6px;
            }}
            QLabel {{
                border: none;
                background: transparent;
            }}
        """)
        
        # Mantém o efeito neon apenas na borda do bloco (seguro e sem bugs de corte)
        shadow_effect = QGraphicsDropShadowEffect()
        shadow_effect.setBlurRadius(28)                     
        shadow_effect.setColor(QColor(neon_color))          
        shadow_effect.setOffset(0, 0)                       
        card.setGraphicsEffect(shadow_effect)
        
        layout = QVBoxLayout(card)
        layout.setContentsMargins(18, 18, 18, 18)
        layout.setSpacing(8)

        # 1. Identificadores (Temperatura, Umidade, etc.) alterados para CINZA BEM CLARO (Bold)
        lbl_title = QLabel(title)
        lbl_title.setStyleSheet("color: #D1D9E6; font-size: 13px; font-weight: bold;")
        layout.addWidget(lbl_title)

        # 2. Valores principais em BRANCO PURO (Bold)
        lbl_value = QLabel(value)
        lbl_value.setStyleSheet("color: #FFFFFF; font-size: 24px; font-weight: bold;")
        layout.addWidget(lbl_value)

        # 3. Subtexto inferior acompanhando a cor pura do tema do card
        lbl_sub = QLabel(subtext)
        lbl_sub.setStyleSheet(f"color: {neon_color}; font-size: 11px; font-weight: 500;")
        layout.addWidget(lbl_sub)

        return card


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = App()
    window.show()
    sys.exit(app.exec())