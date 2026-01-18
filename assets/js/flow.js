const STORE = {
  set(k,v){ sessionStorage.setItem(k, JSON.stringify(v)); },
  get(k, fallback=null){
    const raw = sessionStorage.getItem(k);
    if(!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  },
  setStr(k,v){ sessionStorage.setItem(k, v); },
  getStr(k, fallback=""){ return sessionStorage.getItem(k) ?? fallback; }
};

function go(path){ location.href = path; }

function requireKeys(keys, redirect="index.html"){
  for(const k of keys){
    const v = STORE.getStr(k, "");
    if(!v) { location.href = redirect; return false; }
  }
  return true;
}
