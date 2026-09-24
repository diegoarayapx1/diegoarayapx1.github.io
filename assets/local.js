/**
 * Arma las páginas de un local a partir de su config.js (window.LOCAL).
 * La misma lógica sirve para todos los locales: solo cambia config.js.
 *
 * Seguridad: los valores de config.js nunca se insertan como HTML
 * (siempre textContent) y cada link se arma desde un dato validado,
 * igual que en validar-destino.js. Un valor inválido oculta el botón.
 */
(function () {
  'use strict';

  var L = window.LOCAL;
  var app = document.getElementById('app');
  if (!app) return;
  if (!L) {
    app.textContent = 'Falta la configuración del local (config.js).';
    return;
  }

  // ---------- Validación ----------

  var PATRONES = {
    placeId: /^[A-Za-z0-9_-]{10,128}$/,
    instagram: /^[A-Za-z0-9._]{1,30}$/,
    tiktok: /^[A-Za-z0-9._]{1,24}$/,
    whatsapp: /^569\d{8}$/
  };

  function limpio(v) {
    return String(v == null ? '' : v).trim();
  }

  function valido(tipo, v) {
    if (!v) return false;
    if (PATRONES[tipo].test(v)) return true;
    console.warn('config.js: valor inválido para "' + tipo + '": ' + v + ' (botón oculto)');
    return false;
  }

  // Acepta "+56 9 1234 5678", "912345678" o "56912345678".
  function normalizarWhatsapp(v) {
    var d = limpio(v).replace(/\D/g, '');
    if (/^9\d{8}$/.test(d)) d = '56' + d;
    return d;
  }

  function formatearWhatsapp(d) {
    return '+56 9 ' + d.slice(3, 7) + ' ' + d.slice(7);
  }

  // ---------- Íconos (constantes, no vienen de config) ----------

  var SVG = {
    estrella: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/>',
    camara: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    musica: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    banco: '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    atras: '<path d="M15 6l-6 6 6 6"/>',
    enviar: '<path d="M21 3L10 14"/><path d="M21 3l-6.5 18-3.5-7-7-3.5z"/>'
  };

  function svg(nombre, tam) {
    tam = tam || 22;
    return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVG[nombre] + '</svg>';
  }

  // ---------- Utilidades DOM ----------

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function conIcono(clase, nombre, tam) {
    var n = el('span', clase);
    n.innerHTML = svg(nombre, tam); // constante interna
    return n;
  }

  function botonEnlace(o) {
    var a = el('a', 'btn' + (o.primario ? ' primary' : ''));
    a.href = o.href;
    a.appendChild(conIcono('ico', o.icono));
    var txt = el('span', 'txt');
    txt.appendChild(el('span', 't', o.titulo));
    if (o.detalle) txt.appendChild(el('span', 's', o.detalle));
    a.appendChild(txt);
    a.appendChild(conIcono('chev', 'chevron', 20));
    return a;
  }

  function iniciales(nombre) {
    return nombre.split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
  }

  function cabecera(titulo, detalle, conAvatar) {
    var h = el('header', 'head');
    if (conAvatar) h.appendChild(el('div', 'avatar', iniciales(titulo)));
    h.appendChild(el('h1', null, titulo));
    if (detalle) h.appendChild(el('p', 'sub', detalle));
    return h;
  }

  // ---------- Datos comunes ----------

  var nombre = limpio(L.nombre) || 'Local';
  var placeId = limpio(L.googlePlaceId);
  var wsp = normalizarWhatsapp(L.whatsapp);
  var ig = limpio(L.instagram).replace(/^@/, '');
  var tt = limpio(L.tiktok).replace(/^@/, '');
  var mapa = limpio(L.mapa);
  var T = L.transferencia || {};
  var hayTransferencia = !!limpio(T.titular);

  var placeOk = valido('placeId', placeId);
  var wspOk = valido('whatsapp', wsp);

  // ---------- Página de links ----------

  function paginaLinks() {
    document.title = nombre;
    app.appendChild(cabecera(nombre, limpio(L.descripcion), true));

    if (L.demo) {
      app.appendChild(el('p', 'aviso', 'Página de demostración: los botones usan datos de ejemplo.'));
    }

    var lista = el('ul', 'links');
    var items = [];

    if (placeOk) {
      items.push({
        icono: 'estrella', titulo: 'Déjanos tu reseña', detalle: 'En Google', primario: true,
        href: 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(placeId)
      });
    }

    if (wspOk) {
      // Sin trim: el espacio final deja el cursor listo para escribir el pedido.
      var msg = String(L.mensajeWhatsapp || '');
      if (!msg.trim()) msg = '';
      items.push({
        icono: 'chat', titulo: 'Pide por WhatsApp', detalle: formatearWhatsapp(wsp),
        href: 'https://wa.me/' + wsp + (msg ? '?text=' + encodeURIComponent(msg) : '')
      });
    }

    if (valido('instagram', ig)) {
      items.push({
        icono: 'camara', titulo: 'Instagram', detalle: '@' + ig,
        href: 'https://www.instagram.com/' + ig + '/'
      });
    }

    if (valido('tiktok', tt)) {
      items.push({
        icono: 'musica', titulo: 'TikTok', detalle: '@' + tt,
        href: 'https://www.tiktok.com/@' + tt
      });
    }

    if (mapa || placeOk) {
      items.push({
        icono: 'pin', titulo: 'Cómo llegar', detalle: mapa || 'Ver en el mapa',
        href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapa || nombre) +
          (placeOk ? '&query_place_id=' + encodeURIComponent(placeId) : '')
      });
    }

    if (hayTransferencia) {
      items.push({
        icono: 'banco', titulo: 'Datos para transferir', detalle: 'Cópialos con un toque',
        href: 'pago/'
      });
    }

    items.forEach(function (o) {
      var li = el('li');
      li.appendChild(botonEnlace(o));
      lista.appendChild(li);
    });

    if (!items.length) {
      app.appendChild(el('p', 'nota', 'Todavía no hay enlaces configurados.'));
    } else {
      app.appendChild(lista);
    }
  }

  // ---------- Página de transferencia ----------

  var toast;

  function avisar(texto) {
    if (!toast) {
      toast = el('div', 'toast');
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = texto;
    toast.classList.add('show');
    clearTimeout(avisar._t);
    avisar._t = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  }

  function copiarRespaldo(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, texto.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copiar(texto, alTerminar) {
    function listo() { avisar('Copiado'); if (alTerminar) alTerminar(); }
    function falla() { avisar('No se pudo copiar'); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(listo, function () {
        copiarRespaldo(texto) ? listo() : falla();
      });
    } else {
      copiarRespaldo(texto) ? listo() : falla();
    }
  }

  function botonCopiar(etiqueta, valor) {
    var b = el('button', 'copy');
    b.type = 'button';
    b.setAttribute('aria-label', 'Copiar ' + etiqueta);
    function estado(ok) {
      b.innerHTML = svg(ok ? 'check' : 'copiar', 16);
      b.appendChild(document.createTextNode(ok ? 'Copiado' : 'Copiar'));
      b.classList.toggle('ok', ok);
    }
    estado(false);
    b.addEventListener('click', function () {
      copiar(valor, function () {
        estado(true);
        setTimeout(function () { estado(false); }, 1600);
      });
    });
    return b;
  }

  function paginaPago() {
    document.title = 'Transferir a ' + nombre;

    var volver = el('a', 'back');
    volver.href = '../';
    volver.innerHTML = svg('atras', 18);
    volver.appendChild(document.createTextNode(nombre));
    app.appendChild(volver);

    app.appendChild(cabecera('Datos para transferir', nombre, false));

    if (!hayTransferencia) {
      app.appendChild(el('p', 'nota', 'Este local no tiene datos de transferencia configurados.'));
      return;
    }

    if (L.demo) {
      app.appendChild(el('p', 'aviso', 'Datos de ejemplo. No transfieras a esta cuenta.'));
    }

    var campos = [
      ['Titular', 'Nombre', limpio(T.titular)],
      ['RUT', 'RUT', limpio(T.rut)],
      ['Banco', 'Banco', limpio(T.banco)],
      ['Tipo de cuenta', 'Tipo de cuenta', limpio(T.tipoCuenta)],
      ['N° de cuenta', 'N° de cuenta', limpio(T.numeroCuenta)],
      ['Correo', 'Correo', limpio(T.correo)]
    ].filter(function (c) { return c[2]; });

    var card = el('div', 'card');
    campos.forEach(function (c) {
      var row = el('div', 'row');
      var info = el('div', 'info');
      info.appendChild(el('div', 'k', c[0]));
      info.appendChild(el('div', 'v', c[2]));
      row.appendChild(info);
      row.appendChild(botonCopiar(c[0], c[2]));
      card.appendChild(row);
    });
    app.appendChild(card);

    // Formato de "copiar todo": el mismo que se manda por WhatsApp en Chile.
    var bloque = campos.map(function (c) { return c[1] + ': ' + c[2]; }).join('\n');

    var acciones = el('div', 'acciones');

    var todo = el('button', 'btn primary center');
    todo.type = 'button';
    todo.innerHTML = svg('copiar', 20);
    todo.appendChild(document.createTextNode('Copiar todos los datos'));
    todo.addEventListener('click', function () { copiar(bloque); });
    acciones.appendChild(todo);

    if (wspOk) {
      var envio = el('a', 'btn center');
      envio.href = 'https://wa.me/' + wsp + '?text=' +
        encodeURIComponent('Hola, te envío el comprobante de mi transferencia.');
      envio.innerHTML = svg('enviar', 20);
      envio.appendChild(document.createTextNode('Enviar comprobante por WhatsApp'));
      acciones.appendChild(envio);
    }

    app.appendChild(acciones);
    app.appendChild(el('p', 'nota', 'Antes de confirmar, revisa que el titular sea ' + limpio(T.titular) + '.'));
  }

  // ---------- Arranque ----------

  if (document.body.getAttribute('data-pagina') === 'pago') {
    paginaPago();
  } else {
    paginaLinks();
  }
})();
