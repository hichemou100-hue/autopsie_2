/* Bandeau cookies + statistiques d'audience (GoatCounter) chargées SEULEMENT après acceptation.
   + affichage anti-spam des adresses e-mail (<span class="mail" data-u="…" data-d="…">). */
(function () {
  "use strict";

  /* ============ À RÉGLER ============
     Code de votre compte GoatCounter (gratuit sur goatcounter.com).
     Exemple : si votre adresse est https://autopsie2.goatcounter.com, écrivez "autopsie2".
     Laissez vide tant que vous n'avez pas de compte : rien ne sera chargé. */
  var GOATCOUNTER = "";
  /* ================================= */

  var KEY = "autopsie2-cookies";
  var MAX_AGE = 180 * 24 * 3600 * 1000; /* le choix est redemandé au bout de 6 mois */
  var banner = null;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && (v.choice === "yes" || v.choice === "no") && Date.now() - v.t < MAX_AGE) return v.choice;
    } catch (e) {}
    return null;
  }
  function write(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, t: Date.now() })); } catch (e) {}
  }

  function loadAnalytics() {
    if (!GOATCOUNTER || document.getElementById("gc-script")) return;
    var s = document.createElement("script");
    s.id = "gc-script";
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + GOATCOUNTER + ".goatcounter.com/count");
    document.head.appendChild(s);
  }

  function closeBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
    document.body.classList.remove("cc-open");
  }

  function choose(choice) {
    write(choice);
    if (choice === "yes") loadAnalytics();
    closeBanner();
    var btn = document.querySelector("[data-cookie-settings]");
    if (btn) btn.focus();
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function openBanner(focus) {
    if (banner) return;
    banner = el("div", "cc");
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-labelledby", "cc-title");
    var inner = el("div", "cc-inner");
    var txt = el("div", "cc-text");
    var title = el("p", "cc-title", "Cookies et mesure d'audience");
    title.id = "cc-title";
    var p = el("p", "cc-p",
      "Ce site peut mesurer sa fréquentation de façon anonyme, sans publicité et sans suivi entre sites. " +
      "Rien n'est collecté avant votre choix. ");
    var a = el("a", "", "En savoir plus");
    a.href = "politique-confidentialite.html";
    p.appendChild(a);
    p.appendChild(document.createTextNode("."));
    txt.appendChild(title);
    txt.appendChild(p);
    var btns = el("div", "cc-btns");
    var no = el("button", "cc-btn", "Refuser");
    no.type = "button";
    no.addEventListener("click", function () { choose("no"); });
    var yes = el("button", "cc-btn", "Accepter");
    yes.type = "button";
    yes.addEventListener("click", function () { choose("yes"); });
    btns.appendChild(no);
    btns.appendChild(yes);
    inner.appendChild(txt);
    inner.appendChild(btns);
    banner.appendChild(inner);
    document.body.appendChild(banner);
    document.body.classList.add("cc-open");
    if (focus) no.focus();
  }

  function mails() {
    var list = document.querySelectorAll(".mail[data-u][data-d]");
    Array.prototype.forEach.call(list, function (n) {
      var u = n.getAttribute("data-u"), d = n.getAttribute("data-d");
      if (!u || !d) return; /* pas encore renseigné : on laisse le texte « À COMPLÉTER » */
      var a = document.createElement("a");
      a.href = "mailto:" + u + "@" + d;
      a.textContent = u + "@" + d;
      n.textContent = "";
      n.className = "";
      n.appendChild(a);
    });
  }

  function init() {
    mails();
    var saved = read();
    if (saved === "yes") loadAnalytics();
    if (saved === null) openBanner(false);
    Array.prototype.forEach.call(document.querySelectorAll("[data-cookie-settings]"), function (b) {
      b.addEventListener("click", function () { openBanner(true); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
