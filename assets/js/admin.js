const state = {
  tab: "form",
  form: [],
  confirm: [],
  wheel: { items: [] },
  gifts: { gifts: [] },
  ui: {}
};

async function loadAll(){
  state.form = await fetch("../config/form-fields.json").then(r=>r.json());
  state.confirm = await fetch("../config/confirm-fields.json").then(r=>r.json());
  state.wheel = await fetch("../config/wheel.json").then(r=>r.json());
  state.gifts = await fetch("../config/gifts.json").then(r=>r.json());
  state.ui = await fetch("../config/ui.json").then(r=>r.json());
  render();
}

function setTab(tab){
  state.tab = tab;
  document.querySelectorAll(".tab").forEach(b=>{
    b.classList.toggle("active", b.dataset.tab===tab);
  });
  render();
}

function render(){
  const root = document.getElementById("panel");
  root.innerHTML = "";

  if(state.tab==="form"){
    root.appendChild(title("Bilgi Formu Alanları (İsim/Soyisim/Telefon vb.)"));
    root.appendChild(listEditor(state.form, (arr)=>state.form=arr));
  }

  if(state.tab==="confirm"){
    root.appendChild(title("Onay Ekranı Alanları (1→2→3 sınırsız)"));
    root.appendChild(p("Hediye seçince çıkan onay ekranında kaç alan istersen burada artır/azalt."));
    root.appendChild(listEditor(state.confirm, (arr)=>state.confirm=arr));
  }

  if(state.tab==="wheel"){
    root.appendChild(title("Çark Dilimleri"));
    root.appendChild(p("Label ve ağırlık (weight) düzenle. Weight arttıkça gelme ihtimali artar."));
    root.appendChild(wheelEditor());
  }

  if(state.tab==="gifts"){
    root.appendChild(title("Hediye Listesi"));
    root.appendChild(giftsEditor());
  }

  if(state.tab==="ui"){
    root.appendChild(title("Yazılar / UI"));
    root.appendChild(uiEditor());
  }
}

function title(t){
  const h = document.createElement("div");
  h.style.fontSize="18px";
  h.style.fontWeight="700";
  h.style.marginBottom="10px";
  h.textContent=t;
  return h;
}
function p(t){
  const d=document.createElement("div");
  d.className="small";
  d.textContent=t;
  return d;
}

function listEditor(list, onChange){
  const wrap=document.createElement("div");

  const renderRows=()=>{
    wrap.innerHTML="";
    list.forEach((f, idx)=>{
      const row=document.createElement("div");
      row.className="row";

      const key=i("Key", f.key, v=>{ f.key=v; onChange(list); });
      const label=i("Etiket", f.label, v=>{ f.label=v; onChange(list); });
      const type=i("Tip (text/tel/number)", f.type||"text", v=>{ f.type=v; onChange(list); });

      const req=document.createElement("button");
      req.className="btn";
      req.textContent = f.required ? "Zorunlu" : "Opsiyonel";
      req.style.background = f.required ? "#ffd400" : "rgba(255,255,255,.12)";
      req.style.color = f.required ? "#121212" : "#fff";
      req.onclick=()=>{ f.required=!f.required; onChange(list); renderRows(); };

      const del=document.createElement("button");
      del.className="btn danger";
      del.textContent="Sil";
      del.onclick=()=>{ list.splice(idx,1); onChange(list); renderRows(); };

      row.appendChild(key);
      row.appendChild(label);
      row.appendChild(type);
      row.appendChild(req);

      wrap.appendChild(row);
      wrap.appendChild(del);
      del.style.marginBottom="10px";
      del.style.width="100%";
    });

    const add=document.createElement("button");
    add.className="btn";
    add.textContent="+ Yeni Alan Ekle";
    add.onclick=()=>{
      list.push({ key:"new_field_"+(list.length+1), label:"Yeni Alan", type:"text", required:false });
      onChange(list); renderRows();
    };
    wrap.appendChild(add);
  };

  renderRows();
  return wrap;
}

