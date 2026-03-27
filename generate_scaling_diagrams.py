import os
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

output_dir = os.path.join(os.getcwd(), 'DOCUMENTACION')
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'Helvetica']
plt.rcParams['font.family'] = 'sans-serif'

# ============================================================
# Color Palette
# ============================================================
C_DARK = '#1a1a2e'
C_PRIMARY = '#16213e'
C_ACCENT = '#0f3460'
C_HIGHLIGHT = '#e94560'
C_SUCCESS = '#27ae60'
C_WARNING = '#f39c12'
C_INFO = '#2980b9'
C_NGINX = '#009639'
C_DOCKER = '#2496ED'
C_NODE = '#689F63'
C_MONGO = '#47A248'
C_LIGHT_BG = '#f8f9fa'
C_WHITE = '#ffffff'
C_GRAY = '#95a5a6'
C_ORANGE = '#e67e22'

def styled_box(ax, x, y, w, h, text, color, text_color='white', fontsize=10, alpha=1.0, style='round,pad=0.02', lw=2, edge_color=None):
    """Draw a styled rounded box with centered text."""
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle=style, facecolor=color, edgecolor=edge_color or color, linewidth=lw, alpha=alpha, zorder=2)
    ax.add_patch(box)
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize, color=text_color, weight='bold', zorder=3, wrap=True)
    return box

def draw_arrow(ax, x1, y1, x2, y2, color='gray', style='->', lw=2, ls='-'):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle=style, lw=lw, color=color, linestyle=ls, connectionstyle="arc3,rad=0.0"), zorder=1)

def draw_curved_arrow(ax, x1, y1, x2, y2, color='gray', rad=0.2, lw=2):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', lw=lw, color=color, connectionstyle=f"arc3,rad={rad}"), zorder=1)

# ============================================================
# 1. FLOWCHART: Proceso Paso a Paso del Escalamiento
# ============================================================
def diagram_scaling_flowchart():
    fig, ax = plt.subplots(figsize=(10, 14))
    ax.set_xlim(-1, 11)
    ax.set_ylim(-1, 15)
    ax.axis('off')
    fig.patch.set_facecolor(C_LIGHT_BG)

    steps = [
        ("INICIO\nAnálisis del Servicio\nMás Crítico", C_HIGHLIGHT, 13.5),
        ("PASO 1\nRefactorizar a\nStateless (Sin Estado)", C_INFO, 11.5),
        ("PASO 2\nAgregar Health Check\n(/health endpoint)", C_NODE, 9.5),
        ("PASO 3\nAgregar Graceful\nShutdown (SIGTERM)", C_ACCENT, 7.5),
        ("PASO 4\nConfigurar Load\nBalancer (Nginx)", C_NGINX, 5.5),
        ("PASO 5\nModificar Docker\nCompose (Quitar Puertos)", C_DOCKER, 3.5),
        ("PASO 6\nEscalar Réplicas\n--scale api=3", C_WARNING, 1.5),
        ("✅ ESCALAMIENTO\nHORIZONTAL COMPLETO", C_SUCCESS, -0.3),
    ]

    for text, color, y in steps:
        styled_box(ax, 5, y, 5.5, 1.5, text, color, fontsize=11)

    for i in range(len(steps) - 1):
        draw_arrow(ax, 5, steps[i][2] - 0.8, 5, steps[i+1][2] + 0.8, color='#555555', lw=3)

    # Side annotations
    annotations = [
        (11, 11.5, "process.env.PORT\nNo variables globales", C_INFO),
        (11, 9.5, "app.get('/health',\n(req,res) => ...)", C_NODE),
        (11, 7.5, "process.on(\n'SIGTERM', ...)", C_ACCENT),
        (11, 5.5, "upstream backend {\n  server api:4001;\n}", C_NGINX),
        (11, 3.5, "Eliminar:\ncontainer_name\nports: '4001:4001'", C_DOCKER),
    ]

    for x, y, text, color in annotations:
        ax.text(x, y, text, ha='center', va='center', fontsize=8, color=color,
                style='italic', family='monospace',
                bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor=color, lw=1.5, alpha=0.9))
        draw_arrow(ax, 7.8, y, 9.2, y, color=color, lw=1.5, ls='--')

    plt.title("Flujo Paso a Paso del Escalamiento Horizontal",
              fontsize=18, weight='bold', color=C_PRIMARY, pad=20)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'diagrama_flujo_escalamiento.png'), dpi=200, bbox_inches='tight', facecolor=C_LIGHT_BG)
    plt.close()
    print("✅ Diagrama 1: Flujo de Escalamiento generado")

