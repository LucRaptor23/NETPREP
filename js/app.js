// app.js — pequeños efectos para todas las páginas

// 1) Menú del celular: abre y cierra al tocar el botón ☰
const botonMenu = document.getElementById("menuBtn");
if (botonMenu) {
  botonMenu.addEventListener("click", function () {
    document.getElementById("menu").classList.toggle("abierto");
  });
}

// 2) Los elementos con clase "revela" aparecen cuando llegas a ellos al hacer scroll
const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".revela").forEach(function (el) { observador.observe(el); });
