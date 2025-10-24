/* Datos iniciales: 4 propiedades */
const properties = [
  {
    id: 'p1',
    title: 'Chalet Vista Sol',
    location: 'Playa Linda',
    lat: 14.6205,
    lng: -90.5280,
    pricePerNight: 120,
    img: 'img/casa1.jpg',
    desc: 'Terraza con vista al mar, 3 hab, piscina pequeña y parrilla.'
  },
  {
    id: 'p2',
    title: 'Casa Brisa Marina',
    location: 'Costa Dorada',
    lat: 14.6220,
    lng: -90.5345,
    pricePerNight: 200,
    img: 'img/casa2.jpg',
    desc: 'Piscina privada, jardín amplio y cocina equipada.'
  },
  {
    id: 'p3',
    title: 'Cabaña El Faro',
    location: 'Bahía Azul',
    lat: 14.6152,
    lng: -90.5201,
    pricePerNight: 80,
    img: 'img/casa3.jpg',
    desc: 'Acogedora, ideal para parejas, a 1 minuto de la playa.'
  },
  {
    id: 'p4',
    title: 'Villa Coral',
    location: 'Rincón del Mar',
    lat: 14.6300,
    lng: -90.5400,
    pricePerNight: 320,
    img: 'img/casa4.jpg',
    desc: 'Lujo discreto: 4 hab, piscina infinita y servicio opcional.'
  }
];

/* Inicialización DOM */
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('propList');
  const selProp = document.getElementById('selProp');
  const whatsappTop = document.getElementById('whatsappTop');
  const whLink = document.getElementById('whLink');

  // Cambia este número por tu WhatsApp (formato internacional, sin espacios)
  const WHATSAPP_NUMBER = '+50255551234';
  const WHATSAPP_PHONE_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}`;

  // Set top buttons
  whatsappTop.href = WHATSAPP_PHONE_LINK;
  whatsappTop.textContent = 'WhatsApp';
  whLink.href = WHATSAPP_PHONE_LINK;
  whLink.textContent = WHATSAPP_NUMBER;

  // Rellenar listado propiedades y opciones del cotizador
  properties.forEach(p => {
    // Card
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-loc">${p.location}</div>
        <div class="card-price">$${p.pricePerNight} / noche</div>
        <div class="card-actions">
          <button class="btn" data-id="${p.id}" onclick="openModal('${p.id}')">Ver detalle</button>
          <a class="btn btn-cta" href="${mapUrl(p.lat,p.lng)}" target="_blank" rel="noopener">Ver en mapa</a>
        </div>
      </div>
    `;
    list.appendChild(card);

    // Option for select
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.title} — $${p.pricePerNight}/noche`;
    selProp.appendChild(opt);
  });

  // Fill year
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Navigation toggle
  const btnToggle = document.getElementById('btn-toggle');
  const nav = document.getElementById('main-nav');
  btnToggle.addEventListener('click', ()=> nav.classList.toggle('open'));

  // Cotizador events
  document.getElementById('btnCalc').addEventListener('click', calculateQuote);
  document.getElementById('btnWhats').addEventListener('click', sendQuoteWhats);

  // Modal actions: close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalWhats').addEventListener('click', ()=> {
    // forward to cotizador with selected property
    const id = document.getElementById('modal').dataset.propId;
    if (id) {
      document.getElementById('selProp').value = id;
      scrollToId('cotizador');
    }
  });
});

/* Helpers */
function mapUrl(lat,lng){
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/* Modal */
function openModal(id){
  const p = properties.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('modal');
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalLocation').textContent = `${p.location} — $${p.pricePerNight}/noche`;
  // Map link
  document.getElementById('mapLink').href = mapUrl(p.lat,p.lng);
  // store prop id for use
  modal.dataset.propId = p.id;
  modal.style.display = 'flex';
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  delete modal.dataset.propId;
}

window.addEventListener('click', (e)=>{
  const modal = document.getElementById('modal');
  if(e.target === modal) closeModal();
});

/* COTIZADOR */
function calculateQuote(){
  const propId = document.getElementById('selProp').value;
  const nights = Math.max(1, Number(document.getElementById('inpNights').value || 1));
  const guests = Math.max(1, Number(document.getElementById('inpGuests').value || 1));

  const prop = properties.find(p=>p.id===propId);
  if(!prop){
    alert('Selecciona una propiedad');
    return;
  }

  // Lógica de precios: base = pricePerNight * nights
  // si huéspedes > 4 => cargo extra por huésped adicional (ejemplo)
  let base = prop.pricePerNight * nights;
  let extraGuestCharge = 0;
  const includedGuests = 4;
  const extraPerGuest = 15; // USD por noche
  if(guests > includedGuests){
    extraGuestCharge = (guests - includedGuests) * extraPerGuest * nights;
  }

  // Posible descuento por más de 7 noches
  let discount = 0;
  if(nights >= 7) discount = 0.08 * base; // 8% de descuento

  const total = Math.round((base + extraGuestCharge - discount) * 100) / 100;

  document.getElementById('totalPrice').textContent = `$${total}`;
  document.getElementById('priceBreak').textContent = `Base: $${base} + Extra huéspedes: $${extraGuestCharge} - Descuento: $${discount.toFixed(2)}`;
}

function sendQuoteWhats(){
  // same calculation to include numbers
  const propId = document.getElementById('selProp').value;
  const nights = Math.max(1, Number(document.getElementById('inpNights').value || 1));
  const guests = Math.max(1, Number(document.getElementById('inpGuests').value || 1));
  const prop = properties.find(p=>p.id===propId);
  if(!prop){ alert('Selecciona una propiedad'); return; }
  // Recalculate
  let base = prop.pricePerNight * nights;
  let extraGuestCharge = 0;
  const includedGuests = 4;
  const extraPerGuest = 15;
  if(guests > includedGuests){
    extraGuestCharge = (guests - includedGuests) * extraPerGuest * nights;
  }
  let discount = 0;
  if(nights >= 7) discount = 0.08 * base;
  const total = Math.round((base + extraGuestCharge - discount) * 100) / 100;

  // Message (url encoded)
  const msg = encodeURIComponent(
    `Hola, quiero reservar:\n` +
    `Propiedad: ${prop.title} (${prop.location})\n` +
    `Noches: ${nights}\n` +
    `Huéspedes: ${guests}\n` +
    `Total estimado: $${total}\n\n` +
    `¿Cómo procedemos?`
  );

  // WhatsApp number (cambiar por tu número en script.js si necesario)
  const number = '+50255551234';
  const link = `https://wa.me/${number.replace(/\D/g,'')}?text=${msg}`;

  window.open(link, '_blank');
}

/* Utility */
function scrollToId(id){
  document.querySelector(`#${id}`).scrollIntoView({behavior:'smooth',block:'start'});
}
