// === DATA 10 PRODUK ===
const P = {
  p1:{n:"Parfum Set",p:850000,i:["parfumset1.png","parfumset2.png"],d:"Set parfum unisex 50ml + 10ml travel size.",v:["Scent 01","Scent 02"],s:52},
  p2:{n:"Scented Candle",p:210000,i:["candle.png","candle1.png","candle2.png"],d:"Lilin aroma terapi 200gr.",v:["Lavender","Woody","Vanilla"],s:42},
  p3:{n:"Hoodie Black Edition",p:750000,i:["hoodie b.png","hoodie b ver.jpg"],d:"Hoodie katun combed 24s.",v:["Size S","M","L","XL"],s:38},
  p4:{n:"Ball Cap Visual",p:225000,i:["ball cap 1.png","ball cap 2.png"],d:"Topi baseball bordir logo.",v:["One Size"],s:28},
  p5:{n:"Eco Bag Archive",p:150000,i:["eco bag.png","ecobag.jpg"],d:"Tas belanja katun organik.",v:["One Size"],s:48},
  p6:{n:"Photobook Ver.",p:350000,i:["photobook.png","photobook1.png"],d:"Photobook 100 halaman.",v:["Mark","Renjun","Jeno","Haechan","Jaemin","Chenle","Jisung"],s:25},
  p7:{n:"Poster Set",p:120000,i:["poster01.png","poster.png","poster1.png"],d:"Set 3 poster A3.",v:["Mark","Renjun","Jeno","Haechan","Jaemin","Chenle","Jisung"],s:27},
  p8:{n:"Acrylic Stand",p:285000,i:["acrylic.png","logojaemin.png"],d:"Acrylic stand 15cm.",v:["Mark","Renjun","Jeno","Haechan","Jaemin","Chenle","Jisung"],s:35},
  p9:{n:"Visual Keyring",p:95000,i:["key ring.png","keyring1.png"],d:"Gantungan kunci akrilik.",v:["Mark","Renjun","Jeno","Haechan","Jaemin","Chenle","Jisung"],s:67},
  p10:{n:"LED Room Light",p:550000,i:["led.png","led1.png","led2.png"],d:"Lampu LED RGB + remote.",v:["Mark","Renjun","Jeno","Haechan","Jaemin","Chenle","Jisung"],s:10}
};

// === PENYIMPANAN ===
const C = () => JSON.parse(sessionStorage.getItem('cart') || '[]');
const SC = c => sessionStorage.setItem('cart', JSON.stringify(c));
const LS = () => JSON.parse(localStorage.getItem('productStock'));
const SS = s => localStorage.setItem('productStock', JSON.stringify(s));
const GS = id => { const s = LS(); return s ? s[id] || 0 : P[id].s; };

if (!localStorage.getItem('productStock')) {
  const stocks = {};
  for (let id in P) stocks[id] = P[id].s;
  SS(stocks);
}
if (!sessionStorage.getItem('cart')) SC([]);

// === UTILITAS ===
function toast(msg) {
  const el = document.getElementById('global-toast');
  if (el) {
    el.textContent = msg; el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => el.style.opacity = '0', 2500);
  }
}
function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = C().reduce((sum, i) => sum + i.qty, 0);
}
addEventListener('scroll', () => {
  const nb = document.querySelector('.navbar');
  if (nb) nb.classList.toggle('scrolled', scrollY > 50);
});

