async function loadUI() {
  const ui = await fetch("config/ui.json").then(r=>r.json()).catch(()=>null);
  if(!ui) return null;

  // bg.jpg varsa body'ye class ver
  fetch("assets/images/bg.jpg", { method:"HEAD" })
    .then(()=>document.body.classList.add("has-bg"))
    .catch(()=>{});

  const elTitle = document.querySelector("[data-ui='title']");
  const elSubtitle = document.querySelector("[data-ui='subtitle']");
  if(elTitle && ui.brandTitle) elTitle.textContent = ui.brandTitle;
  if(elSubtitle && ui.brandSubtitle) elSubtitle.textContent = ui.brandSubtitle;

  const footerText = ui.footerText || "Powered by PRISMA";
  const footer = document.querySelector(".footer span");
  if(footer) footer.textContent = footerText;

  // Sayfa-özel metinler
  document.querySelectorAll("[data-ui-text]").forEach(el=>{
    const key = el.getAttribute("data-ui-text");
    if(ui[key]) el.textContent = ui[key];
  });

  return ui;
}
