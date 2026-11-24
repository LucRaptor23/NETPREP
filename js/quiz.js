// quiz.js — "Conoce tu nivel": 8 preguntas con puntaje + 1 pregunta de interés

// ----- 1. Las preguntas (para agregar una, copia un bloque { ... }) -----
const preguntas = [
  { tema: "Redes", texto: "¿Qué puerto usa HTTPS por defecto?", opciones: ["22", "80", "443", "25"], correcta: 2 },
  { tema: "Nmap", texto: "¿Qué hace el comando nmap -sV 192.168.1.10?", opciones: ["Hace ping a esa IP", "Detecta la versión de los servicios en los puertos abiertos", "Bloquea esa IP", "Cambia la IP del equipo"], correcta: 1 },
  { tema: "Redes", texto: "¿Qué dispositivo conecta redes distintas y decide la ruta de los paquetes?", opciones: ["Switch", "Hub", "Router", "Repetidor"], correcta: 2 },
  { tema: "Redes", texto: "¿Para qué sirve el DNS?", opciones: ["Cifrar el tráfico", "Traducir nombres de dominio a direcciones IP", "Asignar IPs automáticamente", "Bloquear virus"], correcta: 1 },
  { tema: "Redes", texto: "En el modelo OSI, ¿en qué capa trabaja el direccionamiento IP?", opciones: ["Capa 2", "Capa 3", "Capa 4", "Capa 7"], correcta: 1 },
  { tema: "Seguridad", texto: "¿Cuál de estas NO forma parte de la tríada CIA?", opciones: ["Confidencialidad", "Integridad", "Disponibilidad", "Rapidez"], correcta: 3 },
  { tema: "Linux", texto: "¿Qué comando muestra los archivos de una carpeta en Linux?", opciones: ["cd", "ls", "rm", "cat"], correcta: 1 },
  { tema: "Blue Team", texto: "¿Qué hace un analista SOC de nivel 1?", opciones: ["Desarrolla exploits", "Revisa alertas y decide si son un incidente real", "Instala cables de red", "Diseña páginas web"], correcta: 1 },
  // Esta última no suma puntos: sirve para elegir entre Blue Team y Red Team
  { tema: "interes", texto: "¿Qué te llama más la atención?", opciones: ["Defender y detectar ataques (Blue Team)", "Encontrar fallos como atacante ético (Red Team)", "Todavía no lo sé"] }
];

// ----- 2. Los cursos de cada ruta: [nombre, id del curso en cursos.html] -----
const BASE = [["Fundamentos de redes", "redes"], ["Linux para ciberseguridad", "linux"], ["Fundamentos de ciberseguridad", "ciber"], ["Nmap y Wireshark", "herramientas"]];
const EQUIPOS = {
  blue: [["Fundamentos de Blue Team", "bt-fund"], ["SOC Nivel 1", "soc1"], ["SOC Nivel 2", "soc2"], ["SOC Nivel 3", "soc3"]],
  red: [["Fundamentos de Red Team", "rt-fund"], ["Pentesting Web", "web"], ["Pentesting de Infraestructura", "infra"], ["Active Directory", "ad"]]
};
const NIVELES = [
  { nombre: "Nivel inicial", desde: 0, mensaje: "Estás en el punto perfecto para empezar. Vamos paso a paso desde la base." },
  { nombre: "Nivel intermedio", desde: 2, mensaje: "Ya manejas lo básico de redes. Te toca consolidar seguridad y herramientas." },
  { nombre: "Nivel avanzado", desde: 3, mensaje: "Tienes buena base. Puedes saltar directo a las herramientas y a tu equipo." }
];

// ----- 3. Variables que cambian mientras respondes -----
let actual = 0;          // número de pregunta
let puntaje = 0;         // respuestas correctas
let interes = "";        // "blue", "red" o ""
const fallos = [];       // temas donde te equivocaste
let nivelElegido = -1;   // 0 inicial, 1 intermedio, 2 avanzado (lo usa vocacional.js)

