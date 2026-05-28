import customtkinter as ctk
from PIL import Image
import os
# Conectando com o banco de dados dinamicamente
from weather_db import IMAGENS_ESTADOS

# Configuração de aparência - Cores Neon Customizadas
NEON_BLUE = "#00D2FF"
NEON_RED = "#FF3131"
NEON_GREEN = "#39FF14"
NEON_MAGENTA = "#FF00FF"
DARK_BG = "#0B0F14"

ctk.set_appearance_mode("dark")

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        # 1. CONFIGURAÇÃO DA JANELA
        self.title("ESTAÇÃO METEOROLÓGICA INTELIGENTE - P.O.U.R.")
        self.geometry("1200x850")
        self.minsize(950, 850)
        self.configure(fg_color=DARK_BG)

        # --- GRID PRINCIPAL ---
        self.grid_columnconfigure(0, weight=0) 
        self.grid_columnconfigure(1, weight=1) 
        self.grid_rowconfigure(0, weight=1)

        # ================= SIDEBAR (MENU) =================
        self.sidebar_frame = ctk.CTkFrame(self, width=240, corner_radius=0, fg_color="#10141A")
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(4, weight=1) # Espaçador

        # LOGO A3 CLIMA
        self.logo_frame = ctk.CTkFrame(self.sidebar_frame, fg_color="transparent")
        self.logo_frame.grid(row=0, column=0, padx=20, pady=40)
        
        self.logo_a3 = ctk.CTkLabel(self.logo_frame, text="A3", 
                                    font=ctk.CTkFont(family="Orbitron", size=32, weight="bold"),
                                    text_color=NEON_BLUE)
        self.logo_a3.pack(side="left")
        
        self.logo_clima = ctk.CTkLabel(self.logo_frame, text=" CLIMA", 
                                       font=ctk.CTkFont(family="Orbitron", size=28),
                                       text_color="white")
        self.logo_clima.pack(side="left")

        # Botões do Menu
        self.dash_btn = ctk.CTkButton(self.sidebar_frame, text="📊 DASHBOARD", 
                                      fg_color="#3D2022", text_color=NEON_RED, 
                                      border_width=1, border_color=NEON_RED,
                                      hover_color="#5A2D2F", height=40)
        self.dash_btn.grid(row=1, column=0, padx=20, pady=10, sticky="ew")

        self.graph_btn = ctk.CTkButton(self.sidebar_frame, text="📈 GRÁFICOS", fg_color="transparent", text_color="gray", height=40)
        self.graph_btn.grid(row=2, column=0, padx=20, pady=10, sticky="ew")

        self.hist_btn = ctk.CTkButton(self.sidebar_frame, text="🕒 HISTÓRICO", fg_color="transparent", text_color="gray", height=40)
        self.hist_btn.grid(row=3, column=0, padx=20, pady=10, sticky="ew")

        # Status do ESP32
        self.status_container = ctk.CTkFrame(self.sidebar_frame, fg_color="transparent")
        self.status_container.grid(row=5, column=0, padx=20, pady=20, sticky="ew")
        
        self.status_led = ctk.CTkLabel(self.status_container, text="● ESP32 Online", text_color=NEON_GREEN, font=ctk.CTkFont(size=13, weight="bold"))
        self.status_led.pack(anchor="w")
        self.ip_label = ctk.CTkLabel(self.status_container, text="IP: 192.168.1.100", text_color="gray", font=ctk.CTkFont(size=12))
        self.ip_label.pack(anchor="w")

        # ================= PAINEL PRINCIPAL =================
        self.main_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, padx=30, pady=20, sticky="nsew")
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_rowconfigure(3, weight=1) 

        # --- TÍTULO ---
        self.title_label = ctk.CTkLabel(self.main_frame, text="Monitoramento Meteorológico em Tempo Real", 
                                        font=ctk.CTkFont(size=26, weight="bold"), text_color="white", anchor="w")
        self.title_label.grid(row=0, column=0, sticky="ew", pady=(10, 15))

        # --- BARRA DE PESQUISA ---
        self.search_entry = ctk.CTkEntry(self.main_frame, placeholder_text="Pesquisar cidade ou comando Gemini...", 
                                         height=40, border_color=NEON_BLUE, fg_color="#10141A")
        self.search_entry.grid(row=1, column=0, sticky="ew", pady=(0, 20))

        # --- CONTAINER DOS CARDS ---
        self.cards_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.cards_frame.grid(row=2, column=0, sticky="ew", pady=(0, 10))
        self.cards_frame.grid_columnconfigure((0, 1, 2, 3), weight=1, uniform="group1")

        self.create_card(self.cards_frame, "🌡️ Temperatura", "26.5°C", NEON_RED, 0, "▲ +0.2°C/min")
        self.create_card(self.cards_frame, "💧 Umidade", "71.2%", NEON_BLUE, 1, "Está Chovendo?")
        self.create_card(self.cards_frame, "⏲️ Pressão", "1013.2 hPa", NEON_GREEN, 2, "Tendência: Estável")
        self.create_card(self.cards_frame, "🌧️ Status Chuva", "SIM", NEON_MAGENTA, 3, "Ativo há: 5 min")

        # ================= SEÇÃO CIDADE (REINDENTADO DENTRO DO __INIT__) =================
        
        # 1. Criamos um container base com a borda e o fundo escuro padrão (caso a imagem falhe)
        self.city_frame = ctk.CTkFrame(self.main_frame, border_width=2, border_color="#1E242C", fg_color="#10141A")
        self.city_frame.grid(row=3, column=0, pady=(20, 10), sticky="nsew")
        
        try:
            bg_image_pil = Image.open("brasiliaIA.png")
            # Ajustamos o tamanho para preencher adequadamente o container
            self.bg_image = ctk.CTkImage(light_image=bg_image_pil, dark_image=bg_image_pil, size=(900, 250))
            
            # 2. Criamos o Label da imagem DIRETAMENTE ocupando o fundo inteiro do city_frame
            self.bg_label = ctk.CTkLabel(self.city_frame, image=self.bg_image, text="")
            self.bg_label.place(relx=0, rely=0, relwidth=1, relheight=1)
            
        except Exception as e:
            print(f"Erro ao carregar a imagem de fundo: {e}")

        # 3. Criamos um frame interno APENAS para os textos, posicionado por CIMA da imagem usando .place()
        self.text_container = ctk.CTkFrame(self.city_frame, fg_color="transparent")
        self.text_container.place(relx=0, rely=0, relwidth=1, relheight=1)

        # 4. Textos adicionados dentro do contêiner transparente sobreposto
        self.city_info = ctk.CTkLabel(self.text_container, text="São Paulo, Brasil\nCéu Parcialmente Nublado", 
                                      font=ctk.CTkFont(size=24, weight="bold"), justify="left", anchor="w",
                                      fg_color="transparent")
        self.city_info.pack(padx=30, pady=(30, 10), fill="x")
        
        self.city_data = ctk.CTkLabel(self.text_container, text="Temp: 27°C (Sente-se 29°C) | Vento: 15 km/h SE | UV: 6 (Moderado)", 
                                      font=ctk.CTkFont(size=15), text_color="gray", anchor="w",
                                      fg_color="transparent")
        self.city_data.pack(padx=30, pady=(0, 30), fill="x")

    # === FUNÇÃO PARA CRIAR OS CARDS NEON ===
    def create_card(self, parent, title, value, neon_color, column, subtext):
        card = ctk.CTkFrame(parent, fg_color="#10141A", border_width=1, border_color="#1E242C")
        card.grid(row=0, column=column, padx=5, pady=5, sticky="nsew")
        
        # Indicador com a cor neon no topo do card para manter a identidade high-tech
        line = ctk.CTkFrame(card, height=3, fg_color=neon_color)
        line.pack(fill="x", side="top")
        
        lbl_title = ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=13), text_color="gray")
        lbl_title.pack(anchor="w", padx=15, pady=(12, 5))
        
        lbl_value = ctk.CTkLabel(card, text=value, font=ctk.CTkFont(size=22, weight="bold"), text_color="white")
        lbl_value.pack(anchor="w", padx=15, pady=0)
        
        lbl_sub = ctk.CTkLabel(card, text=subtext, font=ctk.CTkFont(size=11), text_color=neon_color)
        lbl_sub.pack(anchor="w", padx=15, pady=(5, 12))

if __name__ == "__main__":
    app = App()
    app.mainloop()