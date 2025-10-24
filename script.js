const properties = [
  {id:'p1',location:'Playa Linda',lat:14.6205,lng:-90.5280,pricePerNight:120,img:'img/casa1.jpg',desc:'Terraza con vista al mar, 3 hab, piscina pequeña y parrilla.'},
  {id:'p2',location:'Costa Dorada',lat:14.6220,lng:-90.5345,pricePerNight:200,img:'img/casa2.jpg',desc:'Piscina privada, jardín amplio y cocina equipada.'},
  {id:'p3',location:'Bahía Azul',lat:14.6152,lng:-90.5201,pricePerNight:80,img:'img/casa3.jpg',desc:'Acogedora, ideal para parejas, a 1 minuto de la playa.'},
  {id:'p4',location:'Rincón del Mar',lat:14.6300,lng:-90.5400,pricePerNight:320,img:'img/casa4.jpg',desc:'Lujo discreto: 4 hab, piscina infinita y servicio opcional.'}
];

document.addEventListener('DOMContentLoaded',()=>{
  const list=document.getElementById('propList');
  const selProp=document.getElementById('selProp');
  const whatsappTop=document.getElementById('whatsappTop');
  const whLink=document.getElementById('whLink');
  const WHATSAPP_NUMBER='+50255551234';
  const WHATSAPP_PHONE_LINK=`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}`;
  whatsappTop.href=WHATSAPP_PHONE_LINK;
  whatsappTop.textContent='WhatsApp';
  whLink.href=WHATSAPP_PHONE_LINK;
  whLink.textContent=WHATSAPP_NUMBER;

  properties.forEach(p=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <img src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-loc">${p.location}</div>
        <div class="card-price">$${p.pricePerNight}/noche</div>
        <div class="card-actions">
          <button class="btn" data-id="${p.id}" onclick="openModal('${p.id}')">Ver detalle</button>
          <a class="btn btn-secondary" href="${mapUrl(p.lat,p.lng)}" target="_blank" rel="noopener">Ver en mapa</a>
        </div>
      </div>
    `;
    list.appendChild(card);

    const opt=document.createElement('option');
    opt.value=p.id;
    opt.textContent=`${p.title} — $${p.pricePerNight}/noche`;
    selProp.appendChild(opt);
  });

  document.getElementById('currentYear').textContent=new Date().getFullYear();

  const btnToggle=document.getElementById('btn-toggle');
  const nav=document.getElementById('main-nav');
  btnToggle.addEventListener('click',()=>nav.classList.toggle('open'));

  document.getElementById('btnCalc').addEventListener('click',calculateQuote);
  document.getElementById('btnWhats').addEventListener('click',sendQuoteWhats);
  document.getElementById('modalClose').addEventListener('click',closeModal);
  document.getElementById('modalWhats').addEventListener('click',sendModalWhats);
});

function mapUrl(lat,lng){return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;}

function calculateQuote(){
  const sel=document.getElementById('selProp').value;
  const nights=parseInt(document.getElementById('inpNights').value)||1;
  const guests=parseInt(document.getElementById('inpGuests').value)||1;
  const prop=properties.find(p=>p.id===sel);
  if(!prop) return;
  const total=prop.pricePerNight*nights;
  document.getElementById('totalPrice').textContent=`$${total}`;
  document.getElementById('priceBreak').textContent=`${nights} noches x $${prop.pricePerNight}`;
}

function sendQuoteWhats(){
  const sel=document.getElementById('selProp').value;
  const nights=parseInt(document.getElementById('inpNights').value)||1;
  const guests=parseInt(document.getElementById('inpGuests').value)||1;
  const prop=properties.find(p=>p.id===sel);
  if(!prop) return;
  const total=prop.pricePerNight*nights;
  const msg=`Hola! Me interesa la propiedad "${prop.title}" por ${nights} noches para ${guests} huésped(s). Total estimado: $${total}.`;
  window.open(`https://wa.me/50255551234?text=${encodeURIComponent(msg)}`, '_blank');
}

function openModal(id){
  const p=properties.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('modalImg').src=p.img;
  document.getElementById('modalTitle').textContent=p.title;
  document.getElementById('modalDesc').textContent=p.desc;
  document.getElementById('modalLocation').textContent=p.location;
  document.getElementById('mapLink').href=mapUrl(p.lat,p.lng);
  document.getElementById('modal').style.display='flex';
  document.getElementById('modal').setAttribute('aria-hidden','false');
}

function closeModal(){
  document.getElementById('modal').style.display='none';
  document.getElementById('modal').setAttribute('aria-hidden','true');
}

function sendModalWhats(){
  const title=document.getElementById('modalTitle').textContent;
  const msg=`Hola! Me interesa la propiedad "${title}".`;
  window.open(`https://wa.me/50255551234?text=${encodeURIComponent(msg)}`, '_blank');
}