// === TOKO ===
function initShop() {
  if (!document.querySelector('.catalog')) return;
  let cart = C();

  function renderSidebar() {
    let total = 0, qty = 0, html = '';
    const ongkir = parseInt(document.getElementById('in-kurir').value) || 0;
    document.querySelectorAll('.db-check:checked').forEach(cb => {
      const id = cb.id, p = P[id];
      const q = parseInt(document.getElementById('qty-' + id).value) || 1;
      const variant = (document.getElementById('var-' + id)?.value) || '';
      const sub = p.p * q;
      total += sub; qty += q;
      html += `<div class="summary-item"><span>${p.n} (${variant}) x${q}</span><span>Rp ${sub.toLocaleString('id-ID')} <span class="remove-item" data-id="${id}" data-variant="${variant}">✖</span></span></div>`;
    });
    const grand = total > 0 ? total + ongkir : 0;
    document.getElementById('cart-badge').textContent = qty;
    document.getElementById('sidebar-cart-list').innerHTML = html || '<p style="text-align:center;color:#ccc;padding:20px;">Pilih barang di katalog</p>';
    document.getElementById('total-side').textContent = 'Rp ' + grand.toLocaleString('id-ID');
    const sBox = document.getElementById('status-live');
    sBox.textContent = total > 0 ? `🛍️ ${qty} item` : 'EMPTY CART';
    sBox.className = total > 0 ? 'status-box status-unpaid' : 'status-box';

    document.getElementById('sidebar-cart-list').onclick = e => {
      if (e.target.classList.contains('remove-item')) {
        const id = e.target.dataset.id, v = e.target.dataset.variant;
        const idx = cart.findIndex(i => i.id === id && i.variant === v);
        if (idx > -1) {
          cart.splice(idx, 1); SC(cart);
          document.getElementById(id).checked = false;
          renderSidebar();
          toast(`🗑️ ${P[id].n} (${v}) dihapus`);
        }
      }
    };
  }

  window.addToCart = function(id) {
    const stock = GS(id);
    const qty = parseInt(document.getElementById('qty-' + id).value) || 1;
    const variant = (document.getElementById('var-' + id)?.value) || 'Standard';
    if (stock < qty) { toast('Stok tidak cukup!'); return; }
    const exists = cart.find(i => i.id === id && i.variant === variant);
    if (exists) {
      if (exists.qty + qty > stock) { toast('Stok tidak cukup'); return; }
      exists.qty += qty;
    } else {
      cart.push({ id, name: P[id].n, price: P[id].p, variant, qty: qty });
    }
    SC(cart);
    document.getElementById(id).checked = true;
    renderSidebar();
    toast(`✓ ${qty} ${variant} ditambahkan`);
  };

  window.searchFn = () => {
    const val = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.p-item').forEach(el => el.style.display = el.dataset.name.includes(val) ? 'block' : 'none');
  };

  document.querySelectorAll('.btn-deskripsi').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.dataset.id, p = P[id];
      alert(`📋 ${p.n}\nHarga: Rp ${p.p.toLocaleString()}\nStok: ${GS(id)}\nVarian: ${p.v.join(', ')}\n\n${p.d}`);
    });
  });

  // Slider gambar
  for (let id in P) {
    const imgs = P[id].i;
    if (imgs.length <= 1) continue;
    const img = document.getElementById('img-' + id);
    const left = document.querySelector(`.slider-left[data-id="${id}"]`);
    const right = document.querySelector(`.slider-right[data-id="${id}"]`);
    if (!img || !left || !right) continue;
    let idx = 0;
    left.onclick = e => { e.stopPropagation(); e.preventDefault(); idx = (idx - 1 + imgs.length) % imgs.length; img.src = imgs[idx]; };
    right.onclick = e => { e.stopPropagation(); e.preventDefault(); idx = (idx + 1) % imgs.length; img.src = imgs[idx]; };
  }

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (!cart.length) { toast('Keranjang kosong!'); return; }
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    sessionStorage.setItem('checkoutShipping', document.getElementById('in-kurir').value);
    location.href = 'checkout.html';
  });

  function updateStock() {
    for (let id in P) {
      const span = document.getElementById('stock-' + id);
      if (span) {
        const st = GS(id);
        span.textContent = st > 0 ? `📦 Stok: ${st}` : '❌ Stok Habis';
        span.className = st > 0 ? 'stock-info' : 'stock-info out';
      }
    }
  }

  cart.forEach(item => {
    const cb = document.getElementById(item.id); if (cb) cb.checked = true;
    const q = document.getElementById('qty-' + item.id); if (q) q.value = item.qty;
    const v = document.getElementById('var-' + item.id); if (v) v.value = item.variant;
  });
  updateStock();
  renderSidebar();

  document.querySelectorAll('.qty-input, .variant-select, #in-kurir').forEach(el => el.addEventListener('change', renderSidebar));
}

