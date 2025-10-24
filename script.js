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

  const WHATSAPP_NUMBER = '+50255551234';
  const WHATSAPP_PHONE_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}`;

  whatsappTop.href = WHATSAPP_PHONE_LINK;
  whLink.href = WHATSAPP_PHONE_LINK;

  properties.forEach(p => {
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

    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.title} — $${p.pricePerNight}/noche`;
    selProp.appendChild(opt);
  });

  document.getElementById('currentYear').textContent = new Date().getFullYear();

  const btnToggle = document.getElementById('btn-toggle');
  const nav = document.getElementById('main-nav');
  btnToggle.addEventListener('click', ()=> nav.classList.toggle('open'));

  document.getElementById('btnCalc').addEventListener('click', calculateQuote);
  document.getElementById('btnWhats').addEventListener('click', sendQuoteWhats);

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalWhats').addEventListener('click', ()=> {
    const id = document.getElementById('modal').dataset.propId;
    if (id) { document.getElementById('selProp').value = id; scrollToId('cotizador'); }
  });
});

function mapUrl(lat,lng){ return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`; }

function openModal(id){
  const p = properties.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('modal');
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalLocation').textContent = `${p.location} — $${p.pricePerNight}/noche`;
  document.getElementById('mapLink').href = mapUrl(p.lat,p.lng);
  modal.dataset.propId = p.id;
  modal.style.display = 'flex';
}

function closeModal(){ const modal = document.getElementById('modal'); modal.style.display='none'; delete modal.dataset.propId; }
window.addEventListener('click', (e)=>{ if(e.target===document.getElementById('modal')) closeModal(); });

function calculateQuote(){
  const propId = document.getElementById('selProp').value;
  const nights = Math.max(1, Number(document.getElementById('inpNights').value || 1));
  const guests = Math.max(1, Number(document.getElementById('inpGuests').value || 1));
  const prop = properties.find(p=>p.id===propId);
  if(!prop){ alert('Selecciona una propiedad'); return; }

  let base = prop.pricePerNight*nights;
  let extraGuestCharge = 0;
  if(guests>4) extraGuestCharge=(guests-4)*15*nights;
  let discount = nights>=7?0.08*base:0;
  const total=Math.round((base+extraGuestCharge-discount)*100)/100;

  document.getElementById('totalPrice').textContent=`$${total}`;
  document.getElementById('priceBreak').textContent=`Base: $${base} + Extra huéspedes: $${extraGuestCharge} - Descuento: $${discount.toFixed(2)}`;
}

function sendQuoteWhats(){
  const propId = document.getElementById('selProp').value;
  const nights = Math.max(1, Number(document.getElementById('inpNights').value || 1));
  const guests = Math.max(1, Number(document.getElementById('inpGuests').value || 1));
  const prop = properties.find(p=>p.id===propId);
  if(!prop){ alert('Selecciona una propiedad'); return; }

  let base = prop.pricePerNight*nights;
  let extraGuestCharge=0;
  if(guests>4) extraGuestCharge=(guests-4)*15*nights;
  let discount = nights>=7?0.08*base:0;
  const total=Math.round((base+extraGuestCharge-discount)*100)/100;

  const msg=encodeURIComponent(
    `Hola, quiero reservar:\nPropiedad: ${prop.title} (${prop.location})\nNoches: ${nights}\nHuéspedes: ${guests}\nTotal estimado: $${total}\n\n¿Cómo procedemos?`
  );

  const number='+50255551234';
  window.open(`https://wa.me/${number.replace(/\D/g,'')}?text=${msg}`,'_blank');
}

function scrollToId(id){ document.querySelector(`#${id}`).scrollIntoView({behavior:'smooth',block:'start'}); }
