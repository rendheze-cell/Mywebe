export const API_READ = "../api/config_read.php";
export const API_SAVE = "../api/config_save.php";

// Admin token: bunu değiştir (auth.php ile aynı olmalı)
export const ADMIN_TOKEN = "PRISMA_ADMIN_2026_SECRET";


export async function readConfig() {
  const r = await fetch(API_READ, { cache: "no-store" });
  if (!r.ok) throw new Error("Config okunamadı: " + r.status);
  return await r.json();
}

export async function saveConfig(cfg) {
  const r = await fetch(API_SAVE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": ADMIN_TOKEN
    },
    body: JSON.stringify(cfg)
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.ok) throw new Error(j.error || ("Kaydetme hatası: " + r.status));
  return true;
}