// === CHECKOUT ===
function initCheckout() {
  const pb = document.getElementById('proceedBtn');
  if (!pb) return;

  const cart = JSON.parse(sessionStorage.getItem('checkoutCart') || '[]');
  const ongkir = parseInt(sessionStorage.getItem('checkoutShipping') || '12000');
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = sub + (sub > 0 ? ongkir : 0);
  let created = false, confirmed = false;

  function renderSummary() {
    const list = document.getElementById('checkout-cart-list');
    if (!cart.length) {
      list.innerHTML = '<p>Keranjang kosong, <a href="nadya.html">belanja dulu</a></p>';
      pb.disabled = true;
      return;
    }
    list.innerHTML = cart.map(i => `<div class="cart-item"><span>${i.name} (${i.variant}) x${i.qty}</span><span>Rp ${(i.price * i.qty).toLocaleString('id-ID')}</span></div>`).join('')
      + `<div class="cart-item"><strong>Ongkir</strong><span>Rp ${ongkir.toLocaleString('id-ID')}</span></div>`;
    document.getElementById('checkout-total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
  }

  pb.addEventListener('click', () => {
    if (created) { toast('Pesanan sudah dibuat'); return; }
    const nama = document.getElementById('fullname').value.trim();
    const hp = document.getElementById('phone').value.trim();
    const alamat = document.getElementById('address').value.trim();
    if (!nama || !hp || !alamat) { toast('Isi data lengkap!'); return; }
    const metode = document.getElementById('paymentMethod').value;
    const kode = 'INV/' + Date.now() + '/' + Math.floor(Math.random() * 1000);

    document.getElementById('receiptData').innerHTML =
      `<p><strong>Kode Bayar:</strong> ${kode}</p>
       <p><strong>Customer:</strong> ${nama}</p><p><strong>HP:</strong> ${hp}</p><p><strong>Alamat:</strong> ${alamat}</p>
       <p><strong>Metode:</strong> ${metode}</p><hr>
       ${cart.map(i => `<div>${i.name} (${i.variant}) x${i.qty} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}</div>`).join('')}<hr>
       <p><strong>Ongkir:</strong> Rp ${ongkir.toLocaleString('id-ID')}</p>
       <p style="font-size:1rem;"><strong>TOTAL:</strong> Rp ${total.toLocaleString('id-ID')}</p>
       <hr><p style="font-size:0.7rem; color: var(--gold);">Tanggal: ${new Date().toLocaleString()}</p>`;
    document.getElementById('paymentInstruction').innerHTML =
      `<strong>💸 Transfer ke:</strong><br>${metode === 'BCA' ? 'BCA 8820-0813-XXXX a/n NA VISUAL' : metode === 'DANA' ? 'DANA/GOPAY : 0812-99XX-XXXX' : 'MANDIRI VA : 123-00-9901-XXXX'}<br><small>Kode Unik: ${kode}</small>`;
    document.getElementById('strukContainer').style.display = 'block';

    const oid = 'ORD' + Date.now();
    const order = {
      id: oid, timestamp: Date.now(), status: 'menunggu_pembayaran', kodePembayaran: kode,
      customer: { nama, phone: hp, alamat, paymentMethod: metode },
      cart, shippingFee: ongkir, total, shippingMethod: 'J&T Express'
    };
    const all = JSON.parse(localStorage.getItem('allOrders') || '[]');
    const idx = all.findIndex(o => o.id === oid);
    if (idx > -1) all[idx] = order; else all.push(order);
    localStorage.setItem('allOrders', JSON.stringify(all));
    sessionStorage.setItem('currentOrderId', oid);
    created = true;
    toast('Silakan transfer sesuai instruksi');
  });

  document.getElementById('confirmPayBtn').addEventListener('click', () => {
    if (confirmed) { toast('Sudah dikonfirmasi'); return; }
    const oid = sessionStorage.getItem('currentOrderId');
    const stocks = LS();
    let ok = true;
    for (let item of cart) {
      if ((stocks[item.id] || 0) < item.qty) { toast(`Stok ${item.name} tidak cukup!`); ok = false; break; }
      stocks[item.id] -= item.qty;
    }
    if (!ok) return;
    SS(stocks);
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('checkoutCart');
    confirmed = true;
    document.getElementById('confirmPayBtn').disabled = true;
    document.getElementById('confirmPayBtn').textContent = '✓ SUDAH DIKONFIRMASI';
    document.getElementById('orderStatusMsg').innerHTML = '<span style="color:green;">✅ Pembayaran diterima! Pesanan akan segera dikirim.</span>';
    toast('Pesanan dikonfirmasi, stok berkurang');
    const orders = JSON.parse(localStorage.getItem('allOrders') || '[]');
    const ord = orders.find(o => o.id == oid);
    if (ord) ord.status = 'diproses';
    localStorage.setItem('allOrders', JSON.stringify(orders));
    setTimeout(() => document.getElementById('orderStatusMsg').innerHTML += '<br>🚚 Sedang dikirim...', 10000);
    setTimeout(() => { document.getElementById('orderStatusMsg').innerHTML += '<br>📦 Pesanan sampai! Terima kasih.'; toast('Pesanan telah diterima!'); }, 15000);
  });

  renderSummary();
  if (!cart.length) { pb.disabled = true; pb.textContent = 'Keranjang Kosong'; }
}

