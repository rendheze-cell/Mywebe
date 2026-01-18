const ADMIN_CONFIG_KEY = "prisma_admin_config_v1";

function getAdminConfig(){
  try{
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){
    return null;
  }
}