# ============================================================
# 2. BEFORE vs AFTER Architecture
# ============================================================
def diagram_before_after():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
    fig.patch.set_facecolor(C_LIGHT_BG)

    # --- BEFORE ---
    ax1.set_xlim(-1, 11)
    ax1.set_ylim(-1, 11)
    ax1.axis('off')
    ax1.set_title("❌ ANTES: Arquitectura Simple\n(Sin Escalamiento)", fontsize=14, weight='bold', color=C_HIGHLIGHT, pad=15)

    styled_box(ax1, 5, 9.5, 6, 1.2, "👤 Cliente / Postman / React", C_ORANGE, fontsize=11)
    styled_box(ax1, 5, 7, 6, 1.2, "🌐 Puerto 4001 (Directo)", '#7f8c8d', fontsize=11)
    styled_box(ax1, 5, 4.5, 6, 1.5, "📦 api-proyectos\n(1 SOLA Instancia)", C_HIGHLIGHT, fontsize=12)
    styled_box(ax1, 5, 1.5, 6, 1.2, "🗄️ MongoDB Atlas (Nube)", C_MONGO, fontsize=11)

    draw_arrow(ax1, 5, 8.8, 5, 7.7, color='#555', lw=3)
    draw_arrow(ax1, 5, 6.3, 5, 5.4, color='#555', lw=3)
    draw_arrow(ax1, 5, 3.7, 5, 2.2, color='#555', lw=3)

    ax1.text(5, 0, "⚠️ Punto Único de Falla\nSi cae, cae TODO", ha='center', va='center',
             fontsize=12, color=C_HIGHLIGHT, weight='bold',
             bbox=dict(boxstyle='round,pad=0.5', facecolor='#ffeaea', edgecolor=C_HIGHLIGHT, lw=2))

    # --- AFTER ---
    ax2.set_xlim(-1, 11)
    ax2.set_ylim(-1, 11)
    ax2.axis('off')
    ax2.set_title("✅ DESPUÉS: Escalamiento Horizontal\n(Con Nginx + 3 Réplicas)", fontsize=14, weight='bold', color=C_SUCCESS, pad=15)

    styled_box(ax2, 5, 9.5, 6, 1.2, "👤 Cliente / Postman / React", C_ORANGE, fontsize=11)
    styled_box(ax2, 5, 7, 6, 1.2, "⚖️ Nginx Load Balancer\n(Puerto 4001 → Round Robin)", C_NGINX, fontsize=10)

    # 3 replicas
    replica_positions = [(1.5, 4.2), (5, 4.2), (8.5, 4.2)]
    for i, (rx, ry) in enumerate(replica_positions):
        styled_box(ax2, rx, ry, 2.8, 1.5, f"📦 Réplica {i+1}\napi-proyectos\nPID: {18+i}", C_DOCKER, fontsize=9)
        draw_arrow(ax2, 5, 6.3, rx, 5.0, color=C_NGINX, lw=2)
        draw_arrow(ax2, rx, 3.4, 5, 2.2, color=C_MONGO, lw=1.5, ls='--')

    styled_box(ax2, 5, 1.2, 6, 1.2, "🗄️ MongoDB Atlas (Nube)", C_MONGO, fontsize=11)

    draw_arrow(ax2, 5, 8.8, 5, 7.7, color='#555', lw=3)

    ax2.text(5, -0.3, "✅ Alta Disponibilidad\nSi cae 1, las otras 2 siguen vivas", ha='center', va='center',
             fontsize=12, color=C_SUCCESS, weight='bold',
             bbox=dict(boxstyle='round,pad=0.5', facecolor='#eafaf1', edgecolor=C_SUCCESS, lw=2))

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'diagrama_antes_despues.png'), dpi=200, bbox_inches='tight', facecolor=C_LIGHT_BG)
    plt.close()
    print("✅ Diagrama 2: Antes vs Después generado")

