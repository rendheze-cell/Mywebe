import { getConfig, setConfig, getLogs, setLogs, exportAll, importAll } from "./storage.js";

const $ = (s)=>document.querySelector(s);

const tabs = ["logs","gifts","lang","wheel","general"];

function switchTab(tab){
  tabs.forEach(t=>{
    const el = $("#tab-"+t);
    if(!el) return;
    el.classList.toggle("hidden", t!==tab);
  });
  document.querySelectorAll(".nav-item").forEach(b=>{
    b.classList.toggle("active", b.dataset.tab===tab);
  });
}

document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.addEventListener("click", ()=> switchTab(btn.dataset.tab));
});

const cfg = ()=> getConfig();

/* ---------- LOGS ---------- */
function renderLogs(){
  const logs = getLogs().slice().reverse();
  const q = ($("#logSearch")?.value || "").trim().toLowerCase();
  const tbody = $("#logsTbody");
  if(!tbody) return;
  tbody.innerHTML = "";

  const filtered = !q ? logs : logs.filter(l=>{
    const blob = `${l.time||""} ${l.event||""} ${l.name||""} ${l.phone||""} ${l.wheel||""} ${l.gift||""}`.toLowerCase();
    return blob.includes(q);
  });

  filtered.forEach(l=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.time || "-"}</td>
      <td><span class="badge">${l.event || "-"}</span></td>
      <td>${l.name || "-"}</td>
      <td>${l.phone || "-"}</td>
      <td>${l.wheel || "-"}</td>
      <td>${l.gift || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

$("#logSearch")?.addEventListener("input", renderLogs);

$("#btnClearLogs")?.addEventListener("click", ()=>{
  if(!confirm("Loglar silinsin mi?")) return;
  setLogs([]);
  renderLogs();
});

/* ---------- GIFTS ---------- */
function uid(prefix){ return `${prefix}_${Date.now()}_${Math.floor(Math.random()*9999)}`; }

function renderGifts(){
  const c = cfg();
  const box = $("#giftsList");
  if(!box) return;
  box.innerHTML = "";

  c.gifts.forEach(g=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div class="item-left">
        <img class="thumb" src="${g.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiByeD0iMTAiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2RkZCIvPjwvc3ZnPg=="}" />
        <div>
          <div style="font-weight:900">${g.name}</div>
          <div class="hint">${g.id} • ${g.active ? "aktif" : "pasif"}</div>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn ghost" data-act="toggle" data-id="${g.id}">${g.active ? "Pasif" : "Aktif"}</button>
        <button class="btn danger" data-act="del" data-id="${g.id}">Sil</button>
      </div>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button").forEach(b=>{
    const act = b.dataset.act;
    const id  = b.dataset.id;
    b.addEventListener("click", ()=>{
      const c = cfg();
      const idx = c.gifts.findIndex(x=>x.id===id);
      if(idx<0) return;

      if(act==="toggle"){
        c.gifts[idx].active = !c.gifts[idx].active;
        setConfig(c);
        renderGifts();
      }
      if(act==="del"){
        if(!confirm("Hediye silinsin mi?")) return;
        c.gifts.splice(idx,1);
        setConfig(c);
        renderGifts();
      }
    });
  });
}

