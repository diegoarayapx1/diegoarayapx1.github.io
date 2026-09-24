# Sitio de pruebas NFC / QR

Páginas de prueba para grabar en tarjetas NFC y QR mientras no exista el dominio propio.

| Página | URL |
|---|---|
| Links del local | https://diegoarayapx1.github.io/demo/ |
| Datos para transferir | https://diegoarayapx1.github.io/demo/pago/ |

## Publicar (se hace una vez)

1. En GitHub: **New repository** → nombre exacto `diegoarayapx1.github.io` → **Public** → Create.
2. En el repo vacío: **uploading an existing file** → arrastra el *contenido* de esta carpeta
   (`index.html`, `README.md`, `assets`, `demo`), no la carpeta misma → **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
4. Espera 1–2 minutos y abre https://diegoarayapx1.github.io/demo/

## Editar un local

Solo se toca `demo/config.js`. Desde GitHub: abrir el archivo → lápiz → cambiar → **Commit changes**.
Se publica solo en ~1 minuto. Los campos vacíos (`""`) no muestran su botón.

## Agregar un local

Copiar la carpeta `demo` con otro nombre (ej. `donpepe`) y editar su `config.js`.
Quedan `/donpepe/` y `/donpepe/pago/`.

## Reglas

- **No bloquear tarjetas que apunten a github.io.** El dominio grabado en una tarjeta bloqueada no se
  puede cambiar nunca. Se bloquea solo con la URL definitiva del dominio propio.
- **El repo es público**: todo lo que va en `config.js` se ve, y el historial de commits guarda los datos
  aunque después se borren. Para clientes reales esto se mueve al backend propio.
- `demo: true` muestra el aviso de "datos de ejemplo". Se pone `false` solo con datos reales y
  autorizados por el dueño.
- Las páginas de locales llevan `noindex` para que no aparezcan en Google.