# ============================================================
# 3. Docker Topology Diagram
# ============================================================
def diagram_docker_topology():
    fig, ax = plt.subplots(figsize=(14, 9))
    ax.set_xlim(-1, 15)
    ax.set_ylim(-1, 11)
    ax.axis('off')
    fig.patch.set_facecolor(C_LIGHT_BG)

    # Host Machine border
    host_box = FancyBboxPatch((0, 0.5), 14, 9.5, boxstyle="round,pad=0.3",
                              facecolor='#eef2f7', edgecolor='#34495e', linewidth=3, linestyle='--', zorder=0)
    ax.add_patch(host_box)
    ax.text(7, 10.3, "🖥️  MÁQUINA HOST (Tu PC / Servidor)", ha='center', fontsize=14, weight='bold', color='#34495e')

    # Docker Network border
    net_box = FancyBboxPatch((0.5, 1), 13, 7.5, boxstyle="round,pad=0.2",
                             facecolor='#e8f4fd', edgecolor=C_DOCKER, linewidth=2, linestyle=':', zorder=0)
    ax.add_patch(net_box)
    ax.text(7, 8.8, "🐳  Red Docker: iudigital_net (bridge)", ha='center', fontsize=11, weight='bold', color=C_DOCKER)

    # API Core
    styled_box(ax, 2.5, 7, 3.5, 1.3, "📦 api-core\nPuerto 4000\n(Monolito)", C_ACCENT, fontsize=9)

    # Nginx
    styled_box(ax, 7, 7, 3.5, 1.3, "⚖️ Nginx\nLoad Balancer\nPuerto 80 → 4001", C_NGINX, fontsize=9)

    # Replicas
    for i, x in enumerate([3, 7, 11]):
        styled_box(ax, x, 4, 3.2, 1.3, f"📦 api-proyectos-{i+1}\nPuerto interno 4001\nNode.js + Express", C_DOCKER, fontsize=8)
        draw_arrow(ax, 7, 6.3, x, 4.75, color=C_NGINX, lw=2)

    # MongoDB Atlas (outside host)
    styled_box(ax, 7, 1.8, 5, 1, "☁️ MongoDB Atlas (Cloud)\nmongodb+srv://cluster0.qgt2hux...", C_MONGO, fontsize=9)

    for x in [3, 7, 11]:
        draw_arrow(ax, x, 3.3, 7, 2.4, color=C_MONGO, lw=1.5, ls='--')

    # External traffic arrow
    ax.annotate("🌍 Tráfico\nExterno", xy=(7, 7.75), xytext=(7, 10.7),
                ha='center', va='center', fontsize=10, color=C_HIGHLIGHT, weight='bold',
                arrowprops=dict(arrowstyle='->', lw=3, color=C_HIGHLIGHT))

    # Port labels
    ax.text(13.3, 7, "→ :4001", fontsize=9, color=C_NGINX, weight='bold', va='center')
    ax.text(0.7, 7, "→ :4000", fontsize=9, color=C_ACCENT, weight='bold', va='center',ha='right')

    plt.title("Topología Completa de Contenedores Docker con Balanceo de Carga",
              fontsize=16, weight='bold', color=C_PRIMARY, pad=25)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'diagrama_topologia_docker.png'), dpi=200, bbox_inches='tight', facecolor=C_LIGHT_BG)
    plt.close()
    print("✅ Diagrama 3: Topología Docker generado")

# ============================================================
# 4. Round Robin Flow
# ============================================================
def diagram_round_robin():
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(-1, 13)
    ax.set_ylim(-1, 9)
    ax.axis('off')
    fig.patch.set_facecolor(C_LIGHT_BG)

    # Peticiones
    peticiones = [
        (0.8, 7.5, "Petición 1", '#e74c3c'),
        (0.8, 6, "Petición 2", '#3498db'),
        (0.8, 4.5, "Petición 3", '#2ecc71'),
        (0.8, 3, "Petición 4", '#9b59b6'),
        (0.8, 1.5, "Petición 5", '#e67e22'),
    ]

    for x, y, text, color in peticiones:
        styled_box(ax, x, y, 2, 0.8, text, color, fontsize=9)

    # Nginx
    styled_box(ax, 5, 4.5, 2.5, 5, "", C_NGINX, alpha=0.15, edge_color=C_NGINX, text_color=C_NGINX)
    ax.text(5, 7.5, "⚖️", ha='center', va='center', fontsize=28)
    ax.text(5, 6.5, "NGINX", ha='center', va='center', fontsize=13, weight='bold', color=C_NGINX)
    ax.text(5, 5.7, "Round\nRobin", ha='center', va='center', fontsize=11, color=C_NGINX, style='italic')

    # Replicas
    replicas = [
        (10, 7, "📦 Réplica 1\napi-proyectos", C_DOCKER),
        (10, 4.5, "📦 Réplica 2\napi-proyectos", '#1a75bc'),
        (10, 2, "📦 Réplica 3\napi-proyectos", '#0d5f99'),
    ]

    for x, y, text, color in replicas:
        styled_box(ax, x, y, 3.5, 1.3, text, color, fontsize=10)

    # Arrows from peticiones to nginx
    for _, y, _, color in peticiones:
        draw_arrow(ax, 1.9, y, 3.7, 4.5, color=color, lw=1.5)

    # Arrows from nginx to replicas (Round Robin distribution)
    assignments = [
        (peticiones[0][3], replicas[0]),   # Pet 1 → Replica 1
        (peticiones[1][3], replicas[1]),   # Pet 2 → Replica 2
        (peticiones[2][3], replicas[2]),   # Pet 3 → Replica 3
        (peticiones[3][3], replicas[0]),   # Pet 4 → Replica 1 (vuelve)
        (peticiones[4][3], replicas[1]),   # Pet 5 → Replica 2 (vuelve)
    ]

    for color, (rx, ry, _, _) in assignments:
        draw_arrow(ax, 6.3, 4.5, 8.2, ry, color=color, lw=2)

    # Legend
    ax.text(5, 1.2, "Cada petición nueva se\nenvía a la siguiente réplica\nen turno (1→2→3→1→2...)",
            ha='center', va='center', fontsize=10, color='#555', style='italic',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='white', edgecolor='#ddd', lw=1.5))

    plt.title("Distribución de Tráfico con Algoritmo Round-Robin (Nginx)",
              fontsize=16, weight='bold', color=C_PRIMARY, pad=20)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'diagrama_round_robin.png'), dpi=200, bbox_inches='tight', facecolor=C_LIGHT_BG)
    plt.close()
    print("✅ Diagrama 4: Round-Robin generado")

