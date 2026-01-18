const STORAGE_KEY="prisma_users_v1";

function addUser(data){
 let users=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
 users.unshift(data);
 localStorage.setItem(STORAGE_KEY,JSON.stringify(users));
}

function updateStatus(type){
 let users=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
 if(!users[0])return;
 users[0].status=type;
 users[0][type+"At"]=new Date().toLocaleString("tr-TR");
 localStorage.setItem(STORAGE_KEY,JSON.stringify(users));
}
