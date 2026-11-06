# Ascend Gold · Web corporativa

Web estática bilingüe (ES en la raíz, EN en `/en/`) para **Ascend Gold**: mentalidad, consultoría, negocios digitales, inversiones (contenido educativo) y educación financiera.

Diseño y desarrollo: **Impulsa Digital** · https://impulsadigital.me

HTML5 semántico, CSS puro con variables y JavaScript vanilla. Sin dependencias ni proceso de build: se sube tal cual a Hostinger.

---

## 1. Análisis de la referencia (`referencia/diseno.png`)

La referencia muestra dos composiciones. Elementos replicados:

| Elemento de la referencia | Dónde está en la web |
|---|---|
| Fondo negro profundo, dorado como único acento | Variables en `assets/css/base.css` |
| Header fino: logo + nombre a la izquierda, menú en mayúsculas pequeñas, botón con borde dorado | `.site-header` (todas las páginas) |
| Hero a pantalla completa: montaña nevada al atardecer, luz dorada | `index.html` → `.hero` |
| Logo centrado con destello de 4 puntas que brilla | `.hero__logo` + `.sparkle` (animación sutil) |
| "ASCEND GOLD" en serif muy espaciado y lema "BUILD · INVEST · GROW" | `.hero__title` (Cinzel) y `.motto` |
| "HIGHER THAN YESTERDAY" con línea vertical dorada a la izquierda | `.title-line` |
| Botón con borde dorado fino + flecha → y botón dorado sólido | `.btn` / `.btn--solid` |
| Fila de 4 iconos lineales dorados con separadores verticales | `.pillars` (2×2 en móvil) |
| "OUR PHILOSOPHY" centrado con líneas a ambos lados, fondo de mármol negro con vetas doradas, "DISCIPLINE. STRATEGY. FREEDOM." | `.marble` |
| Edificio de cristal oscuro con el logo dorado reflejado, "INVEST · GROW · SUCCEED", "ASCEND / GOLD" | `.tower` (logo con perspectiva, brillo que lo recorre y reflejo) |
| Bloque partido: Tierra de noche con luces doradas + "OUR VISION ——" + "GLOBAL MINDS. LONG-TERM THINKING." + "LEARN MORE →" | `.earth` |
| Fila de cifras con separadores verticales | `.stats` (valores **[PENDIENTE]**; el "+15% annual growth" de la referencia se ha eliminado a propósito) |

## 2. Estructura

```
/
├── index.html, mindset.html, consultoria.html, negocios-digitales.html,
│   inversiones.html, educacion-financiera.html, contacto.html,
│   aviso-legal.html, politica-privacidad.html, politica-cookies.html, 404.html
├── en/                         (las mismas páginas en inglés)
├── referencia/diseno.png       (bloqueada al público por .htaccess)
├── assets/
│   ├── css/  base.css · layout.css · components.css · animations.css
│   │         pages/home.css · pages/interior.css
│   ├── js/   main.js
│   │         components/ testimonios.js · formulario.js · cookies.js · animaciones.js
│   ├── data/testimonios.json
│   ├── img/  logo/ · favicon/ · hero/ · secciones/ · texturas/ · og/ · icons/ · testimonios/
│   └── fonts/                  (vacía; ver LEEME.txt)
├── php/enviar.php
├── .htaccess · sitemap.xml · robots.txt · README.md
```

No hay CSS ni JS inline en el HTML. La única etiqueta `<script>` sin `src` es el bloque JSON-LD de schema.org, que contiene datos, no código.

## 3. Logo

Logo definitivo (noviembre 2026): dos picos facetados en dorado + destello de 4 puntas, texto en Cinzel convertido a trazos.

- `assets/img/logo/logo.svg`: icono + "ASCEND GOLD" en horizontal (header y footer), recortado al borde. Proporción 824×124 (en el HTML: `width="425" height="64"`).
- `assets/img/logo/logo-icon.svg`: solo el icono, cuadrado (hero, edificio y máscara del brillo).
- `assets/img/logo/brand/`: kit completo de marca (no lo usa la web): `svg/` con vertical, horizontal e icono, cada uno transparente y `-on-black`; `png/` a 512 y 1024 px de ancho; y `preview.html` para revisarlos.
- Paleta: `#F3D9A4` (claro), `#C9A35A` (medio), `#8A6A2F` (oscuro), `#5C4520` (sombra), sobre `#0A0A0A`.
- El destello animado (`.sparkle`) está centrado sobre la estrella del icono: `left: 59.9%; top: 9.9%` en `pages/home.css`.
- La imagen OG (`assets/img/og/og-ascend-gold.jpg`, 1200×630) ya usa el logo nuevo.

