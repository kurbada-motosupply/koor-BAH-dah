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
    "suzuki-burgman": 1, "suzuki-address": 1, "vespa": 1, "piaggio": 1, "sym": 1, "kymco": 1
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
