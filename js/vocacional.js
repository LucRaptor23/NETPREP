// vocacional.js — Test vocacional: ¿Blue Team o Red Team?
// Cada opción suma puntos a Blue (b) y/o a Red (r). No hay respuestas "correctas".

// ----- 1. Las preguntas (para agregar una, copia un bloque { ... }) -----
const vocPreguntas = [
  { texto: "Un sábado libre, ¿qué prefieres hacer?", opciones: [
    { t: "Armar un laboratorio y romper cosas para ver cómo funcionan", b: 0, r: 2 },
    { t: "Ordenar y documentar todo para que funcione mejor", b: 2, r: 0 },
    { t: "Resolver retos tipo CTF contra el reloj", b: 1, r: 1 },
    { t: "Leer sobre ataques reales y cómo se detectaron", b: 2, r: 0 }] },
  { texto: "En un videojuego, ¿cuál es tu estilo?", opciones: [
    { t: "Sigilo e infiltración", b: 0, r: 2 },
    { t: "Defender la base", b: 2, r: 0 },
    { t: "Estrategia y manejo de recursos", b: 1, r: 1 },
    { t: "Explorar y encontrar secretos escondidos", b: 0, r: 2 }] },
  { texto: "¿Qué te daría más orgullo?", opciones: [
    { t: "Encontrar una falla que nadie había visto", b: 0, r: 2 },
    { t: "Frenar un ataque justo a tiempo", b: 2, r: 0 },
    { t: "Explicar un riesgo en un informe claro", b: 1, r: 1 },
    { t: "Que tu empresa nunca sufra un incidente grave", b: 2, r: 0 }] },
  { texto: "¿Cómo trabajas mejor?", opciones: [
    { t: "Con rutina, turnos y un equipo cerca", b: 2, r: 0 },
    { t: "Por proyectos, con fechas de entrega", b: 1, r: 1 },
    { t: "Con libertad para investigar a mi ritmo", b: 0, r: 2 },
    { t: "Bajo presión: una emergencia me activa", b: 2, r: 0 }] },
  { texto: "Ante un problema técnico, tu primer impulso es…", opciones: [
    { t: "Revisar registros (logs) hasta entender qué pasó", b: 2, r: 0 },
    { t: "Probar cosas distintas hasta que ceda", b: 0, r: 2 },
    { t: "Buscar patrones en los datos", b: 2, r: 0 },
    { t: "Pensar cómo lo haría un atacante", b: 0, r: 2 }] },
  { texto: "¿Qué parte de la tecnología te atrae más?", opciones: [
    { t: "Aplicaciones y sitios web", b: 0, r: 2 },
    { t: "Redes, servidores y sistemas", b: 1, r: 1 },
    { t: "Datos, alertas y monitoreo", b: 2, r: 0 },
    { t: "Usuarios, accesos y contraseñas", b: 1, r: 1 }] },
  { texto: "¿Qué cualidad te describe mejor?", opciones: [
    { t: "Paciencia y atención al detalle", b: 2, r: 0 },
    { t: "Creatividad y pensar distinto", b: 0, r: 2 },
    { t: "Disciplina y constancia", b: 1, r: 0 },
    { t: "Curiosidad por saltar los límites", b: 0, r: 2 }] },
  { texto: "Si tuvieras que elegir hoy…", opciones: [
    { t: "Construir defensas sólidas", b: 2, r: 0 },
    { t: "Probar que las defensas pueden fallar", b: 0, r: 2 },
    { t: "Un poco de ambas cosas", b: 1, r: 1 },
    { t: "Aún no lo sé", b: 0, r: 0 }] }
];

// Certificaciones hacia las que apunta cada camino
const META = {
  blue: "Cisco CyberOps · BTL1 · CompTIA CySA+",
  red: "eJPT · eWPTX · eCPPT · OSCP",
  mixto: "Cisco CyberOps (Blue) o eJPT (Red)"
};

// ----- 2. Variables que cambian mientras respondes -----
let vocActual = 0;
let vocBlue = 0;
let vocRed = 0;

const vocInicio = document.getElementById("vocInicio");
const vocCuerpo = document.getElementById("vocCuerpo");
const vocPregunta = document.getElementById("vocPregunta");
const vocLista = document.getElementById("vocOpciones");
const vocPaso = document.getElementById("vocPaso");
const vocBarra = document.getElementById("vocBarra");
const vocResultado = document.getElementById("vocResultado");

