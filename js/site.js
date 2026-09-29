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
    var facts = document.querySelector("[data-bike-facts]");
    var library = window.KURBADA_BIKES || {};
    var note = library[id] || {
      about: label + " is a name that covers more than one year. The badge alone is not enough to order a part.",
      specs: [["Class", "Read the group on this page"], ["Engine", "Use the displacement on the engine case or the OR/CR."], ["Fitment", "Match the year before a bolt, tire, or panel."]],
      price: "Kurbada does not sell this motorcycle and does not publish a price for it. A dealer quote changes with the year, the variant, and any promo.",
      more: "Helmets and riding kit are on the accessories page. They fit the rider."
    };
    if (facts) {
      facts.hidden = false;
      var about = facts.querySelector("[data-facts-about]");
      var price = facts.querySelector("[data-facts-price]");
      var more = facts.querySelector("[data-facts-more]");
      var list = facts.querySelector("[data-facts-specs]");
      if (about) about.textContent = note.about;
      if (price) price.textContent = note.price;
      if (more) more.textContent = note.more;
      if (list) {
        list.textContent = "";
        (note.specs || []).forEach(function (pair) {
          var dt = document.createElement("dt");
          var dd = document.createElement("dd");
          dt.textContent = pair[0];
          dd.textContent = pair[1];
          list.appendChild(dt);
          list.appendChild(dd);
        });
      }
    }
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

  var bikeQuery = document.querySelector("#bike-q");
  var bikeSearchEmpty = document.querySelector("[data-bike-search-empty]");

  function filterBikes() {
    if (!bikeQuery) return;
    var term = bikeQuery.value.trim().toLowerCase();
    var shown = 0;
    bikeButtons.forEach(function (button) {
      var label = (button.getAttribute("data-label") || button.textContent || "").toLowerCase();
      var on = !term || label.indexOf(term) !== -1;
      button.hidden = !on;
      button.classList.toggle("is-hidden", !on);
      if (on) shown += 1;
    });
    document.querySelectorAll(".bike-grid").forEach(function (grid) {
      var section = grid.closest("section");
      if (!section) return;
      var any = false;
      grid.querySelectorAll("[data-bike]").forEach(function (button) {
        if (!button.hidden) any = true;
      });
      var hide = !!term && !any;
      section.hidden = hide;
      section.classList.toggle("is-hidden", hide);
    });
    if (bikeSearchEmpty) bikeSearchEmpty.hidden = !term || shown !== 0;
  }

  if (bikeQuery) {
    bikeQuery.addEventListener("input", filterBikes);
    bikeQuery.addEventListener("keyup", filterBikes);
    bikeQuery.addEventListener("search", filterBikes);
  }

  document.querySelectorAll(".card-gallery").forEach(function (gallery) {
    var dragged = false;
    gallery.addEventListener("pointerdown", function () { dragged = false; });
    gallery.addEventListener("scroll", function () { dragged = true; });
    gallery.addEventListener("click", function (event) {
      if (!dragged) return;
      event.preventDefault();
      dragged = false;
    });
    gallery.addEventListener("wheel", function (event) {
      if (gallery.scrollWidth <= gallery.clientWidth + 1) return;
      var max = gallery.scrollWidth - gallery.clientWidth;
      if (event.deltaY > 0 && gallery.scrollLeft >= max - 1) return;
      if (event.deltaY < 0 && gallery.scrollLeft <= 0) return;
      gallery.scrollLeft += event.deltaY;
      event.preventDefault();
    }, { passive: false });
  });
})();
