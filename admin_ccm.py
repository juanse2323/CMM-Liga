import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
import subprocess
from datetime import datetime
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "src", "data.json")
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")

if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

clubes = []
partidos = []
noticias = []

clubes_iniciales = [
    {"id": "1", "nombre": "Atlético Nacional", "logoUrl": "https://via.placeholder.com/64?text=AN", "jugadores": []},
    {"id": "2", "nombre": "Millonarios FC", "logoUrl": "https://via.placeholder.com/64?text=MIL", "jugadores": []},
    {"id": "3", "nombre": "América de Cali", "logoUrl": "https://via.placeholder.com/64?text=AMC", "jugadores": []},
    {"id": "4", "nombre": "Deportivo Cali", "logoUrl": "https://via.placeholder.com/64?text=DCI", "jugadores": []},
    {"id": "5", "nombre": "Independiente Santa Fe", "logoUrl": "https://via.placeholder.com/64?text=SFE", "jugadores": []},
    {"id": "6", "nombre": "Deportivo Pasto", "logoUrl": "https://via.placeholder.com/64?text=DPA", "jugadores": []},
    {"id": "7", "nombre": "Deportes Tolima", "logoUrl": "https://via.placeholder.com/64?text=TOL", "jugadores": []},
    {"id": "8", "nombre": "Deportivo Pereira", "logoUrl": "https://via.placeholder.com/64?text=PER", "jugadores": []},
    {"id": "9", "nombre": "Independiente Medellín", "logoUrl": "https://via.placeholder.com/64?text=MED", "jugadores": []},
    {"id": "10", "nombre": "Fortaleza CEIF", "logoUrl": "https://via.placeholder.com/64?text=FOR", "jugadores": []},
    {"id": "11", "nombre": "Unión Magdalena", "logoUrl": "https://via.placeholder.com/64?text=UMG", "jugadores": []},
    {"id": "12", "nombre": "Llaneros FC", "logoUrl": "https://via.placeholder.com/64?text=LLY", "jugadores": []},
    {"id": "13", "nombre": "Atlético Bucaramanga", "logoUrl": "https://via.placeholder.com/64?text=BUC", "jugadores": []},
    {"id": "14", "nombre": "Internacional De Bogotá", "logoUrl": "https://via.placeholder.com/64?text=IDB", "jugadores": []},
    {"id": "15", "nombre": "Boyacá Chicó", "logoUrl": "https://via.placeholder.com/64?text=BCH", "jugadores": []},
    {"id": "16", "nombre": "Jaguares de Córdoba", "logoUrl": "https://via.placeholder.com/64?text=JAG", "jugadores": []},
    {"id": "17", "nombre": "Patriotas", "logoUrl": "https://via.placeholder.com/64?text=PAT", "jugadores": []},
    {"id": "18", "nombre": "Boca Juniors De Cali", "logoUrl": "https://via.placeholder.com/64?text=BJC", "jugadores": []},
]

