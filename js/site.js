(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const cards = document.querySelectorAll("[data-brand]");
  const chips = document.querySelectorAll("[data-filter]");
  const query = document.querySelector("#brand-q");
  const empty = document.querySelector("[data-empty]");
  let group = "all";

  function applyFilter() {
    const term = (query && query.value ? query.value : "").trim().toLowerCase();
    let shown = 0;
    cards.forEach(function (card) {
      const okGroup = group === "all" || card.getAttribute("data-group") === group;
      const okTerm = !term || card.textContent.toLowerCase().indexOf(term) !== -1;
      const on = okGroup && okTerm;
      card.hidden = !on;
      if (on) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      group = chip.getAttribute("data-filter");
      chips.forEach(function (item) { item.classList.toggle("is-on", item === chip); });
      applyFilter();
    });
  });
  if (query) query.addEventListener("input", applyFilter);

  document.querySelectorAll("form[data-visit]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const note = [
        "Lansangan Moto Supply — showroom note",
        "Name: " + data.get("name"),
        "City: " + data.get("city"),
        "Looking for: " + data.get("need"),
        "Budget: " + data.get("budget"),
        "Note: " + (data.get("note") || "None")
      ].join("\n");
      const success = form.parentElement.querySelector(".success");
      const box = success && success.querySelector("textarea");
      if (box) box.value = note;
      form.hidden = true;
      if (success) success.hidden = false;
    });
  });

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      const box = button.closest(".success").querySelector("textarea");
      if (!box) return;
      navigator.clipboard.writeText(box.value).then(function () {
        button.textContent = "Copied";
      });
    });
  });
})();