const cuerpo = document.getElementById("quizCuerpo");
const pregunta = document.getElementById("quizPregunta");
const lista = document.getElementById("quizOpciones");
const paso = document.getElementById("quizPaso");
const barra = document.getElementById("quizBarra");
const resultado = document.getElementById("quizResultado");

// ----- 4. Mostrar una pregunta -----
function mostrarPregunta() {
  const p = preguntas[actual];
  paso.textContent = "Pregunta " + (actual + 1) + " de " + preguntas.length;
  barra.style.width = (actual / preguntas.length * 100) + "%";
  pregunta.textContent = p.texto;
  lista.innerHTML = "";
  p.opciones.forEach(function (texto, i) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = texto;
    boton.addEventListener("click", function () { elegir(i, boton); });
    lista.appendChild(boton);
  });
}

// ----- 5. Cuando eliges una opción -----
function elegir(i, boton) {
  const p = preguntas[actual];
  const botones = lista.querySelectorAll(".opcion");
  botones.forEach(function (b) { b.disabled = true; });
  if (p.tema === "interes") {
    interes = i === 0 ? "blue" : i === 1 ? "red" : "";
  } else if (i === p.correcta) {
    puntaje++;
    boton.classList.add("bien");
  } else {
    boton.classList.add("mal");
    botones[p.correcta].classList.add("bien");
    if (!fallos.includes(p.tema)) fallos.push(p.tema);
  }
  setTimeout(function () {
    actual++;
    if (actual < preguntas.length) mostrarPregunta(); else mostrarResultado();
  }, 900);
}

// ----- 6. Calcular y mostrar el resultado -----
function mostrarResultado() {
  const total = preguntas.length - 1;
  const nivel = puntaje <= 3 ? 0 : puntaje <= 6 ? 1 : 2;
  nivelElegido = nivel;
  let ruta = BASE.slice(NIVELES[nivel].desde);
  if (EQUIPOS[interes]) {
    if (nivel === 2) ruta = ruta.slice(0, 1);        // avanzado: solo repasa herramientas
    ruta = ruta.concat(EQUIPOS[interes]);
  } else {
    ruta = ruta.concat([["Elige tu equipo: Blue Team o Red Team", "blue"]]);
  }
  const items = ruta.map(function (c, k) {
    return '<li class="' + (k === 0 ? "empieza" : "") + '"><a href="cursos.html#' + c[1] + '">' + c[0] + "</a>" +
      (k === 0 ? '<span class="etiqueta">Empieza aquí</span>' : "") + "</li>";
  }).join("");
  const refuerzo = fallos.length ? "<p>Refuerza: <strong>" + fallos.join(", ") + "</strong></p>" : "<p>¡Sin errores! Muy buen nivel.</p>";

  barra.style.width = "100%";
  cuerpo.hidden = true;
  resultado.hidden = false;
  resultado.className = "resultado";
  resultado.innerHTML =
    '<span class="etiqueta">Tu resultado</span>' +
    '<p class="nivel-nombre">' + NIVELES[nivel].nombre + "</p>" +
    '<p class="puntaje mono">' + puntaje + " / " + total + " respuestas correctas</p>" +
    "<p>" + NIVELES[nivel].mensaje + "</p>" + refuerzo +
    "<h3>Empieza desde aquí</h3>" +
    '<ol class="ruta-lista">' + items + "</ol>" +
    '<div class="botones"><a class="boton" href="cursos.html#' + ruta[0][1] + '">Ir a ' + ruta[0][0] + '</a>' +
    '<a class="boton boton-ghost" href="#vocacion">Test vocacional →</a>' +
    '<button class="boton boton-ghost" id="reiniciar">Repetir test</button></div>';
  document.getElementById("reiniciar").addEventListener("click", reiniciar);
}

function reiniciar() {
  actual = 0; puntaje = 0; interes = ""; fallos.length = 0;
  resultado.hidden = true;
  cuerpo.hidden = false;
  mostrarPregunta();
}

mostrarPregunta();
