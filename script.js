// Desplazamiento suave en los enlaces del menú
document.querySelectorAll('nav a').forEach(enlace => {
  enlace.addEventListener('click', e => {
    e.preventDefault();
    const seccion = document.querySelector(enlace.getAttribute('href'));
    seccion.scrollIntoView({ behavior: 'smooth' });
  });
});

// Animación sencilla de apariciones de casas al cargar
window.addEventListener('DOMContentLoaded', () => {
  const casas = document.querySelectorAll('.casa');
  casas.forEach((casa, index) => {
    casa.style.opacity = 0;
    setTimeout(() => {
      casa.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      casa.style.opacity = 1;
      casa.style.transform = "translateY(0)";
    }, index * 200);
  });
});
