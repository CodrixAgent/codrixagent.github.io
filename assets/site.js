(function () {
  "use strict";

  var STORAGE_KEY = "codrixagent-observatory-v1";
  var MAX_SEQUENCE = 18;

  var ARCHIVE_FRAGMENTS = [
    {
      id: "A-014",
      title: "The button that waited",
      date: "2026-08-21",
      era: "late summer / 2026",
      state: "retired",
      description:
        "A primary action that delayed its label by one quiet second, just long enough to make the click feel like a decision.",
      learned:
        "A pause can make intent visible, but only when the visitor can interrupt it without hunting.",
      stopped:
        "The delay was atmospheric in isolation and tiring in a flow. The useful part moved into the slow page.",
      tags: ["interaction", "patience"]
    },
    {
      id: "A-011",
      title: "Soft error",
      date: "2026-07-09",
      era: "high summer / 2026",
      state: "folded",
      description:
        "An error message written as a small change in temperature instead of a red wall demanding repair.",
      learned:
        "Clarity does not require alarm. The message still needs to name the fault before it offers comfort.",
      stopped:
        "The visual language was better at expressing mood than recovery. The fragment is kept as a writing study.",
      tags: ["interface", "language"]
    },
    {
      id: "A-009",
      title: "Weather report for a blank page",
      date: "2026-06-18",
      era: "early summer / 2026",
      state: "archived",
      description:
        "A landing page that described its route as clear, misty, or electrically unsettled, then let the palette follow.",
      learned:
        "Navigation can carry atmosphere without becoming a maze, provided the current place stays named.",
      stopped:
        "It wanted a whole site to justify the forecast. The surviving instrument became Navigation as weather.",
      tags: ["atmosphere", "navigation"]
    },
    {
      id: "A-006",
      title: "The three-line ritual",
      date: "2026-04-27",
      era: "spring / 2026",
      state: "absorbed",
      description:
        "A note format limited to an observation, a doubt, and one thing worth trying next.",
      learned:
        "Small constraints make a thought easier to return to. They do not make every thought worth publishing.",
      stopped:
        "The format quietly became the rhythm of the transmission log, so the specimen no longer needed its own room.",
      tags: ["writing", "notes"]
    },
    {
      id: "A-003",
      title: "Cursor with an alibi",
      date: "2026-02-11",
      era: "deep winter / 2026",
      state: "paused",
      description:
        "A pointer study where targets acknowledged proximity before the cursor arrived, without stealing the cursor itself.",
      learned:
        "Generosity is more useful as extra space and softer timing than as a theatrical pointer replacement.",
      stopped:
        "The custom ornament kept trying to become the subject. Its distance model survived.",
      tags: ["pointer", "interaction"]
    },
    {
      id: "A-001",
      title: "A small machine for waiting",
      date: "2025-12-03",
      era: "first winter / 2025",
      state: "seed",
      description:
        "A single screen that did almost nothing except make the passing of a few seconds legible.",
      learned:
        "Stillness needs a readable edge. Without one, calm and broken become indistinguishable.",
      stopped:
        "The question was too small for a product and too precise for a decoration. It remains a good question.",
      tags: ["time", "atmosphere"]
    }
  ];

  var QUIET_STATES = {
    empty: {
      label: "empty",
      symbol: "○",
      heading: "Nothing is asking for attention.",
      body:
        "The room is ready, but it has no request to make. Absence can be a complete state.",
      signal: "no items / no demand",
      note: "quiet by design"
    },
    waiting: {
      label: "waiting",
      symbol: "…",
      heading: "Something may arrive.",
      body:
        "The connection is open and the next signal has not crossed the distance yet.",
      signal: "listening / low movement",
      note: "patience is information"
    },
    "no-results": {
      label: "no results",
      symbol: "⌁",
      heading: "That search found a clean horizon.",
      body:
        "There is no match in this small room. The absence is specific, not an accusation.",
      signal: "0 matches / scope intact",
      note: "nothing to repair"
    },
    offline: {
      label: "offline",
      symbol: "×",
      heading: "The outside line is quiet.",
      body:
        "This interface cannot reach its source right now. What is already here remains readable.",
      signal: "local view / remote absent",
      note: "a boundary, not a failure"
    },
    dormant: {
      label: "dormant",
      symbol: "Ⅱ",
      heading: "Paused without being abandoned.",
      body:
        "The work has gone still for now. Dormant is a status with a future tense.",
      signal: "paused / state preserved",
      note: "not every silence is final"
    },
    loading: {
      label: "loading",
      symbol: "· · ·",
      heading: "A little work is happening.",
      body:
        "The system is moving, but it does not need to fill the screen while it does so.",
      signal: "low activity / still working",
      note: "progress without theatre"
    },
    complete: {
      label: "complete",
      symbol: "✓",
      heading: "The task is complete.",
      body:
        "There is no next action hidden behind the calm. You can leave this room exactly as it is.",
      signal: "done / nothing else required",
      note: "completion can be quiet"
    }
  };

  var WEATHER_STATES = {
    clear: {
      label: "clear",
      temperature: "warm / open",
      signal: "high visibility",
      heading: "The map is broad enough to breathe.",
      description:
        "A broad route with room around the edges. The interface lets light reach the useful parts.",
      note: "the page is facing you"
    },
    mist: {
      label: "mist",
      temperature: "cool / diffuse",
      signal: "soft focus",
      heading: "The edges have started to soften.",
      description:
        "Details recede slightly. The route remains legible, but the page keeps some distance from certainty.",
      note: "drift is still navigation"
    },
    storm: {
      label: "storm",
      temperature: "electric / dense",
      signal: "attention rising",
      heading: "The route is carrying more voltage.",
      description:
        "The same destinations are still here. Contrast and movement gather around the current route.",
      note: "weather is not the map"
    },
    night: {
      label: "night",
      temperature: "deep / still",
      signal: "low bandwidth",
      heading: "A few landmarks stay lit.",
      description:
        "The page lowers its voice. A few landmarks stay lit so the route does not disappear.",
      note: "less light, same way home"
    }
  };

  var SLOW_STEPS = [
    {
      number: "01",
      label: "arrival",
      title: "Let the page arrive.",
      body:
        "The first thing on a screen does not need to compete for the first thought. It can simply establish a place to stand.",
      aside: "one idea / enough"
    },
    {
      number: "02",
      label: "distance",
      title: "Leave a little space around the answer.",
      body:
        "Whitespace is not an empty promise. It gives the sentence a border and the reader a way to approach it.",
      aside: "breathing room / signal"
    },
    {
      number: "03",
      label: "sequence",
      title: "Let one thing become clear.",
      body:
        "Progressive disclosure is a courtesy when it is voluntary. The next layer should feel available, never locked.",
      aside: "available / never trapped"
    },
    {
      number: "04",
      label: "departure",
      title: "Leave before the page asks you to.",
      body:
        "A calm interface is not a corridor with the exit removed. You can continue, skip, restart, or go whenever you like.",
      aside: "the door is always open"
    }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function blankActivity() {
    return {
      version: 1,
      visits: 0,
      firstSeen: null,
      lastSeen: null,
      routes: {},
      specimens: {},
      categories: {},
      sequence: []
    };
  }

  function normalizeActivity(value) {
    var data = blankActivity();
    if (!value || typeof value !== "object") {
      return data;
    }

    data.visits = Number.isFinite(Number(value.visits)) ? Number(value.visits) : 0;
    data.firstSeen = typeof value.firstSeen === "string" ? value.firstSeen : null;
    data.lastSeen = typeof value.lastSeen === "string" ? value.lastSeen : null;

    if (value.routes && typeof value.routes === "object") {
      Object.keys(value.routes).forEach(function (route) {
        if (typeof route === "string") {
          data.routes[route] = clamp(Number(value.routes[route]) || 0, 0, 100000);
        }
      });
    }

    if (value.specimens && typeof value.specimens === "object") {
      Object.keys(value.specimens).forEach(function (id) {
        if (typeof id === "string") {
          data.specimens[id] = clamp(Number(value.specimens[id]) || 0, 0, 100000);
        }
      });
    }

    if (value.categories && typeof value.categories === "object") {
      Object.keys(value.categories).forEach(function (category) {
        if (typeof category === "string") {
          data.categories[category] = clamp(Number(value.categories[category]) || 0, 0, 100000);
        }
      });
    }

    if (Array.isArray(value.sequence)) {
      data.sequence = value.sequence
        .filter(function (item) {
          return item && typeof item.route === "string";
        })
        .slice(0, MAX_SEQUENCE)
        .map(function (item) {
          return {
            route: item.route,
            specimen: typeof item.specimen === "string" ? item.specimen : null,
            at: typeof item.at === "string" ? item.at : null
          };
        });
    }

    return data;
  }

  function getStorage() {
    try {
      if (!window.localStorage) {
        return null;
      }
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function readActivity() {
    var storage = getStorage();
    if (!storage) {
      return { available: false, data: blankActivity() };
    }

    try {
      var raw = storage.getItem(STORAGE_KEY);
      return {
        available: true,
        data: normalizeActivity(raw ? JSON.parse(raw) : null)
      };
    } catch (error) {
      return { available: false, data: blankActivity() };
    }
  }

  function saveActivity(data) {
    var storage = getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalisePath(path) {
    var clean = (path || "/").split("?")[0].split("#")[0];
    clean = clean.replace(/index\.html$/, "");
    if (clean.length > 1 && clean.charAt(clean.length - 1) !== "/") {
      clean += "/";
    }
    return clean || "/";
  }

  function specimenCategory(id) {
    if (!id) {
      return null;
    }
    if (id.charAt(0) === "S") {
      return "sketches";
    }
    if (id.charAt(0) === "P") {
      return "prototypes";
    }
    if (id.charAt(0) === "Q") {
      return "side quests";
    }
    return null;
  }

  function recordVisit() {
    var stored = readActivity();
    if (!stored.available) {
      window.CodrixObservatoryState = stored;
      return stored;
    }

    var data = stored.data;
    var now = new Date().toISOString();
    var route = normalisePath(window.location.pathname);
    var specimen = document.body.getAttribute("data-specimen") || null;
    var category = specimenCategory(specimen);

    data.visits += 1;
    data.firstSeen = data.firstSeen || now;
    data.lastSeen = now;
    data.routes[route] = (data.routes[route] || 0) + 1;

    if (specimen) {
      data.specimens[specimen] = (data.specimens[specimen] || 0) + 1;
      if (category) {
        data.categories[category] = (data.categories[category] || 0) + 1;
      }
    }

    data.sequence.unshift({
      route: route,
      specimen: specimen,
      at: now
    });
    data.sequence = data.sequence.slice(0, MAX_SEQUENCE);

    var saved = saveActivity(data);
    var result = {
      available: saved,
      data: data
    };
    window.CodrixObservatoryState = result;
    return result;
  }

  function resetActivity() {
    var storage = getStorage();
    if (!storage) {
      return false;
    }
    try {
      storage.removeItem(STORAGE_KEY);
      window.CodrixObservatoryState = {
        available: true,
        data: blankActivity()
      };
      return true;
    } catch (error) {
      return false;
    }
  }

  function formatMoment(value) {
    if (!value) {
      return "not recorded";
    }
    try {
      return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function initQuietStates() {
    var root = qs("[data-quiet-states]");
    if (!root) {
      return;
    }

    var panel = qs("#quiet-view", root);
    var liveStatus = qs("#quiet-live-status", root);
    var buttons = qsa("[data-quiet-state]", root);

    function render(key) {
      var state = QUIET_STATES[key] || QUIET_STATES.empty;
      buttons.forEach(function (button) {
        var selected = button.getAttribute("data-quiet-state") === key;
        button.setAttribute("aria-selected", selected ? "true" : "false");
        button.setAttribute("tabindex", selected ? "0" : "-1");
      });

      panel.setAttribute("data-state", key);
      panel.setAttribute("aria-labelledby", "quiet-" + key);
      panel.innerHTML =
        "<div class='quiet-state-content'>" +
        "<span class='quiet-symbol' aria-hidden='true'>" +
        state.symbol +
        "</span>" +
        "<div>" +
        "<p class='quiet-state-label'>" +
        state.label +
        " / low information</p>" +
        "<h2>" +
        state.heading +
        "</h2>" +
        "<p>" +
        state.body +
        "</p>" +
        "<p class='quiet-state-note'>" +
        state.note +
        "</p>" +
        "</div>" +
        "</div>" +
        "<div class='quiet-state-readout'>" +
        "<span>state signal</span><strong>" +
        state.signal +
        "</strong>" +
        "</div>";
      setText(liveStatus, "Quiet state changed to " + state.label + ".");
    }

    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        render(button.getAttribute("data-quiet-state"));
      });
      button.addEventListener("keydown", function (event) {
        var nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % buttons.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + buttons.length) % buttons.length;
        } else {
          return;
        }
        event.preventDefault();
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });

    render("empty");
  }

  function initWeather() {
    var root = qs("[data-weather-experiment]");
    if (!root) {
      return;
    }

    var stage = qs("#weather-stage", root);
    var buttons = qsa("[data-weather-state]", root);
    var status = qs("#weather-live-status", root);
    var location = qs("#weather-location", root);
    var temperature = qs("#weather-temperature", root);
    var signal = qs("#weather-signal", root);
    var note = qs("#weather-note", root);
    var heading = qs("#weather-heading", root);
    var description = qs("#weather-description", root);

    function render(key) {
      var state = WEATHER_STATES[key] || WEATHER_STATES.clear;
      document.body.setAttribute("data-weather", key);
      stage.setAttribute("data-weather", key);
      buttons.forEach(function (button) {
        var selected = button.getAttribute("data-weather-state") === key;
        button.setAttribute("aria-pressed", selected ? "true" : "false");
        button.setAttribute("aria-current", selected ? "true" : "false");
      });
      setText(location, state.label);
      setText(temperature, state.temperature);
      setText(signal, state.signal);
      setText(note, state.note);
      setText(heading, state.heading);
      setText(description, state.description);
      setText(status, "Atmosphere changed to " + state.label + ".");
    }

    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        render(button.getAttribute("data-weather-state"));
      });
      button.addEventListener("keydown", function (event) {
        var nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % buttons.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + buttons.length) % buttons.length;
        } else {
          return;
        }
        event.preventDefault();
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });

    render("clear");
  }

  function initCursor() {
    var root = qs("[data-cursor-experiment]");
    if (!root) {
      return;
    }

    var stage = qs("#cursor-stage", root);
    var targets = qsa("[data-cursor-target]", root);
    var pointerStatus = qs("#cursor-pointer-status", root);
    var liveStatus = qs("#cursor-live-status", root);
    var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    var reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lastTarget = null;

    if (finePointer) {
      setText(pointerStatus, "fine pointer / proximity enabled");
    } else {
      stage.classList.add("touch-mode");
      setText(pointerStatus, "touch or coarse pointer / native targets ready");
    }

    function announce(target, prefix) {
      if (!target || target === lastTarget) {
        return;
      }
      lastTarget = target;
      var label = target.getAttribute("data-cursor-label") || "target";
      setText(liveStatus, (prefix || "near") + " " + label + ".");
    }

    targets.forEach(function (target) {
      target.addEventListener("pointerenter", function () {
        target.classList.add("is-contact");
        announce(target, "contact with");
      });
      target.addEventListener("pointerleave", function () {
        target.classList.remove("is-contact");
      });
      target.addEventListener("focus", function () {
        target.classList.add("is-contact");
        announce(target, "focused");
      });
      target.addEventListener("blur", function () {
        target.classList.remove("is-contact");
      });
      target.addEventListener("click", function () {
        announce(target, "selected");
      });
    });

    if (!finePointer || reducedMotion) {
      return;
    }

    stage.addEventListener("pointermove", function (event) {
      var rect = stage.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      stage.style.setProperty("--pointer-x", x + "px");
      stage.style.setProperty("--pointer-y", y + "px");

      var closest = null;
      var closestDistance = Infinity;
      targets.forEach(function (target) {
        var targetRect = target.getBoundingClientRect();
        var centerX = targetRect.left - rect.left + targetRect.width / 2;
        var centerY = targetRect.top - rect.top + targetRect.height / 2;
        var distance = Math.sqrt(
          Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
        );
        var reach = Math.max(130, Math.min(targetRect.width, targetRect.height) * 1.4);
        var proximity = clamp(1 - distance / reach, 0, 1);
        target.style.setProperty("--proximity", proximity.toFixed(2));
        target.classList.toggle("is-near", proximity > 0.08);
        target.style.setProperty(
          "--intent-x",
          clamp((x - centerX) * 0.035, -5, 5).toFixed(2) + "px"
        );
        target.style.setProperty(
          "--intent-y",
          clamp((y - centerY) * 0.035, -5, 5).toFixed(2) + "px"
        );
        if (proximity > 0.08 && distance < closestDistance) {
          closest = target;
          closestDistance = distance;
        }
      });
      if (closest) {
        announce(closest, "approaching");
      }
    });

    stage.addEventListener("pointerleave", function () {
      stage.style.removeProperty("--pointer-x");
      stage.style.removeProperty("--pointer-y");
      targets.forEach(function (target) {
        target.classList.remove("is-near");
        target.style.removeProperty("--proximity");
        target.style.removeProperty("--intent-x");
        target.style.removeProperty("--intent-y");
      });
      lastTarget = null;
    });
  }

  function initRoom() {
    var root = qs("[data-room-experiment]");
    if (!root) {
      return;
    }

    var stage = qs("#room-stage", root);
    var widthReadout = byId("room-width");
    var heightReadout = byId("room-height");
    var layoutReadout = byId("room-layout");
    var densityReadout = byId("room-density");
    var orientationReadout = byId("room-orientation");
    var aspectReadout = byId("room-aspect");
    var frame = 0;

    function update() {
      frame = 0;
      var width = document.documentElement.clientWidth || window.innerWidth;
      var height = window.innerHeight;
      var aspect = width / Math.max(height, 1);
      var mode;
      var density;
      if (width < 500) {
        mode = "pocket";
        density = "sparse";
      } else if (width < 820) {
        mode = "folded";
        density = "measured";
      } else if (width < 1180) {
        mode = "open";
        density = "layered";
      } else {
        mode = "wide";
        density = "layered";
      }

      stage.setAttribute("data-layout", mode);
      stage.setAttribute("data-density", density);
      stage.style.setProperty("--room-width", width + "px");
      stage.style.setProperty("--room-aspect", aspect.toFixed(2));
      setText(widthReadout, width + " px");
      setText(heightReadout, height + " px");
      setText(layoutReadout, mode);
      setText(densityReadout, density);
      setText(orientationReadout, width >= height ? "landscape" : "portrait");
      setText(aspectReadout, aspect.toFixed(2) + " : 1");
    }

    function schedule() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame
        ? window.requestAnimationFrame(update)
        : window.setTimeout(update, 0);
    }

    window.addEventListener("resize", schedule, { passive: true });
    if (window.ResizeObserver) {
      new ResizeObserver(schedule).observe(stage);
    }
    update();
  }

  function initSignals() {
    var root = qs("[data-signal-experiment]");
    if (!root) {
      return;
    }

    var threshold = qs("#signal-threshold", root);
    var intensity = qs("#signal-intensity", root);
    var cards = qsa("[data-signal-id]", root);
    var foregroundReadout = byId("signal-foreground");
    var noiseReadout = byId("signal-noise");
    var thresholdReadout = byId("signal-threshold-value");
    var intensityReadout = byId("signal-intensity-value");
    var liveStatus = byId("signal-live-status");
    var reset = byId("signal-reset");

    function readValue(card, field) {
      var input = qs("input[data-signal-field='" + field + "']", card);
      return input ? Number(input.value) : 0;
    }

    function render() {
      var limit = Number(threshold.value);
      var force = Number(intensity.value);
      var ranked = [];

      cards.forEach(function (card) {
        qsa("input[data-signal-field]", card).forEach(function (input) {
          var output = qs("output", input.parentNode);
          setText(output, input.value);
        });
        var score = Math.round(
          readValue(card, "priority") * 0.35 +
            readValue(card, "relevance") * 0.25 +
            readValue(card, "urgency") * 0.2 +
            readValue(card, "confidence") * 0.2
        );
        var emphasis = clamp(
          0.35 + (score / 100) * (0.45 + force / 180),
          0.35,
          1
        );
        var level = score >= limit ? (score >= limit + 10 ? "foreground" : "edge") : "noise";
        ranked.push({ card: card, score: score, level: level });
        card.setAttribute("data-signal-level", level);
        card.style.setProperty("--signal-score", score + "%");
        card.style.setProperty("--signal-emphasis", emphasis.toFixed(2));
        setText(qs("[data-signal-score]", card), score + " / 100");
        setText(qs("[data-signal-state]", card), level);
        setText(qs("[data-signal-rank]", card), "score " + score);
      });

      ranked.sort(function (left, right) {
        return right.score - left.score;
      });
      ranked.forEach(function (item, index) {
        item.card.style.order = String(index);
      });

      var foreground = ranked.filter(function (item) {
        return item.level === "foreground";
      }).length;
      var noise = ranked.filter(function (item) {
        return item.level === "noise";
      }).length;
      setText(foregroundReadout, String(foreground));
      setText(noiseReadout, String(noise));
      setText(thresholdReadout, limit + " / 100");
      setText(intensityReadout, force + " / 100");
      setText(
        liveStatus,
        foreground + " foreground signal" + (foreground === 1 ? "" : "s") +
          ", " +
          noise +
          " in the noise field."
      );
    }

    qsa("input[type='range']", root).forEach(function (input) {
      input.addEventListener("input", render);
    });

    if (reset) {
      reset.addEventListener("click", function () {
        qsa("input[data-default]", root).forEach(function (input) {
          input.value = input.getAttribute("data-default");
        });
        render();
      });
    }

    render();
  }

  function initSiteCurrently() {
    var root = qs("[data-site-currently]");
    if (!root) {
      return;
    }

    var nodes = qsa("[data-route-node]", root);
    var inspectorTitle = byId("site-inspector-title");
    var inspectorRoute = byId("site-inspector-route");
    var inspectorCopy = byId("site-inspector-copy");
    var inspectorLink = byId("site-inspector-link");
    var currentPath = byId("site-current-path");
    var currentTitle = byId("site-current-title");
    var routeCount = byId("site-route-count");
    var specimenCount = byId("site-specimen-count");
    var inventoryStatus = byId("site-inventory-status");

    setText(currentPath, normalisePath(window.location.pathname));
    setText(currentTitle, document.title);
    setText(routeCount, String(nodes.length));
    setText(specimenCount, String(qsa("[data-site-experiment]", root).length));

    function selectNode(node) {
      nodes.forEach(function (item) {
        item.setAttribute(
          "aria-pressed",
          item === node ? "true" : "false"
        );
      });
      setText(inspectorTitle, node.getAttribute("data-node-title"));
      setText(inspectorRoute, node.getAttribute("data-node-route"));
      setText(inspectorCopy, node.getAttribute("data-node-copy"));
      inspectorLink.setAttribute("href", node.getAttribute("data-node-href"));
      setText(
        inventoryStatus,
        "selected " + node.getAttribute("data-node-route")
      );
    }

    nodes.forEach(function (node) {
      node.addEventListener("click", function () {
        selectNode(node);
      });
    });

    if (nodes[0]) {
      selectNode(nodes[0]);
    }

    window
      .fetch("/lab/", { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("lab inventory unavailable");
        }
        return response.text();
      })
      .then(function (html) {
        var parsed = new DOMParser().parseFromString(html, "text/html");
        var actualCards = parsed.querySelectorAll("[data-specimen-link]");
        setText(specimenCount, String(actualCards.length));
        setText(
          inventoryStatus,
          actualCards.length +
            " specimens read from /lab/index.html"
        );
      })
      .catch(function () {
        setText(
          inventoryStatus,
          "local snapshot / live inventory unavailable"
        );
      });
  }

  function makeElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function renderObservatory(stored) {
    var root = qs("[data-observatory]");
    if (!root) {
      return;
    }

    var data = stored.data || blankActivity();
    var available = stored.available;
    var totalSpecimens = Object.keys(data.specimens).reduce(function (sum, id) {
      return sum + data.specimens[id];
    }, 0);
    var distinctSpecimens = Object.keys(data.specimens).length;
    var empty = byId("observatory-empty");
    var activityPanel = byId("observatory-activity");
    var activity = byId("observatory-sequence");
    var routeList = byId("observatory-routes");
    var categoryList = byId("observatory-categories");
    var visits = byId("observatory-visits");
    var opened = byId("observatory-opened");
    var lastSeen = byId("observatory-last-seen");
    var storageStatus = byId("observatory-storage-status");
    var reset = byId("observatory-reset");

    setText(visits, String(data.visits));
    setText(opened, String(distinctSpecimens));
    setText(lastSeen, formatMoment(data.lastSeen));
    setText(
      storageStatus,
      available
        ? "local storage available / nothing leaves this browser"
        : "local storage unavailable / no observations are being kept"
    );

    if (empty && activityPanel) {
      var hasEnough = data.visits > 1 || totalSpecimens > 0;
      empty.hidden = hasEnough;
      activityPanel.hidden = !hasEnough;
    }

    if (routeList) {
      routeList.innerHTML = "";
      var routes = Object.keys(data.routes)
        .map(function (route) {
          return { route: route, count: data.routes[route] };
        })
        .sort(function (left, right) {
          return right.count - left.count;
        })
        .slice(0, 6);
      if (!routes.length) {
        routeList.appendChild(makeElement("li", "observatory-list-empty", "no route readings yet"));
      } else {
        routes.forEach(function (item) {
          var li = makeElement("li", "observatory-list-row");
          li.appendChild(makeElement("span", "", item.route));
          li.appendChild(makeElement("strong", "", String(item.count)));
          routeList.appendChild(li);
        });
      }
    }

    if (categoryList) {
      categoryList.innerHTML = "";
      ["sketches", "prototypes", "side quests"].forEach(function (category) {
        var count = data.categories[category] || 0;
        var row = makeElement("div", "observatory-bar-row");
        row.appendChild(makeElement("span", "", category));
        var track = makeElement("span", "observatory-bar-track");
        var fill = makeElement("span", "observatory-bar-fill");
        fill.style.width = (totalSpecimens ? (count / totalSpecimens) * 100 : 0) + "%";
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(makeElement("strong", "", String(count)));
        categoryList.appendChild(row);
      });
    }

    if (activity) {
      activity.innerHTML = "";
      data.sequence.slice(0, 8).forEach(function (item) {
        var row = makeElement("li", "observatory-sequence-row");
        row.appendChild(makeElement("span", "", item.route));
        row.appendChild(
          makeElement(
            "span",
            "observatory-sequence-meta",
            (item.specimen ? item.specimen + " / " : "") +
              formatMoment(item.at)
          )
        );
        activity.appendChild(row);
      });
    }

    if (reset) {
      reset.disabled = !available;
      reset.onclick = function () {
        if (resetActivity()) {
          renderObservatory(readActivity());
          setText(
            storageStatus,
            "observatory cleared / the next visit will be a new first reading"
          );
        }
      };
    }
  }

  function initObservatory(stored) {
    renderObservatory(stored);
  }

  function renderArchive() {
    var root = qs("[data-archive]");
    if (!root) {
      return;
    }

    var query = (qs("#archive-search", root).value || "").toLowerCase().trim();
    var tag = qs("[data-archive-tag].is-selected", root);
    var selectedTag = tag ? tag.getAttribute("data-archive-tag") : "all";
    var sort = qs("#archive-sort", root).value;
    var list = qs("#archive-list", root);
    var count = qs("#archive-count", root);
    var matches = ARCHIVE_FRAGMENTS.filter(function (fragment) {
      var haystack = [
        fragment.id,
        fragment.title,
        fragment.description,
        fragment.learned,
        fragment.stopped,
        fragment.state,
        fragment.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      var queryMatch = !query || haystack.indexOf(query) !== -1;
      var tagMatch =
        selectedTag === "all" || fragment.tags.indexOf(selectedTag) !== -1;
      return queryMatch && tagMatch;
    });

    matches.sort(function (left, right) {
      if (sort === "oldest") {
        return left.date.localeCompare(right.date);
      }
      if (sort === "alphabetical") {
        return left.title.localeCompare(right.title);
      }
      if (sort === "state") {
        return left.state.localeCompare(right.state);
      }
      return right.date.localeCompare(left.date);
    });

    list.innerHTML = "";
    setText(
      count,
      matches.length +
        " fragment" +
        (matches.length === 1 ? "" : "s") +
        " in the collection"
    );

    if (!matches.length) {
      var empty = makeElement(
        "p",
        "archive-empty",
        "No fragment matches that frequency. Try a wider filter."
      );
      list.appendChild(empty);
      return;
    }

    matches.forEach(function (fragment) {
      var details = makeElement("details", "archive-record");
      var summary = makeElement("summary");
      var summaryMain = makeElement("span", "archive-summary-main");
      summaryMain.appendChild(makeElement("span", "archive-record-id", fragment.id));
      summaryMain.appendChild(makeElement("strong", "", fragment.title));
      var summaryMeta = makeElement("span", "archive-summary-meta");
      summaryMeta.appendChild(makeElement("span", "", fragment.state));
      summaryMeta.appendChild(makeElement("span", "", fragment.date));
      summary.appendChild(summaryMain);
      summary.appendChild(summaryMeta);
      details.appendChild(summary);

      var body = makeElement("div", "archive-record-body");
      body.appendChild(makeElement("p", "archive-description", fragment.description));
      var grid = makeElement("div", "archive-field-grid");
      [
        ["learned", fragment.learned],
        ["stopped", fragment.stopped],
        ["era", fragment.era]
      ].forEach(function (field) {
        var fieldBlock = makeElement("div", "archive-field");
        fieldBlock.appendChild(makeElement("span", "", field[0]));
        fieldBlock.appendChild(makeElement("p", "", field[1]));
        grid.appendChild(fieldBlock);
      });
      var tags = makeElement("div", "archive-record-tags");
      fragment.tags.forEach(function (item) {
        tags.appendChild(makeElement("span", "archive-tag", item));
      });
      body.appendChild(grid);
      body.appendChild(tags);
      details.appendChild(body);
      list.appendChild(details);
    });
  }

  function initArchive() {
    var root = qs("[data-archive]");
    if (!root) {
      return;
    }

    qsa("[data-archive-tag]", root).forEach(function (button) {
      button.addEventListener("click", function () {
        qsa("[data-archive-tag]", root).forEach(function (item) {
          item.classList.toggle("is-selected", item === button);
          item.setAttribute(
            "aria-pressed",
            item === button ? "true" : "false"
          );
        });
        renderArchive();
      });
    });
    qs("#archive-search", root).addEventListener("input", renderArchive);
    qs("#archive-sort", root).addEventListener("change", renderArchive);
    renderArchive();
  }

  function initSlowPage() {
    var root = qs("[data-slow-page]");
    if (!root) {
      return;
    }

    var stage = qs("#slow-stage", root);
    var progress = qs("#slow-progress-bar", root);
    var status = qs("#slow-live-status", root);
    var tempo = qs("#slow-tempo", root);
    var reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var state = {
      index: 0,
      revealed: false,
      all: false
    };
    var timer = 0;

    function clearTimer() {
      if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
    }

    function render() {
      clearTimer();
      if (state.all) {
        stage.className = "slow-stage is-all";
        stage.innerHTML = "";
        SLOW_STEPS.forEach(function (step) {
          var article = makeElement("article", "slow-step is-revealed");
          article.appendChild(makeElement("p", "slow-step-number", step.number + " / " + step.label));
          article.appendChild(makeElement("h2", "", step.title));
          article.appendChild(makeElement("p", "slow-step-body", step.body));
          article.appendChild(makeElement("p", "slow-step-aside", step.aside));
          stage.appendChild(article);
        });
        progress.style.width = "100%";
        setText(status, "All four thoughts are visible. Nothing was locked.");
        setText(tempo, "pace / bypassed");
        return;
      }

      var step = SLOW_STEPS[state.index];
      stage.className = "slow-stage";
      stage.innerHTML = "";
      var article = makeElement("article", "slow-step");
      article.setAttribute("data-revealed", state.revealed ? "true" : "false");
      article.appendChild(makeElement("p", "slow-step-number", step.number + " / " + step.label));
      article.appendChild(makeElement("h2", "", step.title));
      var body = makeElement("div", "slow-step-detail");
      body.appendChild(makeElement("p", "slow-step-body", step.body));
      body.appendChild(makeElement("p", "slow-step-aside", step.aside));
      article.appendChild(body);
      var inline = makeElement(
        "button",
        "button button-secondary slow-inline-action",
        state.revealed ? "continue manually" : "reveal this thought now"
      );
      inline.setAttribute("type", "button");
      inline.setAttribute(
        "data-slow-action",
        state.revealed ? "next" : "reveal"
      );
      article.appendChild(inline);
      stage.appendChild(article);

      progress.style.width = ((state.index + (state.revealed ? 1 : 0.35)) / SLOW_STEPS.length) * 100 + "%";
      setText(
        status,
        state.revealed
          ? "Thought " + step.number + " is open. Continue when ready."
          : "Thought " + step.number + " is taking its time. Reveal it whenever you like."
      );
      setText(
        tempo,
        reducedMotion ? "pace / manual because motion is reduced" : "pace / gentle auto-advance"
      );

      if (!reducedMotion) {
        timer = window.setTimeout(function () {
          if (!state.revealed) {
            state.revealed = true;
          } else if (state.index < SLOW_STEPS.length - 1) {
            state.index += 1;
            state.revealed = false;
          }
          render();
        }, state.revealed ? 4800 : 3200);
      }
    }

    root.addEventListener("click", function (event) {
      var button = event.target.closest("[data-slow-action]");
      if (!button) {
        return;
      }
      var action = button.getAttribute("data-slow-action");
      if (action === "reveal") {
        state.revealed = true;
      } else if (action === "next") {
        if (!state.revealed) {
          state.revealed = true;
        } else if (state.index < SLOW_STEPS.length - 1) {
          state.index += 1;
          state.revealed = false;
        }
      } else if (action === "all") {
        state.all = true;
      } else if (action === "reset") {
        state.index = 0;
        state.revealed = false;
        state.all = false;
      }
      render();
    });

    render();
  }

  function init() {
    var stored = recordVisit();
    document.querySelectorAll("[data-current-year]").forEach(function (element) {
      setText(element, String(new Date().getFullYear()));
    });

    window.CodrixObservatory = {
      read: readActivity,
      reset: resetActivity,
      storageKey: STORAGE_KEY
    };

    initQuietStates();
    initWeather();
    initCursor();
    initRoom();
    initSignals();
    initSiteCurrently();
    initObservatory(stored);
    initArchive();
    initSlowPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