// === DAFTAR PESANAN ===
function initOrderList() {
  const le = document.getElementById('ordersList');
  if (!le) return;

  const LO = () => JSON.parse(localStorage.getItem('allOrders') || '[]');
  const SO = o => localStorage.setItem('allOrders', JSON.stringify(o));

  function renderOrders() {
    const orders = LO().sort((a, b) => b.timestamp - a.timestamp);
    if (!orders.length) {
      le.innerHTML = '<div style="text-align:center;padding:50px;background:white;border-radius:24px;">✨ Belum ada pesanan. <a href="nadya.html" style="color:#bb9b69;">Mulai belanja</a></div>';
      return;
    }
    const statusMap = {
      menunggu_pembayaran: ['status-menunggu', '⏳ Menunggu'],
      diproses: ['status-diproses', '📦 Diproses'],
      dikirim: ['status-dikirim', '🚚 Dikirim'],
      diterima: ['status-diterima', '✅ Diterima'],
      dibatalkan: ['status-dibatalkan', '❌ Dibatalkan']
    };
    le.innerHTML = orders.map(o => {
      const [sc, st] = statusMap[o.status] || ['status-menunggu', o.status];
      const items = o.cart.map(i => `<div class="item-row"><span>${i.name} (${i.variant}) x${i.qty}</span><span>Rp ${(i.price * i.qty).toLocaleString('id-ID')}</span></div>`).join('');
      let btns = '';
      if (o.status === 'menunggu_pembayaran') btns = `<button class="btn btn-proses" data-id="${o.id}" data-action="diproses">✅ Proses</button><button class="btn btn-batal" data-id="${o.id}" data-action="dibatalkan">❌ Batalkan</button>`;
      else if (o.status === 'diproses') btns = `<button class="btn btn-kirim" data-id="${o.id}" data-action="dikirim">📮 Kirim</button><button class="btn btn-batal" data-id="${o.id}" data-action="dibatalkan">❌ Batalkan</button>`;
      else if (o.status === 'dikirim') btns = `<button class="btn btn-terima" data-id="${o.id}" data-action="diterima">📦 Terima</button>`;
      else if (o.status === 'diterima') btns = `<button class="btn btn-disabled" disabled>✔️ Selesai</button>`;
      else if (o.status === 'dibatalkan') btns = `<button class="btn btn-disabled" disabled>❌ Dibatalkan</button>`;
      btns += `<button class="btn btn-batal" data-id="${o.id}" data-action="delete">🗑️ Hapus</button>`;
      return `<div class="order-card">
        <div class="order-header"><span class="order-id">#${o.id}</span><span class="order-date">📅 ${new Date(o.timestamp).toLocaleString('id-ID')}</span><span class="status-badge ${sc}">${st}</span></div>
        <div class="customer-info"><div><strong>👤 ${o.customer.nama}</strong> | 📞 ${o.customer.phone}</div><div>📍 ${o.customer.alamat}</div><div>💳 ${o.customer.paymentMethod}</div>${o.kodePembayaran ? `<div class="kode-bayar">🧾 ${o.kodePembayaran}</div>` : ''}</div>
        <div class="order-items">${items}<div class="order-total">Ongkir: Rp ${o.shippingFee.toLocaleString('id-ID')}<br><span style="font-size:1rem;">💰 Total: Rp ${o.total.toLocaleString('id-ID')}</span></div></div>
        <div class="action-buttons">${btns}</div>
      </div>`;
    }).join('');

    le.addEventListener('click', e => {
      const btn = e.target.closest('.btn');
      if (!btn || btn.disabled) return;
      const oid = btn.dataset.id, act = btn.dataset.action;
      if (act === 'delete') {
        if (confirm('Yakin hapus pesanan ini?')) { SO(LO().filter(o => o.id != oid)); renderOrders(); toast('🗑️ Pesanan dihapus'); }
        return;
      }
      const orders = LO();
      const order = orders.find(o => o.id == oid);
      if (!order) return;
      if (act === 'dibatalkan' && (order.status === 'dikirim' || order.status === 'diterima')) { toast('Tidak bisa dibatalkan'); return; }
      if (act === 'diterima' && order.status !== 'dikirim') { toast('Pesanan belum dikirim'); return; }
      if (act === 'diproses' && order.status !== 'menunggu_pembayaran') { toast('Hanya bisa diproses jika menunggu pembayaran'); return; }
      if (act === 'dikirim' && order.status !== 'diproses') { toast('Pesanan harus diproses dulu'); return; }
      order.status = act;
      SO(orders);
      renderOrders();
      toast(`✅ Status #${oid} menjadi ${act.toUpperCase()}`);
    });
  }
  renderOrders();
}

// === INISIALISASI ===
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  initShop();
  initCheckout();
  initOrderList();
});