Favicons: `favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `favicon.svg` y `site.webmanifest`.

## 4. Imágenes y procedencia

Todas en WebP, con varios tamaños (`srcset`) y `loading="lazy"` salvo la imagen principal de cada cabecera (LCP). Se les ha aplicado un tratamiento oscuro y cálido (virado a dorado), reforzado por los degradados de CSS.

| Archivo | Origen | Licencia |
|---|---|---|
| `img/hero/montana-*.webp` | Unsplash · foto `photo-1506905925346-21bda4d32df4` (montañas sobre mar de nubes al atardecer) | Unsplash License (uso libre comercial) |
| `img/secciones/tierra-*.webp` | Unsplash · foto `photo-1451187580459-43490279c0fa` (Tierra de noche desde el espacio) | Unsplash License |
| `img/secciones/edificio-*.webp` | Unsplash · foto `photo-1486406146926-c627a92ad1ab` (rascacielos de cristal) | Unsplash License |
| `img/texturas/marmol-negro-oro-*.webp` | Textura generada a medida para el proyecto (mármol negro con vetas doradas) | Propia, sin restricciones |
| `img/og/og-ascend-gold.jpg` | Composición propia (foto del hero + logo) | — |

URL de cada foto: `https://unsplash.com/photos/<id>` (el id es la parte tras `photo-`). La imagen OG está en JPG a propósito: algunas redes sociales todavía no muestran bien WebP en las vistas previas.

## 5. Identidad visual

Variables en `:root` (`assets/css/base.css`):

- Negros: `#0A0A0A`, `#121212`, `#1C1C1C`
- Dorados: `#C9A24A`, `#E6C77A`, `#8C6D2C`
- Texto: `#F2EDE4` (blanco roto) y `#A39E93` (gris cálido)
- Tipografías (Google Fonts, `display=swap`): Cinzel (marca), Cormorant Garamond (títulos), Montserrat (etiquetas y menú, mayúsculas 11–13 px, `letter-spacing: 0.25em`), Inter (texto).

Accesibilidad: el dorado oscuro `#8C6D2C` no se usa nunca para texto; los textos pequeños en dorado usan `#C9A24A` o `#E6C77A` sobre negro (contraste AA). Foco visible dorado, `skip-link`, labels en todos los campos y menú móvil y banner de cookies accesibles por teclado.

## 6. Idiomas

- Español en la raíz y la versión en inglés en `/en/`, con los mismos nombres de archivo.
- Cada página tiene `lang`, `canonical` y `hreflang` (es, en, x-default), y selector **ES | EN** en el header que enlaza con la página equivalente.
- Los textos de marca se mantienen en inglés en ambas versiones: BUILD · INVEST · GROW, HIGHER THAN YESTERDAY, DISCIPLINE. STRATEGY. FREEDOM., GLOBAL MINDS. LONG-TERM THINKING. (también OUR PHILOSOPHY, OUR VISION e INVEST · GROW · SUCCEED de la referencia).
- Todo el texto redactado por la agencia lleva el comentario `<!-- TEXTO PROVISIONAL -->` en el HTML para que el cliente lo revise.

## 7. Testimonios

Se cargan desde `assets/data/testimonios.json`, que **empieza vacío (`[]`)**. Mientras esté vacío, la sección permanece oculta (`hidden`) y no deja hueco. No hay testimonios inventados en ningún sitio.

**Cómo añadir un testimonio:**

1. Abre `assets/data/testimonios.json`.
2. Añade un objeto por testimonio:

```json
[
  {
    "nombre": "Nombre Apellido",
    "cargo": "Empresario · Madrid",
    "texto": "Texto literal del testimonio, con permiso del cliente.",
    "foto": "assets/img/testimonios/nombre-apellido.webp",
    "idioma": "es"
  }
]
```

- `foto` es opcional (WebP cuadrado, 112×112 px recomendado, en `assets/img/testimonios/`).
- `idioma`: `"es"` o `"en"`. Si se omite, el testimonio aparece en las dos versiones.
- Con dos o más testimonios del mismo idioma se activa el carrusel (flechas, puntos, gesto táctil y autoplay que se pausa con el ratón o el foco).
- Aparece en la home y en Educación financiera.
- Usa solo testimonios reales y con autorización por escrito.

## 8. Formulario de contacto (Hostinger)

- `assets/js/components/formulario.js` valida en el navegador y envía por `fetch` a `php/enviar.php`.
- `enviar.php` vuelve a validar en el servidor, tiene honeypot (`website`) y tiempo mínimo de rellenado, evita la inyección de cabeceras y responde en JSON en el idioma de la página.
- Configura al principio de `php/enviar.php`:
  - `AG_DESTINO`: email que recibe los mensajes **[PENDIENTE]**
  - `AG_REMITENTE`: un buzón real del dominio creado en hPanel (p. ej. `no-reply@dominio`) **[PENDIENTE]**
