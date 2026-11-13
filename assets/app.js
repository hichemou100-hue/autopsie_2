/* Logique du téléphone interactif (Autopsie 2) */
(function () {
  var AUDIO_SRC = "assets/autopsie-ii.mp3";

  var $ = function (s) { return document.querySelector(s); };
  var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
  var stack = ["lock"];
  var timers = [];
  var callRun = 0;

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function show(id) {
    screens.forEach(function (s) { s.hidden = s.id !== id; });
    $("#homebar").hidden = id === "lock";
  }
  function go(id) {
    if (id === "home") stack = ["home"]; else stack.push(id);
    leave(); show(id);
    if (id === "recorder") loadWave();
  }
  function back() {
    if (stack.length > 1) stack.pop();
    leave(); show(stack[stack.length - 1]);
    if (stack[stack.length - 1] === "recorder") loadWave();
  }
  function leave() { callRun++; clearTimers(); stopRec(); if (typeof stopVideo === "function") stopVideo(); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go]");
    if (t) return go(t.getAttribute("data-go"));
    if (e.target.closest("[data-back]")) return back();
  });
  $("#homebar").addEventListener("click", function () { go("home"); });
  $("#glass").addEventListener("click", function (e) {
    if (stack.length === 1 && stack[0] === "lock" && !e.target.closest("button")) go("home");
  });

  /* Heure et date */
  function tick() {
    var d = new Date();
    var hm = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    var dt = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
    $("#sbTime").textContent = hm;
    $("#lockTime").textContent = hm;
    $("#lockDate").textContent = dt.charAt(0).toUpperCase() + dt.slice(1);
  }
  tick(); setInterval(tick, 20000);

  /* Compte à rebours */
  (function () {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var days = Math.round((new Date(2026, 10, 15) - today) / 86400000);
    $("#countdown").textContent = days > 1 ? "Dans " + days + " jours" : days === 1 ? "Demain" : days === 0 ? "Aujourd'hui" : "Disponible";
  })();

  /* Dictaphone : « Autopsie, II. » */
  var wave = $("#recWave"), bars = [], N = 52, seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var i = 0; i < N; i++) {
    var b = document.createElement("i");
    b.style.height = Math.max(8, Math.min(100, (0.25 + 0.75 * Math.abs(Math.sin(i / 5.5)) * (0.5 + rnd())) * 100)) + "%";
    wave.appendChild(b); bars.push(b);
  }
  var audio = new Audio(AUDIO_SRC), rafId = 0, playing = false, DUR = 28.76;
  audio.preload = "none";
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function dur() { return isFinite(audio.duration) && audio.duration > 0 ? audio.duration : DUR; }
  function paint(p) {
    var n = Math.round(p * bars.length);
    bars.forEach(function (b, i) { b.className = i < n ? "on" : ""; });
  }
  function setIcon(isPlaying) {
    $("#recPlay").innerHTML = isPlaying
      ? '<svg viewBox="0 0 24 24" fill="#fff"><rect x="5" y="3.500" width="5" height="17" rx="1.200"/><rect x="14" y="3.500" width="5" height="17" rx="1.200"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 3.500l14 8.500-14 8.500z"/></svg>';
  }
  function labels(cur) { $("#recTime").textContent = fmt(cur); $("#recLeft").textContent = "-" + fmt(Math.max(0, dur() - cur)); }
  function stopRec() {
    playing = false; cancelAnimationFrame(rafId);
    try { audio.pause(); audio.currentTime = 0; } catch (err) {}
    paint(0); setIcon(false); labels(0);
  }
  function frame() {
    if (!playing) return;
    paint(audio.currentTime / dur()); labels(audio.currentTime);
    rafId = requestAnimationFrame(frame);
  }
  audio.addEventListener("loadedmetadata", function () { if (!playing) labels(0); });
  audio.addEventListener("ended", stopRec);
  labels(0);
  $("#recPlay").addEventListener("click", function () {
    if (playing) return stopRec();
    playing = true; setIcon(true);
    var p = audio.play();
    if (p && p.catch) p.catch(stopRec);
    frame();
  });

  /* Forme d'onde réelle : calculée à la première ouverture du Dictaphone (le fichier n'est pas chargé avant) */
  var waveDone = false;
  function loadWave() {
    if (waveDone) return; waveDone = true;
    try {
      fetch(AUDIO_SRC).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.decodeAudioData(buf, function (d) {
          var ch = d.getChannelData(0), step = Math.floor(ch.length / N), peaks = [], mx = 0;
          for (var n = 0; n < N; n++) {
            var m = 0;
            for (var j = n * step; j < (n + 1) * step; j += 40) { var v = Math.abs(ch[j]); if (v > m) m = v; }
            peaks.push(m); if (m > mx) mx = m;
          }
          if (mx > 0) bars.forEach(function (b, n) { b.style.height = Math.max(8, Math.round(peaks[n] / mx * 100)) + "%"; });
          ctx.close();
        }, function () {});
      }).catch(function () {});
    } catch (err) {}
  }

  /* Photos */
  function tabTo(name) {
    $("#libPane").hidden = name !== "lib";
    $("#colPane").hidden = name !== "col";
    $("#tabLib").setAttribute("aria-selected", name === "lib" ? "true" : "false");
    $("#tabCol").setAttribute("aria-selected", name === "col" ? "true" : "false");
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]");
    if (t) tabTo(t.getAttribute("data-tab"));
  });

  var vid = $("#vid"), seek = $("#seek"), vtime = $("#vtime"), VDUR = 58.5, liked = false, toastT = 0;
  var PLAY = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 3.500l14 8.500-14 8.500z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" fill="#fff"><rect x="5" y="3.500" width="5" height="17" rx="1.200"/><rect x="14" y="3.500" width="5" height="17" rx="1.200"/></svg>';
  var SPK = '<svg viewBox="0 0 24 24"><path d="M4 9.500h3.500L12 5.500v13L7.500 14.500H4z" fill="#fff"/><path d="M15.500 9a4 4 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
  var SPK_OFF = '<svg viewBox="0 0 24 24"><path d="M4 9.500h3.500L12 5.500v13L7.500 14.500H4z" fill="#fff"/><path d="M16 9.500l5 5M21 9.500l-5 5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
  function vdur() { return isFinite(vid.duration) && vid.duration > 0 ? vid.duration : VDUR; }
  function vUi() {
    $("#vpp").innerHTML = vid.paused ? PLAY : PAUSE;
    $("#bigplay").hidden = !vid.paused;
  }
  function vTick() {
    seek.value = String(Math.round(vid.currentTime / vdur() * 1000));
    vtime.textContent = "-" + fmt(Math.max(0, vdur() - vid.currentTime));
  }
  function vToggle() {
    if (vid.paused) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause();
  }
  vid.addEventListener("play", vUi);
  vid.addEventListener("pause", vUi);
  vid.addEventListener("timeupdate", vTick);
  vid.addEventListener("loadedmetadata", vTick);
  vid.addEventListener("ended", function () { try { vid.currentTime = 0; } catch (err) {} vUi(); vTick(); });
  $("#vwrap").addEventListener("click", vToggle);
  $("#vpp").addEventListener("click", vToggle);
  seek.addEventListener("input", function () { try { vid.currentTime = (seek.value / 1000) * vdur(); } catch (err) {} vTick(); });
  $("#vmute").addEventListener("click", function () { vid.muted = !vid.muted; $("#vmute").innerHTML = vid.muted ? SPK_OFF : SPK; });
  $("#vfav").addEventListener("click", function () {
    liked = !liked;
    $("#thumb").classList.toggle("liked", liked);
    $("#vfav").className = liked ? "fav-on" : "";
    $("#heart").setAttribute("fill", liked ? "currentColor" : "none");
  });
  function sheet(open) { $("#sheet").classList.toggle("open", open); $("#scrim").classList.toggle("open", open); }
  $("#vinfo").addEventListener("click", function () { sheet(true); });
  $("#scrim").addEventListener("click", function () { sheet(false); });
  $("#sheetX").addEventListener("click", function () { sheet(false); });
  function toast(msg) {
    var el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }
  $("#vshare").addEventListener("click", function () {
    var url = location.href.split("#")[0];
    try {
      navigator.clipboard.writeText(url).then(function () { toast("Lien copié"); }, function () { toast("Copiez le lien dans la barre d'adresse"); });
    } catch (err) { toast("Copiez le lien dans la barre d'adresse"); }
  });
  function stopVideo() {
    try { vid.pause(); if (vid.readyState > 0) vid.currentTime = 0; } catch (err) {}
    sheet(false); vUi(); vTick();
  }
  vUi();

  /* Contacts et appel (aucun signal sonore) */
  var current = { name: "", ini: "" };
  Array.prototype.forEach.call(document.querySelectorAll("[data-person]"), function (b) {
    b.addEventListener("click", function () {
      current = { name: b.getAttribute("data-person"), ini: b.getAttribute("data-ini") };
      $("#pName").textContent = current.name; $("#pAvatar").textContent = current.ini;
      go("person");
    });
  });
  $("#callBtn").addEventListener("click", function () {
    $("#cName").textContent = current.name; $("#cAvatar").textContent = current.ini;
    var st = $("#cState"), g1 = $("#g1");
    g1.className = "bubble"; st.className = "stateline"; st.textContent = "appel en cours…";
    go("call");
    var run = callRun;
    function ok() { return run === callRun; }
    later(function () { if (ok()) st.textContent = "sonnerie…"; }, 1500);
    later(function () { if (ok()) { st.textContent = "répondeur"; g1.className = "bubble show"; } }, 4200);
    later(function () {
      if (!ok()) return;
      st.className = "stateline rec"; var s = 0; st.textContent = "0:00";
      (function loop() { if (!ok()) return; later(function () { s++; st.textContent = fmt(s); loop(); }, 1000); })();
    }, 7600);
  });
  $("#hangBtn").addEventListener("click", back);

  show("lock");
})();
