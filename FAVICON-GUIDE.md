# 🎯 Guía para Generar Favicons

Para completar el setup de favicons de tu portfolio, necesitas generar los siguientes archivos de iconos:

## 📁 Archivos de Favicon Necesarios

Coloca estos archivos en la carpeta raíz de tu proyecto:

### 🖼️ Iconos Requeridos:
- `favicon.ico` (16x16, 32x32, 48x48)
- `favicon-16x16.png` (16x16 píxeles)
- `favicon-32x32.png` (32x32 píxeles)
- `apple-touch-icon.png` (180x180 píxeles)
- `android-chrome-192x192.png` (192x192 píxeles)
- `android-chrome-512x512.png` (512x512 píxeles)

## 🚀 Cómo Generar los Favicons

### Opción 1: Generador Online (Recomendado)
1. Ve a **https://favicon.io/** o **https://realfavicongenerator.net/**
2. Sube tu logo/imagen (recomendado: 512x512px mínimo)
3. Personaliza colores y configuraciones
4. Descarga el paquete completo
5. Extrae todos los archivos en la carpeta raíz del proyecto

### Opción 2: Crear Manualmente
Si tienes tu logo en formato vectorial (SVG) o alta resolución:

1. **Imagen base**: 512x512px, fondo transparente
2. **Colores**: Usa tu paleta de marca (#0099ff para el tema)
3. **Software**: Figma, Photoshop, GIMP, o Canva

### Opción 3: Usar Iniciales
Crea un favicon con tus iniciales "ME" (Maxim Esteban):
- Fondo: Negro (#000000) o azul (#0099ff)
- Texto: "ME" en blanco
- Fuente: Inter (mismo que el portfolio)

## 🎨 Recomendaciones de Diseño

### Para tu Portfolio:
- **Colores**: Negro/azul (#0099ff) con blanco
- **Estilo**: Minimalista, consistente con tu marca
- **Contenido**: Logo personal, iniciales "M" o "ME", o símbolo único

### Ejemplos de Ideas:
1. **Iniciales**: "M" o "ME" estilizadas
2. **Símbolo**: Combinación de elementos de marketing/desarrollo
3. **Logo**: Si tienes marca personal definida

## ✅ Verificación

Una vez agregados los archivos, verifica:
1. Todos los archivos están en la carpeta raíz
2. Los nombres coinciden exactamente con los del HTML
3. El favicon aparece en la pestaña del navegador
4. Funciona en móvil (apple-touch-icon)

## 🔧 Theme Color

El `theme-color` está configurado como `#0099ff` (tu color primario).
Puedes cambiarlo en:
- `index.html` línea del meta theme-color
- `site.webmanifest` en theme_color

¡Una vez tengas los archivos de favicon, tu portfolio tendrá una identidad visual completa!