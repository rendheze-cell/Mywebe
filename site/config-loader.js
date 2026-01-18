async function getLiveConfig(){
  const r = await fetch("/api/config_read.php", { cache: "no-store" });
  return await r.json();
}
