(function () {
  var fig = document.querySelector("[data-bloch]");
  if (!fig) return;
  var NS = "http://www.w3.org/2000/svg";
  var LOOP = 6.0, RADIUS = 216, DRAW_SPEED = 154;
  var loops = parseInt(fig.getAttribute("data-loops") || "3", 10);
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var az = 38 * Math.PI / 180, el = 23 * Math.PI / 180;
  var right = [Math.cos(az), Math.sin(az), 0];
  var up = [-Math.sin(az) * Math.sin(el), Math.cos(az) * Math.sin(el), Math.cos(el)];
  var front = [right[1] * up[2] - right[2] * up[1], right[2] * up[0] - right[0] * up[2], right[0] * up[1] - right[1] * up[0]];
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function proj(p) { return [dot(p, right), -dot(p, up), dot(p, front)]; }
  function r3(x) { return Math.round(x * 1000) / 1000; }
  function make(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  var strokes = [], i, t;
  var q = [];
  for (i = 0; i < 145; i++) { t = Math.PI / 4 + 2 * Math.PI * i / 144; q.push([-0.49 + 0.17 * Math.cos(t), 0.01 + 0.25 * Math.sin(t)]); }
  strokes.push(q);
  strokes.push([[-0.48, -0.13], [-0.29, -0.31]]);
  strokes.push([[-0.18, 0.26], [0.18, 0.26]]);
  strokes.push([[0.0, 0.26], [0.0, -0.26]]);
  strokes.push([[0.29, -0.26], [0.29, 0.26], [0.49, -0.055], [0.69, 0.26], [0.69, -0.26]]);
  strokes = strokes.map(function (s) { return s.map(function (p) { return [p[0] * 1.15, -p[1] * 1.18]; }); });
  var cum = strokes.map(function (s) {
    var c = [0];
    for (var j = 1; j < s.length; j++) c.push(c[j - 1] + Math.hypot(s[j][0] - s[j - 1][0], s[j][1] - s[j - 1][1]));
    return c;
  });
  function along(k, frac) {
    var s = strokes[k], c = cum[k], d = Math.min(1, Math.max(0, frac)) * c[c.length - 1], j = 1;
    while (j < c.length - 1 && c[j] < d) j++;
    var a = (d - c[j - 1]) / ((c[j] - c[j - 1]) || 1);
    return [s[j - 1][0] + (s[j][0] - s[j - 1][0]) * a, s[j - 1][1] + (s[j][1] - s[j - 1][1]) * a];
  }
  function lerp(a, b, e) { return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e]; }

  var segs = [], clock = 0;
  function seg(o, dur) { o.start = clock; o.end = clock + dur; clock += dur; segs.push(o); }
  var first = strokes[0][0], prev = first;
  seg({ kind: "idle", tip: first }, 0.4);
  strokes.forEach(function (s, k) {
    if (k) seg({ kind: "travel", a: prev, b: s[0], done: k }, 0.2);
    seg({ kind: "draw", k: k }, cum[k][cum[k].length - 1] * RADIUS / DRAW_SPEED);
    prev = s[s.length - 1];
  });
  seg({ kind: "hold", tip: prev }, 1.85);
  seg({ kind: "fade", a: prev, b: first }, 0.85);
  seg({ kind: "idle", tip: first }, 0.2);
  var scale = LOOP / clock;
  segs.forEach(function (s) { s.start *= scale; s.end *= scale; });
  var POSTER = segs.filter(function (s) { return s.kind === "hold"; })[0].start + 0.5;

  var svg = make("svg", { viewBox: "-125 -116 250 232", role: "img", "aria-label": fig.getAttribute("data-label") || "Animation of a qubit state vector writing QTM on the Bloch sphere" });
  var defs = make("defs", {}, svg);
  var grad = make("radialGradient", { id: "bl-shade", cx: "0.42", cy: "0.38", r: "0.7" }, defs);
  make("stop", { offset: "0", "class": "bl-shade-0" }, grad);
  make("stop", { offset: "1", "class": "bl-shade-1" }, grad);
  var world = make("g", { transform: "scale(100)" }, svg);
  make("circle", { cx: 0, cy: 0, r: 1, fill: "url(#bl-shade)" }, world);
  var back = make("g", { "class": "bl-grid bl-back" }, world);
  var frontG = make("g", { "class": "bl-grid bl-front" }, world);
  var curves = [], n = 120, lat, lon;
  [-60, -30, 0, 30, 60].forEach(function (d) {
    lat = d * Math.PI / 180;
    var c = [];
    for (var j = 0; j <= n; j++) { t = 2 * Math.PI * j / n; c.push([Math.cos(lat) * Math.cos(t), Math.cos(lat) * Math.sin(t), Math.sin(lat)]); }
    curves.push(c);
  });
  for (i = 0; i < 6; i++) {
    lon = Math.PI * i / 6;
    var c2 = [];
    for (var j2 = 0; j2 <= n; j2++) { t = 2 * Math.PI * j2 / n; c2.push([Math.cos(t) * Math.cos(lon), Math.cos(t) * Math.sin(lon), Math.sin(t)]); }
    curves.push(c2);
  }
  var dBack = "", dFront = "";
  curves.forEach(function (c) {
    var pts = c.map(proj), prevFront = null;
    for (var j = 0; j < pts.length - 1; j++) {
      var a = pts[j], b = pts[j + 1], isFront = a[2] >= 0;
      var piece = (prevFront === isFront ? "" : "M" + r3(a[0]) + " " + r3(a[1])) + "L" + r3(b[0]) + " " + r3(b[1]);
      if (isFront) dFront += piece; else dBack += piece;
      prevFront = isFront;
    }
  });
  make("path", { d: dBack, "vector-effect": "non-scaling-stroke" }, back);
  make("path", { d: dFront, "vector-effect": "non-scaling-stroke" }, frontG);
  make("circle", { cx: 0, cy: 0, r: 1, "class": "bl-rim", "vector-effect": "non-scaling-stroke" }, world);
  var axes = make("g", { "class": "bl-axis" }, world);
  [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function (ax) {
    var a = proj(ax.map(function (v) { return -1.045 * v; })), b = proj(ax.map(function (v) { return 1.045 * v; }));
    make("line", { x1: r3(a[0]), y1: r3(a[1]), x2: r3(b[0]), y2: r3(b[1]), "vector-effect": "non-scaling-stroke" }, axes);
  });
  var north = proj([0, 0, 1]), south = proj([0, 0, -1]);
  [north, south].forEach(function (p) { make("circle", { cx: r3(p[0]), cy: r3(p[1]), r: 0.022, "class": "bl-pole" }, world); });
  var l0 = make("text", { x: r3(north[0] * 100), y: r3((north[1] - 0.075) * 100), "font-size": 14, "class": "bl-label", "text-anchor": "middle" }, svg);
  l0.textContent = "|0⟩";
  var l1 = make("text", { x: r3(south[0] * 100), y: r3((south[1] + 0.16) * 100), "font-size": 14, "class": "bl-label", "text-anchor": "middle" }, svg);
  l1.textContent = "|1⟩";

  var traceG = make("g", { "class": "bl-traces" }, world);
  var paths = strokes.map(function (s) {
    var d = s.map(function (p, j) { return (j ? "L" : "M") + r3(p[0]) + " " + r3(p[1]); }).join("");
    var glow = make("path", { d: d, pathLength: 1, "class": "bl-glow", "stroke-width": 0.075 }, traceG);
    var line = make("path", { d: d, pathLength: 1, "class": "bl-trace", "stroke-width": 0.032 }, traceG);
    return [glow, line];
  });
  var vec = make("g", { "class": "bl-vector" }, world);
  var shaft = make("line", { x1: 0, y1: 0, x2: 0, y2: 0, "stroke-width": 0.016 }, vec);
  var head = make("polygon", { points: "0,0 0,0 0,0" }, vec);
  var halo = make("circle", { r: 0.055, "class": "bl-halo" }, vec);
  var tipDot = make("circle", { r: 0.024, "class": "bl-tip" }, vec);
  make("circle", { cx: 0, cy: 0, r: 0.018, "class": "bl-origin" }, world);

  function setStroke(k, mode, frac) {
    paths[k].forEach(function (p) {
      p.style.visibility = mode === "hidden" ? "hidden" : "visible";
      p.style.strokeDashoffset = mode === "full" ? 0 : 1 - frac;
    });
  }
  function render(time) {
    var s = segs[segs.length - 1];
    for (var j = 0; j < segs.length; j++) if (time >= segs[j].start && time < segs[j].end) { s = segs[j]; break; }
    var p = Math.min(1, Math.max(0, (time - s.start) / (s.end - s.start)));
    var e = p * p * (3 - 2 * p), full = 0, current = -1, tip, opacity = 1;
    if (s.kind === "draw") { full = s.k; current = s.k; tip = along(s.k, p); }
    else if (s.kind === "travel") { full = s.done; tip = lerp(s.a, s.b, e); }
    else if (s.kind === "hold") { full = strokes.length; tip = s.tip; }
    else if (s.kind === "fade") { full = strokes.length; tip = lerp(s.a, s.b, e); opacity = 1 - e; }
    else { tip = s.tip; }
    for (var k = 0; k < strokes.length; k++) {
      if (k < full) setStroke(k, "full"); else if (k === current) setStroke(k, "part", p); else setStroke(k, "hidden");
    }
    traceG.style.opacity = opacity;
    shaft.setAttribute("x2", r3(tip[0])); shaft.setAttribute("y2", r3(tip[1]));
    halo.setAttribute("cx", r3(tip[0])); halo.setAttribute("cy", r3(tip[1]));
    tipDot.setAttribute("cx", r3(tip[0])); tipDot.setAttribute("cy", r3(tip[1]));
    var norm = Math.hypot(tip[0], tip[1]);
    if (norm > 0.08) {
      var dx = tip[0] / norm, dy = tip[1] / norm, bx = tip[0] - dx * 0.075, by = tip[1] - dy * 0.075;
      head.setAttribute("points", [r3(tip[0]) + "," + r3(tip[1]), r3(bx - dy * 0.03) + "," + r3(by + dx * 0.03), r3(bx + dy * 0.03) + "," + r3(by - dx * 0.03)].join(" "));
      head.style.visibility = "visible";
    } else head.style.visibility = "hidden";
  }

  var stage = fig.querySelector(".bloch-stage") || fig;
  var still = stage.querySelector("img");
  if (still) still.remove();
  stage.appendChild(svg);
  var playing = false, userPaused = false, visible = true, time = 0, last = null, loopsDone = 0;
  function frame(now) {
    if (!playing) return;
    if (last !== null) time += Math.min(0.1, (now - last) / 1000);
    last = now;
    if (loops && loopsDone >= loops - 1 && time >= POSTER) {
      time = POSTER; render(time); playing = false; return;
    }
    if (time >= LOOP) { time -= LOOP; loopsDone++; }
    render(time);
    requestAnimationFrame(frame);
  }
  function play() { if (playing) return; playing = true; last = null; requestAnimationFrame(frame); }
  function pause() { playing = false; }
  if (!reduce) {
    stage.addEventListener("click", function () {
      if (playing) { userPaused = true; pause(); } else { userPaused = false; play(); }
    });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (!visible && playing) { pause(); }
      else if (visible && !playing && !userPaused && !reduce) { play(); }
    }, { threshold: 0.2 }).observe(fig);
  }
  if (reduce) { time = POSTER; render(time); }
  else { render(0); play(); }
})();