function wheelEditor(){
  const wrap=document.createElement("div");

  const renderRows=()=>{
    wrap.innerHTML="";
    (state.wheel.items||[]).forEach((it, idx)=>{
      const row=document.createElement("div");
      row.className="row";

      const label=i("Label", it.label, v=>{ it.label=v; });
      const weight=i("Weight", String(it.weight??1), v=>{ it.weight=Number(v||1); });
      const spacer=document.createElement("div");
      spacer.style.opacity=".6";
      spacer.style.display="flex";
      spacer.style.alignItems="center";
      spacer.textContent="";

      const del=document.createElement("button");
      del.className="btn danger";
      del.textContent="Sil";
      del.onclick=()=>{ state.wheel.items.splice(idx,1); renderRows(); };

      row.appendChild(label);
      row.appendChild(weight);
      row.appendChild(spacer);
      row.appendChild(del);
      wrap.appendChild(row);
    });

    const add=document.createElement("button");
    add.className="btn";
    add.textContent="+ Dilim Ekle";
    add.onclick=()=>{
      state.wheel.items.push({ label:"Yeni", weight:1 });
      renderRows();
    };
    wrap.appendChild(add);
  };

  renderRows();
  return wrap;
}

function giftsEditor(){
  const wrap=document.createElement("div");

  const renderRows=()=>{
    wrap.innerHTML="";
    (state.gifts.gifts||[]).forEach((g, idx)=>{
      const row=document.createElement("div");
      row.className="row";

      const id=i("ID", g.id, v=>{ g.id=v; });
      const title=i("Başlık", g.title, v=>{ g.title=v; });
      const spacer=document.createElement("div");
      spacer.style.opacity=".6";
      spacer.style.display="flex";
      spacer.style.alignItems="center";
      spacer.textContent="";

      const del=document.createElement("button");
      del.className="btn danger";
      del.textContent="Sil";
      del.onclick=()=>{ state.gifts.gifts.splice(idx,1); renderRows(); };

      row.appendChild(id);
      row.appendChild(title);
      row.appendChild(spacer);
      row.appendChild(del);
      wrap.appendChild(row);
    });

    const add=document.createElement("button");
    add.className="btn";
    add.textContent="+ Hediye Ekle";
    add.onclick=()=>{
      state.gifts.gifts.push({ id:"gift_"+(state.gifts.gifts.length+1), title:"Yeni Hediye" });
      renderRows();
    };
    wrap.appendChild(add);
  };

  renderRows();
  return wrap;
}

function uiEditor(){
  const wrap=document.createElement("div");
  const keys = Object.keys(state.ui);

  keys.forEach(k=>{
    const row=document.createElement("div");
    row.className="row";
    row.style.gridTemplateColumns="220px 1fr 1fr 1fr";

    const kk = document.createElement("div");
    kk.className="input";
    kk.style.background="rgba(255,255,255,.06)";
    kk.textContent=k;

    const vv = document.createElement("input");
    vv.className="input";
    vv.value=String(state.ui[k] ?? "");
    vv.oninput=()=> state.ui[k]=vv.value;

    const s1=document.createElement("div");
    const s2=document.createElement("div");

    row.appendChild(kk);
    row.appendChild(vv);
    row.appendChild(s1);
    row.appendChild(s2);
    wrap.appendChild(row);
  });

  return wrap;
}

function i(ph, val, oninput){
  const inp=document.createElement("input");
  inp.className="input";
  inp.placeholder=ph;
  inp.value=val ?? "";
  inp.oninput=()=>oninput(inp.value);
  return inp;
}

function download(name, obj){
  const blob = new Blob([JSON.stringify(obj,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Tek tuşla hepsini indir (zip yok, statik tarayıcı kısıtı)
document.getElementById("downloadBtn").addEventListener("click", ()=>{
  download("form-fields.json", state.form);
  download("confirm-fields.json", state.confirm);
  download("wheel.json", state.wheel);
  download("gifts.json", state.gifts);
  download("ui.json", state.ui);
  alert("JSON dosyaları indirildi. /config klasörüne yükle.");
});

document.getElementById("importFile").addEventListener("change", async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  const text = await file.text();
  const json = JSON.parse(text);

  // Kullanıcı hangi JSON'u yüklediyse ona göre basit yönlendirme
  if(Array.isArray(json) && json[0]?.key && json[0]?.label){
    // alan listesi
    const isConfirm = confirm("Bu alanlar ONAY ekranı için mi? (Evet=Onay, Hayır=Bilgi Formu)");
    if(isConfirm) state.confirm = json;
    else state.form = json;
  } else if(json?.items){
    state.wheel = json;
  } else if(json?.gifts){
    state.gifts = json;
  } else {
    state.ui = json;
  }
  render();
  e.target.value="";
});

document.querySelectorAll(".tab").forEach(b=> b.addEventListener("click", ()=>setTab(b.dataset.tab)));

loadAll();