- Si los correos llegan a spam, configura SPF/DKIM en Hostinger o cambia `mail()` por SMTP (PHPMailer).
- Los enlaces "Reservar una llamada" de Consultoría llevan `?interes=consultoria`, que preselecciona esa opción en el formulario.

## 9. Cookies (RGPD)

Banner con **Aceptar**, **Rechazar** y **Configurar** (panel con categorías). El consentimiento se guarda en `localStorage` (`ag_cookie_consent`) y se puede cambiar desde "Configurar cookies" en el footer. Ahora mismo no hay analítica; si se añade, cárgala solo tras el evento:

```js
document.addEventListener('ag:consent', function (e) {
  if (e.detail.analytics) { /* cargar Google Analytics, etc. */ }
});
```

## 10. WhatsApp

El número se configura en **un solo sitio**: `assets/js/main.js` → `CONFIG.whatsapp` (formato internacional sin `+`, p. ej. `34600000000`). Mientras esté vacío, el botón flotante y los enlaces de WhatsApp llevan a la página de contacto.

## 11. Avisos legales de inversión

Por decisión del cliente (6 nov 2026) se han quitado de la web las cajas "Aviso importante" y la línea del footer. También se ha quitado la sección "Carácter educativo del contenido" del aviso legal; la web ya no incluye ese aviso en ningún sitio. Los estilos `.disclaimer` y `.footer-disclaimer` siguen en el CSS por si se quiere volver a poner. No hay promesas de ganancias ni porcentajes de rentabilidad en ninguna parte.

## 12. SEO y rendimiento

- `title` y `description` únicos por página e idioma, Open Graph y Twitter Card, schema.org `Organization`, un único `H1` por página y `alt` en todas las imágenes (las decorativas con `alt=""`).
- `sitemap.xml` con alternativas hreflang y `robots.txt`.
- Preload de la imagen del hero, `fetchpriority="high"`, imágenes WebP responsive, JS con `defer`, fuentes con `display=swap`, caché y compresión en `.htaccess`.
- Animaciones suaves (aparición al hacer scroll, brillo del destello) que se desactivan con `prefers-reduced-motion`.

## 13. Puesta en marcha en Hostinger

1. Sube todo el contenido de la carpeta a `public_html/`.
2. Sustituye `https://ascend-gold.com` por el dominio real en todos los `.html`, `sitemap.xml` y `robots.txt` (buscar y reemplazar).
3. Configura email y WhatsApp (secciones 8 y 10).
4. Activa el SSL en hPanel (el `.htaccess` ya fuerza HTTPS y quita el `www`; si el dominio definitivo usa `www`, invierte esa regla).
5. Envía el `sitemap.xml` a Google Search Console.

Para probar en local: `python -m http.server 8765` dentro de la carpeta (el formulario PHP solo funciona en el hosting o con `php -S`).

---

## 14. Lista de [PENDIENTE]

| # | Pendiente | Dónde |
|---|---|---|
| 1 | ~~Dominio definitivo~~ ✔ `ascend-gold.com` (sin www) | — |
| 2 | **Email de destino** del formulario y buzón remitente | `php/enviar.php` (`AG_DESTINO`, `AG_REMITENTE`) |
| 3 | **Email de contacto** visible | Footer (todas las páginas), `contacto.html` y `en/contacto.html` |
| 4 | **Número de WhatsApp** | `assets/js/main.js` → `CONFIG.whatsapp`; texto en `contacto.html` |
| 5 | **Horario de atención** | `contacto.html` y `en/contacto.html` |
| 6 | **Precios** de programas, formaciones y mentorías | Tarjetas de Educación financiera (home y `educacion-financiera.html`, ES y EN) |
| 7 | **Cifras reales** (clientes, años, países, programas) | Bloque de cifras de la home (ES y EN). Sin porcentajes de rentabilidad |
| 8 | **Testimonios reales** con autorización | `assets/data/testimonios.json` |
| 9 | **Datos fiscales**: razón social, NIF/CIF, domicilio, datos registrales, email | `aviso-legal.html`, `politica-privacidad.html` (ES y EN) y texto informativo bajo el formulario |
| 10 | **Jurisdicción** aplicable | `aviso-legal.html` (ES y EN) |
| 11 | **Fecha de última actualización** de los textos legales | Páginas legales (ES y EN) |
| 12 | **Herramientas de analítica/marketing** (si se usan) | Tabla de `politica-cookies.html` + carga condicionada en JS |
| 13 | **Perfiles de redes sociales** | `sameAs` del schema.org (`<head>`) y footer si se quieren enlazar |
| 14 | **Revisión de los textos provisionales** | Bloques marcados con `<!-- TEXTO PROVISIONAL -->` |
| 15 | ~~Logo oficial en vectorial~~ ✔ hecho | Ver sección 3 |