// ----- 3. Mostrar una pregunta -----
function vocMostrar() {
  const p = vocPreguntas[vocActual];
  vocPaso.textContent = "Pregunta " + (vocActual + 1) + " de " + vocPreguntas.length;
  vocBarra.style.width = (vocActual / vocPreguntas.length * 100) + "%";
  vocPregunta.textContent = p.texto;
  vocLista.innerHTML = "";
  p.opciones.forEach(function (op) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = op.t;
    boton.addEventListener("click", function () { vocElegir(op, boton); });
    vocLista.appendChild(boton);
  });
}

// ----- 4. Cuando eliges una opción: sumamos puntos -----
function vocElegir(op, boton) {
  vocLista.querySelectorAll(".opcion").forEach(function (b) { b.disabled = true; });
  boton.classList.add("elegida");
  vocBlue += op.b;
  vocRed += op.r;
  setTimeout(function () {
    vocActual++;
    if (vocActual < vocPreguntas.length) vocMostrar(); else vocFinal();
  }, 500);
}

// ----- 5. Resultado -----
function vocFinal() {
  const total = (vocBlue + vocRed) || 1;
  const pb = Math.round(vocBlue / total * 100);
  const pr = 100 - pb;
  let equipo, titulo, texto;
  if (Math.abs(pb - pr) < 20) {
    equipo = "mixto";
    titulo = "Perfil mixto · Purple Team";
    texto = "Te atraen por igual la defensa y el ataque. Empieza por Fundamentos y prueba los dos cursos iniciales antes de decidir: así sabrás cuál disfrutas más.";
  } else if (pb > pr) {
    equipo = "blue";
    titulo = "Perfil Blue Team";
    texto = "Eres metódico, observador y te motiva proteger. Disfrutarás analizando alertas, buscando patrones y respondiendo a incidentes desde un SOC.";
  } else {
    equipo = "red";
    titulo = "Perfil Red Team";
    texto = "Eres curioso, creativo y te gusta romper límites. Disfrutarás buscando vulnerabilidades y demostrando cómo un atacante podría entrar (siempre con autorización).";
  }
  const ruta = equipo === "mixto" ? [EQUIPOS.blue[0], EQUIPOS.red[0]] : EQUIPOS[equipo];
  const items = ruta.map(function (c, k) {
    return '<li class="' + (k === 0 ? "empieza" : "") + '"><a href="cursos.html#' + c[1] + '">' + c[0] + "</a>" +
      (k === 0 ? '<span class="etiqueta">Empieza aquí</span>' : "") + "</li>";
  }).join("");
  const aviso = (typeof nivelElegido !== "undefined" && nivelElegido >= 0 && nivelElegido < 2)
    ? "<p>Recuerda: antes de entrar a tu equipo, completa los Fundamentos que te recomendó el test de nivel.</p>" : "";
  const enlace = equipo === "mixto" ? "ruta.html" : "ruta.html#" + equipo;

  vocBarra.style.width = "100%";
  vocCuerpo.hidden = true;
  vocResultado.hidden = false;
  vocResultado.className = "resultado";
  vocResultado.innerHTML =
    '<span class="etiqueta">Tu perfil vocacional</span>' +
    '<p class="nivel-nombre">' + titulo + "</p><p>" + texto + "</p>" +
    '<div class="vs">' +
      '<div class="vs-fila t-blue"><div class="nombre"><span>Blue Team · defensa</span><span>' + pb + '%</span></div><div class="vs-barra"><i id="barraBlue"></i></div></div>' +
      '<div class="vs-fila t-red"><div class="nombre"><span>Red Team · ataque ético</span><span>' + pr + '%</span></div><div class="vs-barra"><i id="barraRed"></i></div></div>' +
    "</div>" + aviso +
    "<h3>Tu primer paso</h3>" +
    '<ol class="ruta-lista">' + items + "</ol>" +
    '<p class="meta">Certificaciones hacia las que apunta este camino: <strong>' + META[equipo] + "</strong></p>" +
    '<div class="botones"><a class="boton" href="' + enlace + '">Ver mi ruta completa</a>' +
    '<button class="boton boton-ghost" id="vocReiniciar">Repetir test</button></div>';

  // las barras se llenan con una animación suave
  setTimeout(function () {
    document.getElementById("barraBlue").style.width = pb + "%";
    document.getElementById("barraRed").style.width = pr + "%";
  }, 100);
  document.getElementById("vocReiniciar").addEventListener("click", vocReiniciar);
  vocResultado.scrollIntoView({ behavior: "smooth", block: "center" });
}

function vocReiniciar() {
  vocActual = 0; vocBlue = 0; vocRed = 0;
  vocResultado.hidden = true;
  vocInicio.hidden = false;
}

// ----- 6. Botón de inicio -----
document.getElementById("vocEmpezar").addEventListener("click", function () {
  vocInicio.hidden = true;
  vocCuerpo.hidden = false;
  vocMostrar();
});