# ============================================================
# 5. Health Check & Graceful Shutdown Lifecycle
# ============================================================
def diagram_health_lifecycle():
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.set_xlim(-1, 15)
    ax.set_ylim(-1, 8)
    ax.axis('off')
    fig.patch.set_facecolor(C_LIGHT_BG)

    # Health Check flow (top)
    ax.text(7, 7.3, "🔍 HEALTH CHECK — Monitoreo Continuo del Estado de las Réplicas",
            ha='center', fontsize=13, weight='bold', color=C_INFO)

    hc_steps = [
        (1.5, 5.5, "⚖️ Nginx\nenvía GET\n/health", C_NGINX),
        (5.5, 5.5, "📦 Réplica\nresponde\n{status:'OK'}", C_DOCKER),
        (9.5, 5.5, "✅ Nginx\nla mantiene\nen el pool", C_SUCCESS),
    ]
    for x, y, text, color in hc_steps:
        styled_box(ax, x, y, 3, 1.5, text, color, fontsize=9)

    draw_arrow(ax, 3.1, 5.5, 3.9, 5.5, color='#555', lw=3)
    draw_arrow(ax, 7.1, 5.5, 7.9, 5.5, color='#555', lw=3)

    # Failure scenario
    styled_box(ax, 13, 5.5, 2.5, 1.5, "❌ Sin\nRespuesta\n→ Retirada", C_HIGHLIGHT, fontsize=9)
    draw_curved_arrow(ax, 7, 4.7, 11.7, 5, color=C_HIGHLIGHT, lw=2, rad=-0.3)
    ax.text(9.5, 4.2, "Si falla →", fontsize=9, color=C_HIGHLIGHT, weight='bold')

    # Divider
    ax.plot([0, 14.5], [3.5, 3.5], color='#bbb', lw=1.5, ls='--')

    # Graceful shutdown flow (bottom)
    ax.text(7, 3, "🛑 GRACEFUL SHUTDOWN — Apagado Seguro Ante Señal SIGTERM",
            ha='center', fontsize=13, weight='bold', color=C_ACCENT)

    gs_steps = [
        (1.5, 1.3, "🐳 Docker\nenvía señal\nSIGTERM", '#7f8c8d'),
        (5.5, 1.3, "🛑 Node.js\ncaptura SIGTERM\nserver.close()", C_ACCENT),
        (9.5, 1.3, "⏳ Termina\npeticiones\nen vuelo", C_WARNING),
        (13, 1.3, "✅ process\n.exit(0)\n(Limpio)", C_SUCCESS),
    ]
    for x, y, text, color in gs_steps:
        styled_box(ax, x, y, 2.8, 1.4, text, color, fontsize=9)

    for i in range(len(gs_steps) - 1):
        draw_arrow(ax, gs_steps[i][0] + 1.5, 1.3, gs_steps[i+1][0] - 1.5, 1.3, color='#555', lw=3)

    plt.title("Ciclo de Vida: Health Check y Graceful Shutdown",
              fontsize=16, weight='bold', color=C_PRIMARY, pad=20)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'diagrama_health_shutdown.png'), dpi=200, bbox_inches='tight', facecolor=C_LIGHT_BG)
    plt.close()
    print("✅ Diagrama 5: Health Check & Graceful Shutdown generado")


# ============================================================
# RUN ALL
# ============================================================
if __name__ == '__main__':
    diagram_scaling_flowchart()
    diagram_before_after()
    diagram_docker_topology()
    diagram_round_robin()
    diagram_health_lifecycle()
    print("\n🎉 ¡Todos los diagramas generados exitosamente en la carpeta DOCUMENTACION!")
