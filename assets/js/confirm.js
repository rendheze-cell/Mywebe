document.addEventListener("DOMContentLoaded", () => {

  const giftName =
    sessionStorage.getItem("selectedGiftName") || "Hediye";

  const giftText = document.getElementById("giftText");
  if (giftText) {
    giftText.textContent = `Seçtiğin hediye: ${giftName}`;
  }

  const input = document.getElementById("confirmUsername");
  const btn = document.getElementById("confirmBtn");

  // Güvenlik kontrolü
  if (!btn || !input) {
    console.error("Confirm elemanları bulunamadı");
    return;
  }

  // Daha önce girilen isim varsa doldur
  input.value = sessionStorage.getItem("name") || "";

  btn.addEventListener("click", () => {
    const val = input.value.trim();

    if (!val) {
      alert("Lütfen kullanıcı adını gir");
      return;
    }

    // Onaylanan kullanıcı adı
    sessionStorage.setItem("confirmUsername", val);

    // 🚀 LOADING'E GEÇ
    window.location.href = "loading.html";
  });

});
