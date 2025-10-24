// --- Filtrado de casas ---
function buscarCasa() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const nombre = card.dataset.nombre.toLowerCase();
    const destino = card.dataset.destino.toLowerCase();
    card.style.display = (nombre.includes(input) || destino.includes(input)) ? 'block' : 'none';
  });
}

// --- Mostrar detalle en modal ---
function mostrarDetalle(nombre, destino, precio, imagen) {
  document.getElementById('modal-nombre').innerText = nombre;
  document.getElementById('modal-destino').innerText = destino;
  document.getElementById('modal-precio').innerText = precio;
  document.getElementById('modal-img').src = imagen;
  document.getElementById('modal').style.display = 'flex';
}

// --- Cerrar modal ---
function cerrarModal() {
  document.getElementById('modal').style.display = 'none';
}

// --- Cerrar al hacer clic fuera del modal ---
window.onclick = function(e) {
  const modal = document.getElementById('modal');
  if (e.target === modal) {
    cerrarModal();
  }
}
