# Blog Trader Web

Este proyecto es un blog diseñado para Enmanuel Díaz, conocido profesionalmente como **Tu Esposo Trader**. Los visitantes pueden conocer más sobre él, ver fotos y videos, y acceder a sus redes sociales y grupos de Telegram. La página está estilizada con un diseño moderno y animaciones limpias.

## Estructura del Proyecto

- **.editorconfig**: Configuraciones de estilo de código para editores de texto.
- **.gitignore**: Archivos y directorios que deben ser ignorados por Git.
- **README.md**: Documentación del proyecto.
- **package.json**: Configuración de npm, incluyendo dependencias y scripts.
- **public/robots.txt**: Instrucciones para motores de búsqueda sobre la indexación de páginas.
- **src/components/**: Contiene los componentes HTML del blog.
  - **about.html**: Información sobre el cliente.
  - **footer.html**: Pie de página del sitio.
  - **header.html**: Encabezado del sitio.
  - **hero.html**: Sección principal de bienvenida.
  - **media-gallery.html**: Galería de fotos y videos.
  - **social-links.html**: Enlaces a redes sociales y grupos de Telegram.
- **src/data/social-links.json**: Almacena los enlaces a redes sociales y grupos de Telegram.
- **src/index.html**: Página principal que integra todos los componentes.
- **src/scripts/**: Contiene los scripts JavaScript del sitio.
  - **main.js**: Lógica principal del sitio.
  - **ui-effects.js**: Animaciones y efectos de interfaz de usuario.
- **src/styles/**: Contiene los estilos CSS del sitio.
  - **animations.css**: Definición de animaciones.
  - **base.css**: Estilos básicos y globales.
  - **layout.css**: Diseño y estructura del sitio.
- **src/assets/**: Contiene fotos y videos utilizados en el blog.
  - **photos/**: Fotos del cliente.
  - **videos/**: Videos del cliente.
- **vite.config.js**: Configuración para Vite, herramienta de construcción y desarrollo.

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd blog-trader-web
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar el servidor de desarrollo, ejecuta:
```
npm run dev
```

Abre tu navegador y visita `http://localhost:3000` para ver el blog en acción.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.