partidos_iniciales = [
    {"id": "1", "localId": "1", "visitanteId": "2", "fecha": "2026-05-10", "hora": "18:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "2", "localId": "3", "visitanteId": "4", "fecha": "2026-05-10", "hora": "20:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "3", "localId": "5", "visitanteId": "6", "fecha": "2026-05-11", "hora": "16:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "4", "localId": "7", "visitanteId": "8", "fecha": "2026-05-11", "hora": "18:30", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "5", "localId": "9", "visitanteId": "10", "fecha": "2026-05-12", "hora": "18:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "6", "localId": "11", "visitanteId": "12", "fecha": "2026-05-12", "hora": "20:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "7", "localId": "13", "visitanteId": "14", "fecha": "2026-05-13", "hora": "18:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "8", "localId": "15", "visitanteId": "16", "fecha": "2026-05-13", "hora": "20:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
    {"id": "9", "localId": "17", "visitanteId": "18", "fecha": "2026-05-14", "hora": "18:00", "golesLocal": None, "golesVisitante": None, "jugado": False, "jornada": 1},
]

noticias_iniciales = [
    {"id": "1", "titulo": "Liga CCM announce el inicio de la temporada 2026", "subtitulo": "La competencia más emocionante del fútbol", "contenido": "La Liga CCM se complace en anunciar el inicio oficial.", "imagenUrl": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop", "fecha": "2026-05-01", "categoria": "Torneo", "destacada": True},
    {"id": "2", "titulo": "Nacional refuerza su plantilla", "subtitulo": "El equipo verdolaga presentó nuevos fichajes", "contenido": "Atlético Nacional presentó oficialmente a sus refuerzos.", "imagenUrl": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=400&fit=crop", "fecha": "2026-04-28", "categoria": "Transferencia", "destacada": True},
]

def cargar_datos():
    global clubes, partidos, noticias
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            clubes = data.get("clubes", clubes_iniciales.copy())
            partidos = data.get("partidos", partidos_iniciales.copy())
            noticias = data.get("noticias", noticias_iniciales.copy())
    else:
        clubes = clubes_iniciales.copy()
        partidos = partidos_iniciales.copy()
        noticias = noticias_iniciales.copy()

def guardar_datos():
    global clubes, partidos, noticias
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump({"clubes": clubes, "partidos": partidos, "noticias": noticias}, f, indent=2, ensure_ascii=False)

def obtener_nombre_club(club_id):
    for c in clubes:
        if c["id"] == club_id:
            return c["nombre"]
    return "Unknown"

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("CCM Admin - Panel de Gestión")
        self.root.geometry("1100x650")
        
        if not os.path.exists(IMAGES_DIR):
            os.makedirs(IMAGES_DIR)
        
        cargar_datos()
        
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.crear_tabs()
        
        btn_frame = ttk.Frame(root)
        btn_frame.pack(fill="x", padx=10, pady=5)
        
        ttk.Button(btn_frame, text="Aplicar cambios y Git Push", command=self.git_push, style="Accent.TButton").pack(side="right", padx=5)
        ttk.Button(btn_frame, text="Guardar datos", command=self.guardar_local).pack(side="right", padx=5)
        
        self.status_label = ttk.Label(btn_frame, text="Listo")
        self.status_label.pack(side="left", padx=10)
    
    def git_push(self):
        guardar_datos()
        try:
            subprocess.run(["git", "add", "src/data.json", "public/images"], check=True, capture_output=True)
            subprocess.run(["git", "commit", "-m", "Actualización de datos desde admin Python"], check=True, capture_output=True)
            subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)
            self.status_label.config(text="✓ Push completado")
            messagebox.showinfo("Éxito", "Cambios subidos a GitHub")
        except Exception as e:
            self.status_label.config(text="✗ Error")
            messagebox.showerror("Error", f"Error en Git: {str(e)}")
    
    def guardar_local(self):
        guardar_datos()
        self.status_label.config(text="✓ Guardado")
        messagebox.showinfo("Guardado", "Datos guardados en src/data.json")
    
    def crear_tabs(self):
        self.tab_clubes = ttk.Frame(self.notebook)
        self.tab_jugadores = ttk.Frame(self.notebook)
        self.tab_partidos = ttk.Frame(self.notebook)
        self.tab_noticias = ttk.Frame(self.notebook)
        self.tab_estadisticas = ttk.Frame(self.notebook)
        
        self.notebook.add(self.tab_clubes, text="🏆 Clubes")
        self.notebook.add(self.tab_jugadores, text="👤 Jugadores")
        self.notebook.add(self.tab_partidos, text="⚽ Partidos")
        self.notebook.add(self.tab_noticias, text="📰 Noticias")
        self.notebook.add(self.tab_estadisticas, text="📊 Estadísticas")
        
        self.configurar_tab_clubes()
        self.configurar_tab_jugadores()
        self.configurar_tab_partidos()
        self.configurar_tab_noticias()
        self.configurar_tab_estadisticas()
    
    def configurar_tab_clubes(self):
        frame = ttk.LabelFrame(self.tab_clubes, text="Gestión de Clubes")
        frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        cols = ("ID", "Nombre", "Logo URL")
        self.tree_clubes = ttk.Treeview(frame, columns=cols, show="headings", height=15)
        for col in cols:
            self.tree_clubes.heading(col, text=col)
            self.tree_clubes.column(col, width=150)
        self.tree_clubes.pack(fill="both", expand=True)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=5)
        ttk.Button(btn_frame, text="➕ Agregar Club", command=self.agregar_club).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="✏️ Editar", command=self.editar_club).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🗑️ Eliminar", command=self.eliminar_club).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🔄 Recargar", command=self.recargar_clubes).pack(side="right", padx=5)
        
        self.recargar_clubes()
    
    def recargar_clubes(self):
        for item in self.tree_clubes.get_children():
            self.tree_clubes.delete(item)
        for c in clubes:
            url = c["logoUrl"][:40] + "..." if len(c.get("logoUrl", "")) > 40 else c.get("logoUrl", "")
            self.tree_clubes.insert("", "end", values=(c["id"], c["nombre"], url))
    
    def agregar_club(self):
        win = tk.Toplevel(self.root)
        win.title("Agregar Club")
        win.geometry("450x450")
        
        ttk.Label(win, text="Nombre del Club:").pack(pady=5)
        ent_nombre = ttk.Entry(win, width=40)
        ent_nombre.pack(pady=5)
        
        ttk.Label(win, text="URL del Logo:").pack(pady=5)
        ent_url = ttk.Entry(win, width=40)
        ent_url.pack(pady=5)
        
        lbl_preview = tk.Label(win, text="Vista previa del logo", bg="#ddd", width=30, height=8)
        lbl_preview.pack(pady=10)
        
        btn_seleccionar = tk.Button(win, text="📁 SUBIR IMAGEN DESDE MI PC", bg="#4CAF50", fg="white", font=("Arial", 10, "bold"), command=lambda: self._seleccionar_y_preview(ent_url, lbl_preview))
        btn_seleccionar.pack(pady=10, fill="x", padx=20)
        
        def guardar():
            nuevo = {"id": str(len(clubes) + 1), "nombre": ent_nombre.get(), "logoUrl": ent_url.get() or "https://via.placeholder.com/64?text=CCM", "jugadores": []}
            clubes.append(nuevo)
            self.recargar_clubes()
            guardar_datos()
            win.destroy()
        
        ttk.Button(win, text="💾 Guardar Club", command=guardar).pack(pady=20)
    
    def _seleccionar_y_preview(self, entry, lbl_preview):
        ruta = filedialog.askopenfilename(filetypes=[("Imágenes", "*.png;*.jpg;*.jpeg;*.gif;*.webp")])
        if ruta:
            nombre = os.path.basename(ruta)
            destino = os.path.join(IMAGES_DIR, nombre)
            shutil.copy(ruta, destino)
            entry.delete(0, "end")
            entry.insert(0, f"/images/{nombre}")
            
            try:
                img = tk.PhotoImage(file=destino)
                img = img.subsample(max(1, max(img.width() // 64, img.height() // 64)))
                lbl_preview.image = img
                lbl_preview.config(image=img, text="")
            except:
                lbl_preview.config(text="Imagen cargada")
    
    def editar_club(self):
        sel = self.tree_clubes.selection()
        if not sel:
            messagebox.showwarning("Seleccionar", "Seleccione un club")
            return
        item = self.tree_clubes.item(sel[0])
        cid, cnombre, _ = item["values"]
        club = next((c for c in clubes if c["id"] == cid), None)
        
        win = tk.Toplevel(self.root)
        win.title("Editar Club")
        win.geometry("450x500")
        
        ttk.Label(win, text="Nombre:").pack(pady=5)
        ent_nombre = ttk.Entry(win, width=40)
        ent_nombre.insert(0, cnombre)
        ent_nombre.pack(pady=5)
        
        ttk.Label(win, text="URL del Logo:").pack(pady=5)
        ent_url = ttk.Entry(win, width=40)
        ent_url.insert(0, club.get("logoUrl", ""))
        ent_url.pack(pady=5)
        
        btn_seleccionar = tk.Button(win, text="📁 SUBIR IMAGEN DESDE MI PC", bg="#4CAF50", fg="white", font=("Arial", 10, "bold"), command=lambda: self._seleccionar_y_preview(ent_url, lbl_preview))
        btn_seleccionar.pack(pady=10, fill="x", padx=20)
        
        lbl_preview = tk.Label(win, text="Vista previa del logo", bg="#ddd", width=30, height=8)
        lbl_preview.pack(pady=10)
        
        def actualizar_preview():
            url = ent_url.get()
            if url:
                if url.startswith("/images/") and os.path.exists(os.path.join(BASE_DIR, "public", url.lstrip("/"))):
                    try:
                        img_path = os.path.join(BASE_DIR, "public", url.lstrip("/"))
                        img = tk.PhotoImage(file=img_path)
                        img = img.subsample(max(1, max(img.width() // 64, img.height() // 64)))
                        lbl_preview.image = img
                        lbl_preview.config(image=img, text="")
                    except:
                        lbl_preview.config(text="Vista previa")
                elif url.startswith("http"):
                    lbl_preview.config(text="URL externa\n(no se puede previsualizar)")
                else:
                    lbl_preview.config(text="Vista previa")
            else:
                lbl_preview.config(text="Vista previa", image="")
        
        actualizar_preview()
        
        def guardar():
            club["nombre"] = ent_nombre.get()
            club["logoUrl"] = ent_url.get()
            self.recargar_clubes()
            guardar_datos()
            win.destroy()
        
        ttk.Button(win, text="💾 Guardar Cambios", command=guardar).pack(pady=20)
    
    def eliminar_club(self):
        sel = self.tree_clubes.selection()
        if not sel:
            return
        if messagebox.askyesno("Confirmar", "¿Eliminar club?"):
            cid = self.tree_clubes.item(sel[0])["values"][0]
            global clubes
            clubes = [c for c in clubes if c["id"] != cid]
            self.recargar_clubes()
            guardar_datos()
    
    def configurar_tab_jugadores(self):
        frame = ttk.LabelFrame(self.tab_jugadores, text="Gestión de Jugadores")
        frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        ttk.Label(frame, text="Seleccionar Club:").pack()
        self.combo_club = ttk.Combobox(frame, values=[c["nombre"] for c in clubes], state="readonly", width=30)
        self.combo_club.pack(pady=5)
        self.combo_club.bind("<<ComboboxSelected>>", lambda e: self.cargar_jugadores())
        
        cols = ("ID", "Nombre", "Posición", "Número")
        self.tree_jugadores = ttk.Treeview(frame, columns=cols, show="headings", height=12)
        for col in cols:
            self.tree_jugadores.heading(col, text=col)
            self.tree_jugadores.column(col, width=120)
        self.tree_jugadores.pack(fill="both", expand=True)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=5)
        ttk.Button(btn_frame, text="➕ Agregar Jugador", command=self.agregar_jugador).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="✏️ Editar", command=self.editar_jugador).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🗑️ Eliminar", command=self.eliminar_jugador).pack(side="left", padx=5)
    
    def cargar_jugadores(self):
        club_nombre = self.combo_club.get()
        club = next((c for c in clubes if c["nombre"] == club_nombre), None)
        
        for item in self.tree_jugadores.get_children():
            self.tree_jugadores.delete(item)
        
        if club and "jugadores" in club:
            for j in club["jugadores"]:
                self.tree_jugadores.insert("", "end", values=(j["id"], j["nombre"], j.get("posicion", ""), j.get("numero", "")))
    
    def agregar_jugador(self):
        if not self.combo_club.get():
            messagebox.showwarning("Seleccionar", "Seleccione un club")
            return
        
        win = tk.Toplevel(self.root)
        win.title("Agregar Jugador")
        win.geometry("350x250")
        
        ttk.Label(win, text="Nombre:").pack(pady=5)
        ent_nombre = ttk.Entry(win, width=30)
        ent_nombre.pack(pady=5)
        
        ttk.Label(win, text="Posición:").pack(pady=5)
        ent_pos = ttk.Entry(win, width=30)
        ent_pos.pack(pady=5)
        
        ttk.Label(win, text="Número:").pack(pady=5)
        ent_num = ttk.Entry(win, width=30)
        ent_num.pack(pady=5)
        
        def guardar():
            club_nombre = self.combo_club.get()
            club = next((c for c in clubes if c["nombre"] == club_nombre), None)
            if club:
                if "jugadores" not in club:
                    club["jugadores"] = []
                club["jugadores"].append({"id": str(len(club["jugadores"]) + 1), "nombre": ent_nombre.get(), "posicion": ent_pos.get(), "numero": ent_num.get()})
                self.cargar_jugadores()
                guardar_datos()
                win.destroy()
        
        ttk.Button(win, text="Guardar", command=guardar).pack(pady=20)
    
    def editar_jugador(self):
        sel = self.tree_jugadores.selection()
        if not sel:
            messagebox.showwarning("Seleccionar", "Seleccione un jugador")
            return
        vals = self.tree_jugadores.item(sel[0])["values"]
        
        win = tk.Toplevel(self.root)
        win.title("Editar Jugador")
        win.geometry("350x250")
        
        ttk.Label(win, text="Nombre:").pack(pady=5)
        ent_nombre = ttk.Entry(win, width=30)
        ent_nombre.insert(0, vals[1])
        ent_nombre.pack(pady=5)
        
        ttk.Label(win, text="Posición:").pack(pady=5)
        ent_pos = ttk.Entry(win, width=30)
        ent_pos.insert(0, vals[2])
        ent_pos.pack(pady=5)
        
        ttk.Label(win, text="Número:").pack(pady=5)
        ent_num = ttk.Entry(win, width=30)
        ent_num.insert(0, vals[3])
        ent_num.pack(pady=5)
        
        def guardar():
            club_nombre = self.combo_club.get()
            club = next((c for c in clubes if c["nombre"] == club_nombre), None)
            if club and "jugadores" in club:
                for j in club["jugadores"]:
                    if j["id"] == vals[0]:
                        j["nombre"] = ent_nombre.get()
                        j["posicion"] = ent_pos.get()
                        j["numero"] = ent_num.get()
                self.cargar_jugadores()
                guardar_datos()
                win.destroy()
        
        ttk.Button(win, text="Guardar", command=guardar).pack(pady=20)
    
    def eliminar_jugador(self):
        sel = self.tree_jugadores.selection()
        if not sel:
            return
        jid = self.tree_jugadores.item(sel[0])["values"][0]
        club_nombre = self.combo_club.get()
        club = next((c for c in clubes if c["nombre"] == club_nombre), None)
        if club and "jugadores" in club:
            club["jugadores"] = [j for j in club["jugadores"] if j["id"] != jid]
            self.cargar_jugadores()
            guardar_datos()
    
    def configurar_tab_partidos(self):
        frame = ttk.LabelFrame(self.tab_partidos, text="Gestión de Partidos")
        frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        cols = ("ID", "Local", "Visitante", "Fecha", "Hora", "Resultado", "Jornada")
        self.tree_partidos = ttk.Treeview(frame, columns=cols, show="headings", height=15)
        for col in cols:
            self.tree_partidos.heading(col, text=col)
        self.tree_partidos.pack(fill="both", expand=True)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=5)
        ttk.Button(btn_frame, text="➕ Programar", command=self.agregar_partido).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="⚽ Resultado", command=self.registrar_resultado).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🔄 Reiniciar", command=self.reiniciar_partido).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🗑️ Eliminar", command=self.eliminar_partido).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🔄 Recargar", command=self.recargar_partidos).pack(side="right", padx=5)
        
        self.recargar_partidos()
    
    def recargar_partidos(self):
        for item in self.tree_partidos.get_children():
            self.tree_partidos.delete(item)
        for p in partidos:
            local = obtener_nombre_club(p["localId"])
            visitante = obtener_nombre_club(p["visitanteId"])
            if p["jugado"]:
                res = f"{p['golesLocal']} - {p['golesVisitante']}"
            else:
                res = "Sin jugar"
            self.tree_partidos.insert("", "end", values=(p["id"], local[:15], visitante[:15], p["fecha"], p["hora"], res, p["jornada"]))
    
    def agregar_partido(self):
        win = tk.Toplevel(self.root)
        win.title("Programar Partido")
        win.geometry("400x400")
        
        ttk.Label(win, text="Club Local:").pack()
        combo_local = ttk.Combobox(win, values=[c["nombre"] for c in clubes], state="readonly")
        combo_local.pack()
        
        ttk.Label(win, text="Club Visitante:").pack()
        combo_vis = ttk.Combobox(win, values=[c["nombre"] for c in clubes], state="readonly")
        combo_vis.pack()
        
        ttk.Label(win, text="Fecha (YYYY-MM-DD):").pack()
        ent_fecha = ttk.Entry(win)
        ent_fecha.insert(0, "2026-05-15")
        ent_fecha.pack()
        
        ttk.Label(win, text="Hora (HH:MM):").pack()
        ent_hora = ttk.Entry(win)
        ent_hora.insert(0, "18:00")
        ent_hora.pack()
        
        ttk.Label(win, text="Jornada:").pack()
        ent_jor = ttk.Entry(win)
        ent_jor.insert(0, "1")
        ent_jor.pack()
        
        def guardar():
            local_club = next((c for c in clubes if c["nombre"] == combo_local.get()), None)
            vis_club = next((c for c in clubes if c["nombre"] == combo_vis.get()), None)
            if local_club and vis_club:
                nuevos_id = str(len(partidos) + 1)
                partidos.append({
                    "id": nuevos_id,
                    "localId": local_club["id"],
                    "visitanteId": vis_club["id"],
                    "fecha": ent_fecha.get(),
                    "hora": ent_hora.get(),
                    "golesLocal": None,
                    "golesVisitante": None,
                    "jugado": False,
                    "jornada": int(ent_jor.get() or 1)
                })
                self.recargar_partidos()
                guardar_datos()
                win.destroy()
        
        ttk.Button(win, text="Guardar", command=guardar).pack(pady=20)
    
    def registrar_resultado(self):
        sel = self.tree_partidos.selection()
        if not sel:
            messagebox.showwarning("Seleccionar", "Seleccione un partido")
            return
        pid = self.tree_partidos.item(sel[0])["values"][0]
        
        win = tk.Toplevel(self.root)
        win.title("Registrar Resultado")
        win.geometry("300x180")
        
        ttk.Label(win, text="Goles Local:").pack()
        ent_gl = ttk.Entry(win)
        ent_gl.pack()
        
        ttk.Label(win, text="Goles Visitante:").pack()
        ent_gv = ttk.Entry(win)
        ent_gv.pack()
        
        def guardar():
            for p in partidos:
                if p["id"] == pid:
                    p["golesLocal"] = int(ent_gl.get() or 0)
                    p["golesVisitante"] = int(ent_gv.get() or 0)
                    p["jugado"] = True
            self.recargar_partidos()
            guardar_datos()
            win.destroy()
        
        ttk.Button(win, text="Guardar", command=guardar).pack(pady=20)
    
    def reiniciar_partido(self):
        sel = self.tree_partidos.selection()
        if not sel:
            return
        pid = self.tree_partidos.item(sel[0])["values"][0]
        for p in partidos:
            if p["id"] == pid:
                p["golesLocal"] = None
                p["golesVisitante"] = None
                p["jugado"] = False
        self.recargar_partidos()
        guardar_datos()
    
    def eliminar_partido(self):
        sel = self.tree_partidos.selection()
        if not sel:
            return
        if messagebox.askyesno("Confirmar", "¿Eliminar partido?"):
            pid = self.tree_partidos.item(sel[0])["values"][0]
            global partidos
            partidos = [p for p in partidos if p["id"] != pid]
            self.recargar_partidos()
            guardar_datos()
    
    def configurar_tab_noticias(self):
        frame = ttk.LabelFrame(self.tab_noticias, text="Gestión de Noticias")
        frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        cols = ("ID", "Título", "Fecha", "Categoría", "Destacada")
        self.tree_noticias = ttk.Treeview(frame, columns=cols, show="headings", height=15)
        for col in cols:
            self.tree_noticias.heading(col, text=col)
        self.tree_noticias.pack(fill="both", expand=True)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=5)
        ttk.Button(btn_frame, text="➕ Agregar", command=self.agregar_noticia).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="✏️ Editar", command=self.editar_noticia).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🗑️ Eliminar", command=self.eliminar_noticia).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🔄 Recargar", command=self.recargar_noticias).pack(side="right", padx=5)
        
        self.recargar_noticias()
    
    def recargar_noticias(self):
        for item in self.tree_noticias.get_children():
            self.tree_noticias.delete(item)
        for n in noticias:
            titulo = n["titulo"][:25] + "..." if len(n["titulo"]) > 25 else n["titulo"]
            self.tree_noticias.insert("", "end", values=(n["id"], titulo, n["fecha"], n.get("categoria", "General"), "Sí" if n.get("destacada") else "No"))
    
    def agregar_noticia(self):
        self.crear_formulario_noticia("Agregar Noticia", None, self.recargar_noticias)
    
    def editar_noticia(self):
        sel = self.tree_noticias.selection()
        if not sel:
            messagebox.showwarning("Seleccionar", "Seleccione una noticia")
            return
        nid = self.tree_noticias.item(sel[0])["values"][0]
        noticia = next((n for n in noticias if n["id"] == nid), None)
        self.crear_formulario_noticia("Editar Noticia", noticia, self.recargar_noticias)
    
    def eliminar_noticia(self):
        sel = self.tree_noticias.selection()
        if not sel:
            return
        if messagebox.askyesno("Confirmar", "¿Eliminar noticia?"):
            nid = self.tree_noticias.item(sel[0])["values"][0]
            global noticias
            noticias = [n for n in noticias if n["id"] != nid]
            self.recargar_noticias()
            guardar_datos()
    
    def crear_formulario_noticia(self, titulo, noticia, callback):
        win = tk.Toplevel(self.root)
        win.title(titulo)
        win.geometry("550x750")
        
        ttk.Label(win, text="Título:").pack(pady=3)
        ent_titulo = ttk.Entry(win, width=50)
        ent_titulo.insert(0, noticia["titulo"] if noticia else "")
        ent_titulo.pack(pady=3)
        
        ttk.Label(win, text="Subtítulo:").pack(pady=3)
        ent_sub = ttk.Entry(win, width=50)
        ent_sub.insert(0, noticia.get("subtitulo", "") if noticia else "")
        ent_sub.pack(pady=3)
        
        ttk.Label(win, text="Contenido:").pack(pady=3)
        txt_contenido = tk.Text(win, width=50, height=4)
        txt_contenido.insert("1.0", noticia.get("contenido", "") if noticia else "")
        txt_contenido.pack(pady=3)
        
        ttk.Label(win, text="Imagen de la noticia:").pack(pady=3)
        ent_img = ttk.Entry(win, width=50)
        ent_img.insert(0, noticia.get("imagenUrl", "") if noticia else "")
        ent_img.pack(pady=3)
        
        lbl_preview = tk.Label(win, text="Vista previa de imagen", bg="#ddd", width=40, height=10)
        lbl_preview.pack(pady=10)
        
        def actualizar_preview():
            url = ent_img.get()
            if url:
                if url.startswith("/images/") and os.path.exists(os.path.join(BASE_DIR, "public", url.lstrip("/"))):
                    try:
                        img_path = os.path.join(BASE_DIR, "public", url.lstrip("/"))
                        img = tk.PhotoImage(file=img_path)
                        img = img.subsample(max(1, max(img.width() // 150, img.height() // 150)))
                        lbl_preview.image = img
                        lbl_preview.config(image=img, text="")
                    except:
                        lbl_preview.config(text="Vista previa", image="")
                elif url.startswith("http"):
                    lbl_preview.config(text="URL externa\n(no se puede previsualizar)")
                else:
                    lbl_preview.config(text="Vista previa")
            else:
                lbl_preview.config(text="Vista previa", image="")
        
        actualizar_preview()
        
        btn_seleccionar = ttk.Button(win, text="📁 Seleccionar imagen de mi PC...", command=lambda: self._seleccionar_y_preview(ent_img, lbl_preview))
        btn_seleccionar.pack(pady=5)
        
        ttk.Label(win, text="Fecha (YYYY-MM-DD):").pack(pady=3)
        ent_fecha = ttk.Entry(win, width=50)
        ent_fecha.insert(0, noticia.get("fecha", "") if noticia else datetime.now().strftime("%Y-%m-%d"))
        ent_fecha.pack(pady=3)
        
        ttk.Label(win, text="Categoría:").pack(pady=3)
        ent_cat = ttk.Entry(win, width=50)
        ent_cat.insert(0, noticia.get("categoria", "General") if noticia else "General")
        ent_cat.pack(pady=3)
        
        var_dest = tk.BooleanVar(value=noticia.get("destacada", False) if noticia else False)
        ttk.Checkbutton(win, text="Noticia Destacada", variable=var_dest).pack(pady=10)
        
        def guardar():
            nuevo = {
                "id": noticia.get("id", str(len(noticias) + 1)) if noticia else str(len(noticias) + 1),
                "titulo": ent_titulo.get(),
                "subtitulo": ent_sub.get(),
                "contenido": txt_contenido.get("1.0", "end-1c"),
                "imagenUrl": ent_img.get(),
                "fecha": ent_fecha.get(),
                "categoria": ent_cat.get(),
                "destacada": var_dest.get(),
            }
            
            if noticia:
                for i, n in enumerate(noticias):
                    if n["id"] == noticia.get("id"):
                        noticias[i] = nuevo
            else:
                noticias.append(nuevo)
            
            callback()
            guardar_datos()
            win.destroy()
        
        ttk.Button(win, text="Guardar", command=guardar).pack(pady=20)
    
    def configurar_tab_estadisticas(self):
        frame = ttk.LabelFrame(self.tab_estadisticas, text="Estadísticas (calculadas automáticamente)")
        frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        cols = ("Club", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS")
        self.tree_estadisticas = ttk.Treeview(frame, columns=cols, show="headings", height=15)
        for col in cols:
            self.tree_estadisticas.heading(col, text=col)
        self.tree_estadisticas.pack(fill="both", expand=True)
        
        ttk.Button(frame, text="🔄 Actualizar estadísticas", command=self.calcular_estadisticas).pack(pady=5)
        
        self.calcular_estadisticas()
    
    def calcular_estadisticas(self):
        for item in self.tree_estadisticas.get_children():
            self.tree_estadisticas.delete(item)
        
        stats = {}
        for c in clubes:
            stats[c["id"]] = {"club": c["nombre"], "pj": 0, "pg": 0, "pe": 0, "pp": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0}
        
        for p in partidos:
            if p.get("jugado") and p.get("golesLocal") is not None and p.get("golesVisitante") is not None:
                stats[p["localId"]]["pj"] += 1
                stats[p["visitanteId"]]["pj"] += 1
                stats[p["localId"]]["gf"] += p["golesLocal"]
                stats[p["localId"]]["gc"] += p["golesVisitante"]
                stats[p["visitanteId"]]["gf"] += p["golesVisitante"]
                stats[p["visitanteId"]]["gc"] += p["golesLocal"]
                
                if p["golesLocal"] > p["golesVisitante"]:
                    stats[p["localId"]]["pg"] += 1
                    stats[p["localId"]]["pts"] += 3
                    stats[p["visitanteId"]]["pp"] += 1
                elif p["golesLocal"] < p["golesVisitante"]:
                    stats[p["visitanteId"]]["pg"] += 1
                    stats[p["visitanteId"]]["pts"] += 3
                    stats[p["localId"]]["pp"] += 1
                else:
                    stats[p["localId"]]["pe"] += 1
                    stats[p["visitanteId"]]["pe"] += 1
                    stats[p["localId"]]["pts"] += 1
                    stats[p["visitanteId"]]["pts"] += 1
        
        for s in stats.values():
            s["dg"] = s["gf"] - s["gc"]
        
        sorted_stats = sorted(stats.values(), key=lambda x: (-x["pts"], -x["dg"], -x["gf"]))
        
        for s in sorted_stats:
            self.tree_estadisticas.insert("", "end", values=(s["club"][:20], s["pj"], s["pg"], s["pe"], s["pp"], s["gf"], s["gc"], s["dg"], s["pts"]))


if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()