const grid = document.getElementById("giftGrid");

fetch(`${API_BASE}/config/gifts.json`)
  .then(r => r.json())
  .then(gifts => {
    gifts.forEach(g => {
      const item = document.createElement("div");
      item.className = "gift-item";

      item.innerHTML = `
        <div class="gift-left">
          <img src="${g.icon}">
          <span>${g.name}</span>
        </div>
        <div class="gift-arrow">›</div>
      `;

      item.onclick = () => {
        sessionStorage.setItem("selectedGift", g.id);
        sessionStorage.setItem("selectedGiftName", g.name);
        location.href = "confirm.html";   // sonraki adım
      };

      grid.appendChild(item);
    });
  });
