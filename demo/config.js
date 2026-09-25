/**
 * Configuración de UN local. Es el único archivo que se edita por cliente.
 * Para un local nuevo: copia la carpeta "demo" con otro nombre y cambia esto.
 *
 * Los campos que dejes vacíos ("") no muestran su botón.
 */
window.LOCAL = {
  // true = muestra el aviso de "datos de ejemplo". En un local real: false.
  demo: true,

  nombre: "Completos Demo",
  descripcion: "Completos y churrascos · Santiago",

  // Place ID de Google del local (botón de reseña). Se busca en:
  // https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
  googlePlaceId: "ChIJIyqrkfzEYpYR12HGgICtXjc",

  // Móvil chileno. Sirve "+56 9 1234 5678", "912345678" o "56912345678".
  whatsapp: "",
  mensajeWhatsapp: "Hola, quiero pedir: ",

  // Usuario sin @
  instagram: "",
  tiktok: "",

  // Dirección o nombre del lugar para "Cómo llegar".
  mapa: "",

  // Datos de transferencia. Si "titular" queda vacío, no aparece el botón.
  transferencia: {
    titular: "Nombre Apellido",
    rut: "11.111.111-1",
    banco: "Banco de Ejemplo",
    tipoCuenta: "Cuenta Vista",
    numeroCuenta: "000123456789",
    correo: "pagos@ejemplo.cl"
  }
};
