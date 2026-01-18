import { readConfig, saveConfig } from "./api.js";

const $ = (s)=>document.querySelector(s);

let CFG = null;

function setStatus(t){ $("#status").textContent = t; }

function switchTab(name){
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active", b.dataset.tab===name));
  document.querySelectorAll("[id^='tab-']").forEach(s=>s.classList.add("hidden"));
  $("#tab-"+name).classList.remove("hidden");
  const titles = {logs:"Loglar",gifts:"Hediye İşlemleri",lang:"Dil Ayarları",wheel:"Çark Ayarları",general:"Genel Ayarlar"};
  $("#pageTitle").textContent = titles[name] || "Admin";
}

document.querySelectorAll(".nav").forEach(b=>{
  b.addEventListener("click", ()=> switchTab(b.dataset.tab));
});

function renderGifts(){
  const box = $("#giftsList");
  box.innerHTML = "";
  CFG.gifts.forEach(g=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <div style="font-weight:900">${g.name}</div>
        <div class="hint">${g.id} • ${g.active ? "aktif" : "pasif"}</div>
      </div>
      <div class="actions">
        <button class="smallbtn ghost" data-act="toggle" data-id="${g.id}">${g.active?"Pasif":"Aktif"}</button>
        <button class="smallbtn danger" data-act="del" data-id="${g.id}">Sil</button>
      </div>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const act = btn.dataset.act;
      const id  = btn.dataset.id;
      const idx = CFG.gifts.findIndex(x=>x.id===id);
      if(idx<0) return;
      if(act==="toggle"){ CFG.gifts[idx].active=!CFG.gifts[idx].active; renderGifts(); }
      if(act==="del"){
        if(!confirm("Hediye silinsin mi?")) return;
        CFG.gifts.splice(idx,1);
        renderGifts();
      }
    });
  });
}

function renderWheel(){
  const box = $("#wheelList");
  box.innerHTML = "";
  CFG.wheel.forEach(w=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <span class="badge" style="background:${w.color};border-color:${w.color};color:#fff">${w.label}</span>
        <span class="hint" style="margin-left:8px">weight: ${w.weight}</span>
      </div>
      <div class="actions">
        <button class="smallbtn danger" data-id="${w.id}">Sil</button>
      </div>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      const idx = CFG.wheel.findIndex(x=>x.id===id);
      if(idx<0) return;
      if(!confirm("Dilim silinsin mi?")) return;
      CFG.wheel.splice(idx,1);
      renderWheel();
    });
  });
}

function fillInputs(){
  // lang
  $("#tConfirmTitle").value = CFG.lang.confirmTitle || "";
  $("#tConfirmSub").value   = CFG.lang.confirmSubPrefix || "";
  $("#tLoad1").value = CFG.lang.load1 || "";
  $("#tLoad2").value = CFG.lang.load2 || "";
  $("#tLoad3").value = CFG.lang.load3 || "";
  $("#tLoad4").value = CFG.lang.load4 || "";
  $("#tDone").value  = CFG.lang.doneText || "";

  // general
  $("#gLoadMs").value  = CFG.general.loadingMs ?? 3500;
  $("#gPowered").value = CFG.general.poweredText ?? "Powered by";
  $("#gLogging").value = CFG.general.logging ?? "on";
}

function applyInputsToCfg(){
  CFG.lang.confirmTitle = $("#tConfirmTitle").value.trim();
  CFG.lang.confirmSubPrefix = $("#tConfirmSub").value.trim();
  CFG.lang.load1 = $("#tLoad1").value.trim();
  CFG.lang.load2 = $("#tLoad2").value.trim();
  CFG.lang.load3 = $("#tLoad3").value.trim();
  CFG.lang.load4 = $("#tLoad4").value.trim();
  CFG.lang.doneText = $("#tDone").value.trim();

  CFG.general.loadingMs = parseInt($("#gLoadMs").value||"3500",10);
  CFG.general.poweredText = $("#gPowered").value.trim() || "Powered by";
  CFG.general.logging = $("#gLogging").value;
}

function uid(prefix){ return `${prefix}_${Date.now()}_${Math.floor(Math.random()*9999)}`; }

$("#btnAddGift").addEventListener("click", ()=>{
  const name = $("#giftName").value.trim();
  const img  = $("#giftImg").value.trim();
  if(!name) return alert("Hediye adı gerekli.");
  CFG.gifts.unshift({ id: uid("gift"), name, image: img, active:true });
  $("#giftName").value=""; $("#giftImg").value="";
  renderGifts();
});

$("#btnAddSlice").addEventListener("click", ()=>{
  const label = $("#wLabel").value.trim();
  const color = $("#wColor").value.trim() || "#3498db";
  const weight = Math.max(1, Math.min(10, parseInt($("#wWeight").value||"1",10)));
  if(!label) return alert("Metin gerekli.");
  CFG.wheel.unshift({ id: uid("w"), label, color, weight });
  $("#wLabel").value=""; $("#wColor").value=""; $("#wWeight").value="1";
  renderWheel();
});

$("#btnSave").addEventListener("click", async ()=>{
  try{
    applyInputsToCfg();
    setStatus("Kaydediliyor...");
    await saveConfig(CFG);
    setStatus("Kaydedildi ✅ (siteye işlendi)");
  }catch(e){
    setStatus("Hata: " + e.message);
    alert(e.message);
  }
});

$("#btnReload").addEventListener("click", async ()=>{
  await boot();
});

async function boot(){
  try{
    setStatus("Config okunuyor...");
    CFG = await readConfig();
    fillInputs();
    renderGifts();
    renderWheel();
    setStatus("Hazır");
  }catch(e){
    setStatus("Hata: " + e.message);
    alert(e.message);
  }
}

switchTab("logs");
boot();
