# Pinares Frontend

Página web simple para gestionar el sistema de alojamiento Pinares.

## Características

- 🏠 Vista de casas divididas en interiores y exteriores
- 🎨 Estados visuales: Verde (limpia), Rojo (sucia), Amarillo (ocupada)
- 🔐 Autenticación con JWT
- 🔄 Actualización automática cada 30 segundos
- 📱 Diseño responsive
- ✨ Interfaz moderna con gradientes y animaciones

## Configuración

1. **Configurar URL del backend**:
   - Abre `script.js`
   - Cambia `API_BASE_URL` por la URL de tu backend en producción

2. **Despliegue en GitHub Pages**:
   - Sube esta carpeta a un repositorio de GitHub
   - Ve a Settings > Pages
   - Selecciona la rama `main` y carpeta `/Pagina`
   - La página estará disponible en `https://[username].github.io/[repo]/`

## Uso

1. Abre la página web
2. Ingresa tu código de acceso
3. Verás las casas divididas en:
   - **Casas Interiores**: Cabañas y departamentos internos
   - **Casas Exteriores**: Cabañas y departamentos externos

4. Los colores indican:
   - 🟢 **Verde**: Casa limpia
   - 🔴 **Rojo**: Casa sucia
   - 🟡 **Amarillo**: Casa ocupada

5. Si tienes permisos, puedes hacer clic en una casa para cambiar su estado

## Estructura de Archivos

```
Pagina/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos CSS con diseño moderno
├── script.js       # Lógica JavaScript
└── README.md       # Este archivo
```

## Tecnologías

- HTML5 semántico
- CSS3 con Grid y Flexbox
- JavaScript vanilla (ES6+)
- Fetch API para comunicación con el backend
- Diseño responsive
- Google Fonts (Inter)

## Notas

- La página se conecta al backend mediante REST API
- Requiere que el backend esté corriendo y accesible
- Los tokens de autenticación se guardan en localStorage
- La página se actualiza automáticamente cada 30 segundos
