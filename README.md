# Boda de Sara y Joshua

Web de la boda · 21 de noviembre de 2026 · Finca Gurugú (Villalbilla, Madrid).

## Archivos

- `index.html`: la web (diseño, animaciones y panel de administración).
- `content.json`: todos los textos, horarios y la lista de fotos. Es lo que edita el panel de administración.
- `images/`: fotos, acuarelas y logo.
- `boda-sara-joshua.ics`: evento de calendario para el botón «Añadir a Apple Calendar» (el panel lo regenera al guardar).

## Panel de administración

Abre la web con `#admin` al final de la dirección (o el enlace «Administración» del pie de página).

1. Crea un token en <https://github.com/settings/personal-access-tokens/new>: acceso solo a este repositorio y permiso **Contents: Read and write**.
2. Pégalo en el panel. Se guarda solo en tu navegador.
3. Cambia lo que quieras y pulsa **Guardar y publicar**. El panel hace los cambios directamente en este repositorio y GitHub Pages actualiza la web en uno o dos minutos.

## Publicar con GitHub Pages

Settings → Pages → Deploy from a branch → rama `main`, carpeta `/ (root)`.
