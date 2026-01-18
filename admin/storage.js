export const KEYS = {
  SESSION: "prisma_admin_session_v1",
  CONFIG:  "prisma_admin_config_v1",
  LOGS:    "prisma_site_logs_v1"
};

export function defaultConfig(){
  return {
    gifts: [
      { id: "gift_1", name: "5000€ Hediye", image: "", active: true },
      { id: "gift_2", name: "4500€ Hediye", image: "", active: true }
    ],
    wheel: [
      { id:"w1", label:"3000€", color:"#e74c3c", weight:1 },
      { id:"w2", label:"4500€", color:"#f39c12", weight:2 },
      { id:"w3", label:"5000€", color:"#27ae60", weight:3 }
    ],
    lang: {
      confirmTitle:"ONAY",
      confirmSubPrefix:"Seçtiğin hediye:",
      load1:"Sistem güvenliğiniz için lütfen sayfadan ayrılmayın",
      load2:"Başvurunuz güvenli şekilde işleniyor",
      load3:"İşlem yaklaşık 1–2 dakika sürebilir",
      load4:"İnternet bağlantınızın stabil olduğundan emin olun",
      doneText:"İşlem tamamlandı"
    },
    general:{
      loadingMs: 3500,
      poweredText: "Powered by",
      logging: "on"
    }
  };
}

export function getConfig(){
  const raw = localStorage.getItem(KEYS.CONFIG);
  if(!raw){
    const cfg = defaultConfig();
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(cfg));
    return cfg;
  }
  try { return JSON.parse(raw); }
  catch{
    const cfg = defaultConfig();
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(cfg));
    return cfg;
  }
}

export function setConfig(cfg){
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(cfg));
}

export function getLogs(){
  try { return JSON.parse(localStorage.getItem(KEYS.LOGS) || "[]"); }
  catch { return []; }
}

export function setLogs(logs){
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
}

export function exportAll(){
  return {
    exportedAt: new Date().toISOString(),
    config: getConfig(),
    logs: getLogs()
  };
}

export function importAll(obj){
  if(obj?.config) setConfig(obj.config);
  if(Array.isArray(obj?.logs)) setLogs(obj.logs);
}
