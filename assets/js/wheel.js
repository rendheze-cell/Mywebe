const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

let items = [];
let angle = 0;
let spinning = false;

/* Kullanıcı adı üstte görünsün */
const name = (sessionStorage.getItem("name") || "").trim();
const surname = (sessionStorage.getItem("surname") || "").trim();
document.getElementById("playerName").textContent =
  (name || surname) ? `${name} ${surname}`.trim() : "Seppo Äijälä";

/* Çark verisi */
fetch(`${API_BASE}/config/wheel.json`)
  .then(r => r.json())
  .then(d => {
    items = d;
    draw();
  });

function draw(){
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy) - 10;

  ctx.clearRect(0, 0, w, h);

  const count = items.length;
  const slice = (Math.PI * 2) / count;

  for(let i = 0; i < count; i++){
    const start = angle + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = `hsl(${(i * 360) / count}, 65%, 52%)`;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Poppins, Arial";
    ctx.fillText(items[i], r - 22, 6);
    ctx.restore();
  }

  /* Orta göbek */
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd200";
  ctx.fill();
}

function getResult(){
  const slice = (Math.PI * 2) / items.length;
  const normalized = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
  const index = Math.floor(normalized / slice);
  return items[index];
}

spinBtn.addEventListener("click", () => {
  if(spinning || items.length < 2) return;

  spinning = true;
  let velocity = Math.random() * 0.25 + 0.35;
  const friction = 0.985;
  const stopSpeed = 0.003;

  function animate(){
    angle += velocity;
    velocity *= friction;
    draw();

    if(velocity <= stopSpeed){
      spinning = false;

      const result = getResult();
      sessionStorage.setItem("wheelResult", result);

      /* ALERT YOK – AKIŞ DEVAM */
      location.href = "gift.html";
      return;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
