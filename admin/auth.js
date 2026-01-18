import { KEYS } from "./storage.js";

const loginView = document.getElementById("loginView");
const appView   = document.getElementById("appView");
const pwInput   = document.getElementById("pw");
const msg       = document.getElementById("authMsg");
const btnLogin  = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

/**
 * Basit (client-side) koruma:
 * - Şifre hash kontrolü
 * - Session localStorage'da
 *
 * ŞİFRE DEĞİŞTİRME:
 * - Aşağıdaki HASH değerini değiştirmek için:
 *   1) Panel aç -> Console'a: await prismaHash("YENISIFRE")
 *   2) çıkan hash'i buraya yapıştır.
 */
const PLAIN_PASSWORD = "1234"; // BURAYA ISTEDIGIN SIFRE
async function checkPassword(input){
  return input === PLAIN_PASSWORD;
}

async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

// Console helper:
window.prismaHash = sha256Hex;

function setSession(){
  localStorage.setItem(KEYS.SESSION, JSON.stringify({
    ok:true,
    at: Date.now()
  }));
}

function clearSession(){
  localStorage.removeItem(KEYS.SESSION);
}

function isSessionValid(){
  const raw = localStorage.getItem(KEYS.SESSION);
  if(!raw) return false;
  try{
    const s = JSON.parse(raw);
    if(!s.ok) return false;
    // 8 saat session
    return (Date.now() - s.at) < (8 * 60 * 60 * 1000);
  }catch{ return false; }
}

function showApp(){
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
}

function showLogin(){
  appView.classList.add("hidden");
  loginView.classList.remove("hidden");
}

if(isSessionValid()) showApp();

btnLogin?.addEventListener("click", async ()=>{
  msg.textContent = "";
  const val = (pwInput.value || "").trim();
  if(!val){ msg.textContent = "Şifre gerekli."; return; }

 const ok = await checkPassword(val);
if(!ok){
  msg.textContent = "Şifre hatalı.";
  return;
}


  setSession();
  showApp();
});

btnLogout?.addEventListener("click", ()=>{
  clearSession();
  location.reload();
});
