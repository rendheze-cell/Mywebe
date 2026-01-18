const mount = document.getElementById("formMount");
const btn = document.getElementById("nextBtn");

fetch(`${API_BASE}/config/form-fields.json`)
  .then(r => r.json())
  .then(fields => {
    fields.forEach(f => {
      const wrap = document.createElement("div");
      wrap.className = "field";

      const lab = document.createElement("div");
      lab.className = "label";
      lab.textContent = f.label;

      const inp = document.createElement("input");
      inp.className = "input";
      inp.placeholder = f.placeholder || f.label;
      inp.value = sessionStorage.getItem(f.key) || "";
      inp.addEventListener("input", () => sessionStorage.setItem(f.key, inp.value));

      wrap.appendChild(lab);
      wrap.appendChild(inp);
      mount.appendChild(wrap);
    });

    btn.addEventListener("click", () => {
      // Basit zorunlu kontrol
      for (const f of fields) {
        if (f.required && !((sessionStorage.getItem(f.key) || "").trim())) {
          alert(`${f.label} zorunlu`);
          return;
        }
      }
      location.href = "wheel.html";
    });
  });
