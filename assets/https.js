/* Force le HTTPS : si la page est ouverte en http://, on bascule en https://.
   (Le réglage « Enforce HTTPS » de GitHub Pages fait la même chose côté serveur.) */
(function () {
  "use strict";
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (location.protocol === "http:" && !local) {
    location.replace("https:" + location.href.substring(location.protocol.length));
  }
})();