async function fileToBase64(file){
  return new Promise((res, rej)=>{
    const fr = new FileReader();
    fr.onload = ()=> res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

$("#btnAddGift")?.addEventListener("click", async ()=>{
  const name = ($("#giftName")?.value || "").trim();
  const url  = ($("#giftImgUrl")?.value || "").trim();
  const file = $("#giftImgFile")?.files?.[0];

  if(!name) return alert("Hediye adı gerekli.");

  let img = url || "";
  if(file){
    img = await fileToBase64(file);
  }

  const c = cfg();
  c.gifts.unshift({ id: uid("gift"), name, image: img, active: true });
  setConfig(c);

  $("#giftName").value = "";
  $("#giftImgUrl").value = "";
  $("#giftImgFile").value = "";

  renderGifts();
});

/* ---------- LANG ---------- */
function loadLangIntoInputs(){
  const l = cfg().lang;
  $("#tConfirmTitle").value = l.confirmTitle || "";
  $("#tConfirmSub").value   = l.confirmSubPrefix || "";
  $("#tLoad1").value = l.load1 || "";
  $("#tLoad2").value = l.load2 || "";
  $("#tLoad3").value = l.load3 || "";
  $("#tLoad4").value = l.load4 || "";
  $("#tDone").value  = l.doneText || "";
}

$("#btnSaveLang")?.addEventListener("click", ()=>{
  const c = cfg();
  c.lang.confirmTitle = $("#tConfirmTitle").value.trim();
  c.lang.confirmSubPrefix = $("#tConfirmSub").value.trim();
  c.lang.load1 = $("#tLoad1").value.trim();
  c.lang.load2 = $("#tLoad2").value.trim();
  c.lang.load3 = $("#tLoad3").value.trim();
  c.lang.load4 = $("#tLoad4").value.trim();
  c.lang.doneText = $("#tDone").value.trim();
  setConfig(c);
  alert("Dil ayarları kaydedildi.");
});

/* ---------- WHEEL ---------- */
function renderWheel(){
  const c = cfg();
  const box = $("#wheelList");
  if(!box) return;
  box.innerHTML = "";

  c.wheel.forEach(w=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div class="item-left">
        <div class="badge" style="background:${w.color}; border-color:${w.color}; color:#fff;">${w.label}</div>
        <div class="hint">weight: ${w.weight} • ${w.id}</div>
      </div>
      <div class="item-actions">
        <button class="btn danger" data-act="del" data-id="${w.id}">Sil</button>
      </div>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button[data-act='del']").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.dataset.id;
      const c = cfg();
      const idx = c.wheel.findIndex(x=>x.id===id);
      if(idx<0) return;
      if(!confirm("Dilim silinsin mi?")) return;
      c.wheel.splice(idx,1);
      setConfig(c);
      renderWheel();
    });
  });
}

$("#btnAddSlice")?.addEventListener("click", ()=>{
  const label = ($("#wLabel")?.value || "").trim();
  const color = ($("#wColor")?.value || "").trim() || "#3498db";
  const weight = parseInt($("#wWeight")?.value || "1", 10);

  if(!label) return alert("Metin gerekli.");

  const c = cfg();
  c.wheel.unshift({ id: uid("w"), label, color, weight: Math.min(10, Math.max(1, weight || 1)) });
  setConfig(c);

  $("#wLabel").value = "";
  $("#wColor").value = "";
  $("#wWeight").value = "1";

  renderWheel();
});

/* ---------- GENERAL ---------- */
function loadGeneral(){
  const g = cfg().general;
  $("#gLoadMs").value = g.loadingMs ?? 3500;
  $("#gPowered").value = g.poweredText ?? "Powered by";
  $("#gLogging").value = g.logging ?? "on";
}

$("#btnSaveGeneral")?.addEventListener("click", ()=>{
  const c = cfg();
  c.general.loadingMs = parseInt($("#gLoadMs").value || "3500", 10);
  c.general.poweredText = $("#gPowered").value.trim() || "Powered by";
  c.general.logging = $("#gLogging").value;
  setConfig(c);
  alert("Genel ayarlar kaydedildi.");
});

$("#btnResetAll")?.addEventListener("click", ()=>{
  if(!confirm("Tüm ayarlar sıfırlansın mı?")) return;
  localStorage.removeItem("prisma_admin_config_v1");
  localStorage.removeItem("prisma_site_logs_v1");
  location.reload();
});

/* ---------- EXPORT / IMPORT ---------- */
$("#btnExport")?.addEventListener("click", ()=>{
  const data = exportAll();
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "prisma-admin-export.json";
  a.click();
});

$("#importFile")?.addEventListener("change", async (e)=>{
  const f = e.target.files?.[0];
  if(!f) return;
  const text = await f.text();
  try{
    const obj = JSON.parse(text);
    importAll(obj);
    alert("Import tamam.");
    boot();
  }catch{
    alert("Import dosyası geçersiz JSON.");
  }finally{
    e.target.value = "";
  }
});

/* ---------- BOOT ---------- */
function boot(){
  renderLogs();
  renderGifts();
  loadLangIntoInputs();
  renderWheel();
  loadGeneral();
}

boot();
switchTab("logs");
