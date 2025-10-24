const properties = [
  {id:'p1',title:'Chalet Vista Sol',location:'Playa Linda',lat:14.6205,lng:-90.5280,pricePerNight:120,
   imgs:['img/casa1.jpg', 'img/casa1-1.jpg','img/casa1-2.jpg','img/casa1-3.jpg'],
   desc:'Terraza con vista al mar, 3 hab, piscina pequeña y parrilla.'},
  {id:'p2',title:'Casa Brisa Marina',location:'Costa Dorada',lat:14.6220,lng:-90.5345,pricePerNight:200,
   imgs:['img/casa2.jpg','img/casa2-1.jpg','img/casa2-2.jpg','img/casa2-3.jpg'],
   desc:'Piscina privada, jardín amplio y cocina equipada.'},
  {id:'p3',title:'Cabaña El Faro',location:'Bahía Azul',lat:14.6152,lng:-90.5201,pricePerNight:80,
   imgs:['img/casa3.jpg','img/casa3-1.jpg','img/casa3-2.jpg','img/casa3-3.jpg'],
   desc:'Acogedora, ideal para parejas, a 1 minuto de la playa.'},
  {id:'p4',title:'Villa Coral',location:'Rincón del Mar',lat:14.6300,lng:-90.5400,pricePerNight:320,
   imgs:['img/casa4.jpg','img/casa4-1.jpg','img/casa4-2.jpg','img/casa4-3.jpg'],
   desc:'Lujo discreto: 4 hab, piscina infinita y servicio opcional.'}
];

let currentModalImgs = [];
let currentImgIndex = 0;

document.addEventListener('DOMContentLoaded',()=>{
  const list=document.getElementById('propList');
  const selProp=document.getElementById('selProp');
  const whatsappTop=document.getElementById('whatsappTop');
  const whLink=document.getElementById('whLink');
  const WHATSAPP_NUMBER='+50212341234';
  const WHATSAPP_PHONE_LINK=`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}`;
  whatsappTop.href=WHATSAPP_PHONE_LINK;
  whatsappTop.textContent='WhatsApp';
  whLink.href=WHATSAPP_PHONE_LINK;
  whLink.textContent=WHATSAPP_NUMBER;

  properties.forEach(p=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <img src="${p.imgs[0]}" alt="${p.title}">
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

  document.getElementById('btnCalc').addEventListener('click',calcQuote);
  document.getElementById('btnWhats').addEventListener('click',sendQuote);
  document.getElementById('modalClose').addEventListener('click',()=>{closeModal();});
  document.getElementById('prevImg').addEventListener('click',()=>{prevImg();});
  document.getElementById('nextImg').addEventListener('click',()=>{nextImg();});
  document.getElementById('modalWhats').addEventListener('click',sendQuoteFromModal);
});

// MODAL
function openModal(id){
  const p=properties.find(x=>x.id===id);
  if(!p) return;
  currentModalImgs=p.imgs;
  currentImgIndex=0;
  document.getElementById('modalImg').src=currentModalImgs[currentImgIndex];
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

function prevImg(){
  if(currentModalImgs.length===0) return;
  currentImgIndex=(currentImgIndex-1+currentModalImgs.length)%currentModalImgs.length;
  document.getElementById('modalImg').src=currentModalImgs[currentImgIndex];
}

function nextImg(){
  if(currentModalImgs.length===0) return;
  currentImgIndex=(currentImgIndex+1)%currentModalImgs.length;
  document.getElementById('modalImg').src=currentModalImgs[currentImgIndex];
}

function mapUrl(lat,lng){return `https://www.google.com/maps?q=${lat},${lng}`;}

// COTIZADOR
function calcQuote(){
  const sel=document.getElementById('selProp').value;
  const nights=parseInt(document.getElementById('inpNights').value)||1;
  const guests=parseInt(document.getElementById('inpGuests').value)||1;
  const p=properties.find(x=>x.id===sel);
  if(!p) return;
  const total=p.pricePerNight*nights;
  document.getElementById('totalPrice').textContent=`$${total}`;
  document.getElementById('priceBreak').textContent=`$${p.pricePerNight} x ${nights} noches`;
}

function sendQuote(){
  calcQuote();
  const sel=document.getElementById('selProp').value;
  const nights=document.getElementById('inpNights').value;
  const guests=document.getElementById('inpGuests').value;
  const p=properties.find(x=>x.id===sel);
  if(!p) return;
  const total=p.pricePerNight*nights;
  const msg=`Hola! Estoy interesado en ${p.title} para ${nights} noches y ${guests} huéspedes. Total estimado: $${total}.`;
  const link=`https://wa.me/+50212341234?text=${encodeURIComponent(msg)}`;
  window.open(link,'_blank');
}

function sendQuoteFromModal(){
  const p=properties.find(x=>x.imgs===currentModalImgs);
  const nights=document.getElementById('inpNights').value||1;
  const guests=document.getElementById('inpGuests').value||1;
  const total=(p? p.pricePerNight:0)*nights;
  const msg=`Hola! Estoy interesado en ${p.title} para ${nights} noches y ${guests} huéspedes. Total estimado: $${total}.`;
  const link=`https://wa.me/+50212341234?text=${encodeURIComponent(msg)}`;
  window.open(link,'_blank');
}
