# Curso Full Stack - Anto
## Compañero de estudio: Claude (Anthropic)
## Inicio: Junio 2026

---

## PROGRESO
- Sprint 1: HTML base ✅
- Sprint 2: CSS fundamentos + Flexbox + Grid + Google Fonts + Variables ✅
- Sprint 3: Git (siguiente) ⏳

---

## SPRINT 1 — HTML
HTML es la estructura de toda página web. No se ve bonito, solo define QUÉ hay y DÓNDE va.

### Conceptos clave
- Todo en HTML son etiquetas que abren y cierran: `<h1>Hola</h1>`
- El navegador lee el archivo de arriba a abajo
- `<head>` = info que el usuario NO ve (título, configuración)
- `<body>` = todo lo que el usuario SÍ ve

### Etiquetas aprendidas
- `<h1>` a `<h6>` — títulos (solo UN h1 por página)
- `<p>` — párrafo
- `<a href="url">` — enlace
- `<img src="url" alt="descripción">` — imagen
- `<ol>` / `<ul>` — listas ordenadas / desordenadas
- `<li>` — elemento de lista
- `<section>` — sección semántica de contenido
- `<div>` — caja genérica para agrupar elementos

### Atributos importantes
- `href` — destino de un enlace
- `src` — fuente de una imagen
- `alt` — texto alternativo de imagen (accesibilidad)
- `class` — nombre reutilizable para aplicar CSS
- `id` — nombre único en toda la página

### Buenas prácticas
- Siempre indentar el código (Tab o 4 espacios por nivel)
- Un solo `<h1>` por página
- Siempre poner `alt` en las imágenes
- Prettier formatea automático al guardar (Ctrl+S)

---

## SPRINT 2 — CSS
CSS es el estilo visual. Si HTML es el esqueleto, CSS es todo lo que se ve.

### Sintaxis base
```css
selector {
    propiedad: valor;
}
```

### Cómo conectar CSS al HTML
```html
<link rel="stylesheet" href="styles.css">
```
Va en el `<head>`, después de Google Fonts si lo usas.

### Box Model — todo es una caja
Cada elemento tiene 4 capas:
- `margin` — espacio FUERA del elemento
- `border` — borde del elemento
- `padding` — espacio DENTRO del elemento
- contenido — lo que hay adentro

```css
section {
    margin: 20px;
    border: 2px solid black;
    padding: 15px;
    border-radius: 8px; /* redondea esquinas */
}
```

### Selectores
```css
h1 { }          /* todas las etiquetas h1 */
.tarjeta { }    /* elementos con class="tarjeta" */
#titulo { }     /* elemento con id="titulo" */
```
- `.clase` — reutilizable en varios elementos
- `#id` — único en toda la página

### Colores — 3 formas válidas
```css
color: red;                    /* nombre */
color: #d3d3d3;                /* hexadecimal */
color: rgb(4, 200, 180);       /* rgb */
color: rgba(4, 200, 180, 0.5); /* rgb con transparencia */
```

### Variables CSS — define una vez, usa en todas partes
```css
/* Siempre hasta arriba del archivo */
:root {
    --color-principal: rgb(4, 200, 180);
    --color-fondo: #eaeaea;
    --color-texto: #1a1a1a;
}

h1 {
    color: var(--color-principal); /* así se usa */
}
```
Si cambias el valor en :root, cambia en toda la página.

### Google Fonts
```html
<!-- En el head, ANTES de tu CSS -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
```
```css
body {
    font-family: 'Inter', sans-serif;
}
```

### Flexbox — layouts en una dimensión
Para filas o columnas simples.
```css
.contenedor {
    display: flex;
    gap: 16px;
    justify-content: center; /* eje horizontal */
    align-items: center;     /* eje vertical */
}
```
Valores de justify-content: `center`, `space-between`, `space-around`, `flex-end`

### CSS Grid — layouts en dos dimensiones
Para layouts completos con filas Y columnas.
```css
.contenedor {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columnas iguales */
    gap: 20px;
}
```
- `fr` = fracción del espacio disponible
- `repeat(n, valor)` = repite n veces
- `repeat(auto-fit, minmax(200px, 1fr))` = responsivo automático

### Cuándo usar cada uno
- **Flexbox** → navbar, botones en fila, links, cosas simples en una dirección
- **Grid** → layouts de página, tarjetas, dashboards, dos dimensiones

### Propiedades útiles
```css
text-align: center;
font-size: 16px;
font-weight: bold; /* o 400, 500, 700 */
max-width: 800px;
margin: 0 auto;    /* centra un bloque horizontalmente */
display: block;
object-fit: cover; /* imagen sin deformarse */
border-radius: 50%; /* círculo perfecto */
```

---

## SIGUIENTE — SPRINT 3: Git
- Qué es el control de versiones
- Comandos básicos: init, add, commit, push
- Subir código a GitHub
- Flujo de trabajo profesional con ramas

---

## CONTEXTO PARA CLAUDE (pega esto si abres chat nuevo)
Soy Anto, aprendo full stack con Claude desde cero.
Stack objetivo: HTML → CSS → JS → React → Node.js → MongoDB → Deploy
Voy en Sprint 3 (Git). Ya completé HTML y CSS con proyecto de perfil personal.
Archivo en: curso-fullstack/perfil.html + styles.css
Continuamos donde quedamos.