import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
import shutil
from datetime import datetime
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "src", "data.json")
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")

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

def cargar_datos():
    global clubes, partidos, noticias
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            clubes = data.get("clubes", clubes_iniciales.copy())
            partidos = data.get("partidos", [])
            noticias = data.get("noticias", [])
    else:
        clubes = clubes_iniciales.copy()

def guardar_datos():
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump({"clubes": clubes, "partidos": partidos, "noticias": noticias}, f, indent=2)

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("CCM ADMIN - Gestion de Liga")
        self.root.geometry("1000x600")
        
        if not os.path.exists(IMAGES_DIR):
            os.makedirs(IMAGES_DIR)
        
        cargar_datos()
        
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.tab_clubes = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_clubes, text="CLUBES")
        
        self.configurar_clubes()
        
        btn_frame = ttk.Frame(root)
        btn_frame.pack(fill="x", padx=10, pady=5)
        
        ttk.Button(btn_frame, text="GUARDAR Y HACER PUSH", command=self.git_push).pack(side="right", padx=5)
    
    def git_push(self):
        guardar_datos()
        try:
            subprocess.run(["git", "add", "src/data.json", "public/images"], check=True, capture_output=True)
            subprocess.run(["git", "commit", "-m", "Actualizacion de datos"], check=True, capture_output=True)
            subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)
            messagebox.showinfo("OK", "Cambios subidos a GitHub")
        except Exception as e:
            messagebox.showerror("Error", str(e))
    
    def configurar_clubes(self):
        frame = ttk.Frame(self.tab_clubes)
        frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        cols = ("ID", "Nombre", "Logo")
        self.tree = ttk.Treeview(frame, columns=cols, show="headings")
        for col in cols:
            self.tree.heading(col, text=col)
        self.tree.pack(fill="both", expand=True)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=10)
        
        ttk.Button(btn_frame, text="AGREGAR", command=self.ventana_agregar).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="EDITAR", command=self.ventana_editar).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="ELIMINAR", command=self.eliminar_club).pack(side="left", padx=5)
        
        self.recargar()
    
    def recargar(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        for c in clubes:
            self.tree.insert("", "end", values=(c["id"], c["nombre"], c.get("logoUrl", "")[:30]))
    
    def ventana_agregar(self):
        v = tk.Toplevel(self.root)
        v.title("AGREGAR CLUB")
        v.geometry("400x300")
        
        tk.Label(v, text="NOMBRE:", font=("Arial", 14)).pack(pady=10)
        nombre_entry = tk.Entry(v, font=("Arial", 14), width=30)
        nombre_entry.pack(pady=5)
        
        tk.Label(v, text="LOGO (URL o archivo):", font=("Arial", 14)).pack(pady=10)
        logo_entry = tk.Entry(v, font=("Arial", 12), width=30)
        logo_entry.pack(pady=5)
        
        def seleccionar():
            ruta = filedialog.askopenfilename(filetypes=[("Imagenes", "*.png *.jpg *.jpeg")])
            if ruta:
                nombre = os.path.basename(ruta)
                destino = os.path.join(IMAGES_DIR, nombre)
                shutil.copy(ruta, destino)
                logo_entry.delete(0, "end")
                logo_entry.insert(0, "/images/" + nombre)
                messagebox.showinfo("OK", f"Imagen guardada: {nombre}")
        
        tk.Button(v, text="SELECCIONAR IMAGEN DE PC", bg="blue", fg="white", font=("Arial", 12), command=seleccionar).pack(pady=10)
        
        def guardar():
            if nombre_entry.get():
                clubes.append({
                    "id": str(len(clubes) + 1),
                    "nombre": nombre_entry.get(),
                    "logoUrl": logo_entry.get() or "https://via.placeholder.com/64?text=CCM",
                    "jugadores": []
                })
                self.recargar()
                guardar_datos()
                v.destroy()
        
        tk.Button(v, text="GUARDAR", bg="green", fg="white", font=("Arial", 14), command=guardar).pack(pady=20)
    
    def ventana_editar(self):
        sel = self.tree.selection()
        if not sel:
            messagebox.showwarning("ATENCION", "Selecciona un club")
            return
        
        idx = self.tree.item(sel[0])["values"][0]
        club = next((c for c in clubes if c["id"] == idx), None)
        
        v = tk.Toplevel(self.root)
        v.title("EDITAR CLUB")
        v.geometry("450x400")
        
        tk.Label(v, text="NOMBRE:", font=("Arial", 14)).pack(pady=10)
        nombre_entry = tk.Entry(v, font=("Arial", 14), width=30)
        nombre_entry.insert(0, club["nombre"])
        nombre_entry.pack(pady=5)
        
        tk.Label(v, text="LOGO (URL o archivo):", font=("Arial", 14)).pack(pady=10)
        logo_entry = tk.Entry(v, font=("Arial", 12), width=30)
        logo_entry.insert(0, club.get("logoUrl", ""))
        logo_entry.pack(pady=5)
        
        def seleccionar():
            ruta = filedialog.askopenfilename(filetypes=[("Imagenes", "*.png *.jpg *.jpeg")])
            if ruta:
                nombre = os.path.basename(ruta)
                destino = os.path.join(IMAGES_DIR, nombre)
                shutil.copy(ruta, destino)
                logo_entry.delete(0, "end")
                logo_entry.insert(0, "/images/" + nombre)
                messagebox.showinfo("OK", f"Imagen guardada: {nombre}")
        
        tk.Button(v, text="SUBIR IMAGEN DESDE MI PC", bg="blue", fg="white", font=("Arial", 12), command=seleccionar).pack(pady=15)
        
        def guardar():
            club["nombre"] = nombre_entry.get()
            club["logoUrl"] = logo_entry.get()
            self.recargar()
            guardar_datos()
            v.destroy()
        
        tk.Button(v, text="GUARDAR CAMBIOS", bg="green", fg="white", font=("Arial", 14), command=guardar).pack(pady=20)
    
    def eliminar_club(self):
        sel = self.tree.selection()
        if sel and messagebox.askyesno("CONFIRMAR", "Eliminar club?"):
            idx = self.tree.item(sel[0])["values"][0]
            global clubes
            clubes = [c for c in clubes if c["id"] != idx]
            self.recargar()
            guardar_datos()

if __name__ == "__main__":
    root = tk.Tk()
    App(root)
    root.mainloop()