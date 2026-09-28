(function () {
  if (/\/index\.html$/i.test(location.pathname)) {
    try {
      history.replaceState(null, "", location.pathname.replace(/index\.html$/i, "") + location.search + location.hash);
    } catch (error) {}
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const cards = document.querySelectorAll("[data-brand], [data-cat]");
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

  var productQuery = document.querySelector("#product-q");
  var productEmpty = document.querySelector("[data-product-empty]");

  function filterProducts() {
    if (!productQuery) return;
    var term = productQuery.value.trim().toLowerCase();
    if (chips.length) {
      group = "all";
      chips.forEach(function (item) {
        item.classList.toggle("is-on", item.getAttribute("data-filter") === "all");
      });
      cards.forEach(function (card) { card.hidden = false; card.classList.remove("is-hidden"); });
    }
    var shown = 0;
    var first = null;
    document.querySelectorAll(".product-stack").forEach(function (stack) {
      var on = !term || stack.textContent.toLowerCase().indexOf(term) !== -1;
      stack.hidden = !on;
      stack.classList.toggle("is-hidden", !on);
      if (on) {
        shown += 1;
        if (!first) first = stack;
      }
    });
    document.querySelectorAll("[data-cat]").forEach(function (section) {
      if (!term) {
        section.classList.remove("is-hidden");
        return;
      }
      var stacks = section.querySelectorAll(".product-stack");
      if (!stacks.length) {
        var textHit = section.textContent.toLowerCase().indexOf(term) !== -1;
        section.hidden = !textHit;
        section.classList.toggle("is-hidden", !textHit);
        return;
      }
      var any = false;
      stacks.forEach(function (stack) { if (!stack.hidden) any = true; });
      section.hidden = !any;
      section.classList.toggle("is-hidden", !any);
    });
    if (!term) applyFilter();
    if (productEmpty) productEmpty.hidden = !term || shown !== 0;
    if (term && first) first.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (productQuery) {
    productQuery.addEventListener("input", filterProducts);
    productQuery.addEventListener("keyup", filterProducts);
    productQuery.addEventListener("search", filterProducts);
    var preset = new URLSearchParams(location.search).get("q");
    if (preset) {
      productQuery.value = preset;
      filterProducts();
    }
  }

  var bikeButtons = document.querySelectorAll("[data-bike]");
  var fitItems = document.querySelectorAll("[data-fits]");
  var bikeTitle = document.querySelector("[data-bike-title]");
  var bikePrompt = document.querySelector("[data-bike-prompt]");
  var bikeEmpty = document.querySelector("[data-bike-empty]");
  var cleanBlock = document.querySelector("[data-clean]");
  var commuter = {
    "honda-wave": 1, "honda-xrm": 1, "honda-tmx": 1, "yamaha-sniper": 1,
    "suzuki-raider": 1, "suzuki-smash-110": 1, "suzuki-smash-115": 1,
    "kawasaki-barako": 1, "kawasaki-ct": 1, "motorstar": 1, "rusi": 1, "skygo": 1,
    "honda-beat": 1, "honda-click": 1, "honda-airblade": 1, "honda-pcx": 1, "honda-adv": 1,
    "yamaha-mio": 1, "yamaha-aerox": 1, "yamaha-nmax": 1, "yamaha-xmax": 1,
    "suzuki-burgman": 1, "suzuki-address": 1, "vespa": 1, "piaggio": 1, "sym": 1, "kymco": 1,
    "fkm-venture": 1, "fkm-hunter": 1, "fkm-ranger": 1, "fkm-mtx": 1, "fkm-slick": 1, "fkm-fyro": 1
  };

  function showBike(id, label) {
    if (!id) return;
    bikeButtons.forEach(function (button) {
      button.classList.toggle("is-on", button.getAttribute("data-bike") === id);
    });
    var parts = 0;
    fitItems.forEach(function (item) {
      var tokens = (item.getAttribute("data-fits") || "").split(/\s+/);
      var isClean = tokens.indexOf("clean") !== -1;
      var match = tokens.indexOf(id) !== -1 || (tokens.indexOf("commuter") !== -1 && commuter[id]);
      item.hidden = !(isClean || match);
      if (match && !isClean) parts += 1;
    });
    if (bikeTitle) bikeTitle.textContent = "Parts for the " + label;
    if (bikePrompt) bikePrompt.hidden = true;
    var riderNote = document.querySelector("[data-rider-note]");
    if (riderNote) riderNote.hidden = false;
    if (bikeEmpty) bikeEmpty.hidden = parts !== 0;
    if (cleanBlock) cleanBlock.hidden = false;
    var panel = document.querySelector("#for-this-bike");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  bikeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-bike");
      showBike(id, button.getAttribute("data-label") || button.textContent);
      try { history.replaceState(null, "", "#" + id); } catch (error) {}
    });
  });

  if (bikeButtons.length) {
    var start = document.querySelector('[data-bike="' + location.hash.replace("#", "") + '"]');
    if (start) showBike(start.getAttribute("data-bike"), start.getAttribute("data-label"));
  }
})();
