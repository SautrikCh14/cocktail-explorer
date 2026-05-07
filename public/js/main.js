

document.addEventListener("DOMContentLoaded", () => {


  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "/") {
      e.preventDefault();
      document.querySelector(".search-input")?.focus();
    }
  });

  const img = document.querySelector(".card-image");
  if (img) {
    img.addEventListener("error", () => {
      img.style.display = "none";
      const wrap = img.closest(".card-image-wrap");
      if (wrap) {
        wrap.style.display = "flex";
        wrap.style.alignItems = "center";
        wrap.style.justifyContent = "center";
        wrap.style.minHeight = "300px";
        wrap.style.fontSize = "5rem";
        wrap.textContent = "🍹";
      }
    });
  }

});
