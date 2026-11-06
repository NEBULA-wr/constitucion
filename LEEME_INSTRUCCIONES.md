# CONSTITUCIÓN DE LA REPÚBLICA DOMINICANA — EXPERIENCIA DIGITAL INTERACTIVA

¡Bienvenido al proyecto oficial de la Constitución Dominicana en versión digital, cinematográfica e interactiva!

Este archivo ZIP contiene la **totalidad del proyecto**:
1. **Código fuente completo** (Frontend React 19 + TypeScript + Tailwind CSS v4 + Motion + Lucide Icons + Three.js + Backend Express).
2. **Archivos multimedia físicos exactos y definidos**:
   - **3 Videos Cinematográficos** (`1.mp4`, `2.mp4`, `3.mp4`):
     - `1.mp4`: Portada Cinematográfica y Monumento al Atardecer.
     - `2.mp4`: Palacio Nacional de la República Dominicana y Maqueta 3D de los Poderes del Estado.
     - `3.mp4`: Tribunal Constitucional y Arena del Rompecabezas.
   - **5 Imágenes Patrimoniales Enumeradas del 1 al 5** (`1.png`, `2.png`, `3.png`, `4.png`, `5.png`):
     - `1.png`: Palacio Nacional de la República Dominicana.
     - `2.png`: Congreso Nacional (Senado y Cámara de Diputados).
     - `3.png`: Suprema Corte de Justicia y Tribunal Constitucional.
     - `4.png`: Constitución de San Cristóbal de 1844 (Manuscrito Original).
     - `5.png`: Reforma Constitucional 2024 (Blindaje Pétreo).
   - **Audio Oficial** (`1.mp3` / `audio 1.mp3`):
     - `1.mp3`: Tema Épico e Himno Constitucional Dominicano.
   - `public/media/manifest.json`: Manifiesto completo que preserva rutas, asignaciones y metadatos.
3. **Rompecabezas Constitucional Oficial**:
   - Mini-juego interactivo con las 5 imágenes patrias (1.png a 5.png).
   - Selector de cuadrícula (Fácil 3×3, Medio 4×4, Experto 5×5).
   - Mecánica de clic o arrastre de fichas, contador de movimientos, cronómetro y números guía.

---

## 🚀 CÓMO EJECUTAR EL PROYECTO EN CUALQUIER COMPUTADORA

### Requisitos previos
- **Node.js**: Versión 18 o superior (recomendado Node.js 20 o 22 LTS). Puedes descargarlo gratis desde [nodejs.org](https://nodejs.org).
- **Navegador moderno**: Chrome, Edge, Safari, Firefox o Brave.

### Paso a paso:
1. **Descomprimir** este archivo ZIP en una carpeta de tu preferencia.
2. Abrir la terminal / consola de comandos en esa carpeta:
   - En Windows: Clic derecho dentro de la carpeta > *Abrir en Terminal* (o escribir `cmd` en la barra de direcciones del explorador).
   - En Mac/Linux: Abrir Terminal y escribir `cd /ruta/de/la/carpeta`.
3. Instalar las dependencias ejecutando:
   ```bash
   npm install
   ```
4. Iniciar el servidor local ejecutando:
   ```bash
   npm run dev
   ```
5. Abrir en tu navegador:
   ```
   http://localhost:3000
   ```

---

## 📁 ESTRUCTURA DE RECURSOS

```
public/
  1.mp4                     <- Video 1: Portada Hero
  2.mp4                     <- Video 2: Poderes y Maqueta 3D
  3.mp4                     <- Video 3: Rompecabezas y Arena
  1.png                     <- Imagen 1: Palacio Nacional
  2.png                     <- Imagen 2: Congreso Nacional
  3.png                     <- Imagen 3: Tribunal Constitucional
  4.png                     <- Imagen 4: Constitución San Cristóbal 1844
  5.png                     <- Imagen 5: Reforma 2024
  1.mp3                     <- Audio 1: Tema Constitucional Dominicano
  audio 1.mp3               <- Alias del Audio 1
  media/
    manifest.json           <- Registro central de recursos
    videos/ (1.mp4, 2.mp4, 3.mp4)
    images/ (1.png a 5.png)
    audio/ (1.mp3)
```

---

## 🛠️ CARACTERÍSTICAS
- **3 Videos fluidos y responsivos**: Reproducción automática en bucle con texto legible y botón de maximizar video.
- **5 Imágenes oficiales en Rompecabezas y Galería**: Reconstruye la patria ficha por ficha.
- **Audio 1.mp3 con un clic**: Botón en la barra superior para activar o pausar la música en cualquier momento.
- **Libro 3D y Maqueta 3D interactiva**: Modelos tridimensionales con iluminación cinematográfica.
- **Exportación ZIP integrada**: Descarga todo el paquete listo para compartir o almacenar.
