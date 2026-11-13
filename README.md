# Autopsie 2 – site

Site statique (HTML/CSS/JS) pour GitHub Pages : https://hichemou100-hue.github.io/autopsie-2/

## 1. Mettre en ligne cette version

1. Sur GitHub, ouvrez le dépôt `autopsie-2`.
2. Gardez une copie de l'ancienne version (le ZIP `autopsie-2-sauvegarde-originale.zip` fourni avec ce dossier).
3. **Add file → Upload files**, puis glissez **tout le contenu** du dossier `autopsie-2-modifie` (pas le dossier lui-même). Acceptez de remplacer `index.html` et `video.mp4`.
4. **Commit changes**. Le site se met à jour en 1 à 2 minutes.
5. Vérifiez que le dossier `.github/workflows/` est bien apparu dans le dépôt. S'il manque (les fichiers cachés sont parfois ignorés au glisser-déposer) : **Add file → Create new file**, nom `.github/workflows/sauvegarde.yml`, puis collez le contenu du fichier du même nom fourni.

## 2. Ce que vous devez faire vous-même

| # | À faire | Comment |
|---|---------|---------|
| 1 | **Activer HTTPS** | Dépôt → **Settings → Pages** → cochez **Enforce HTTPS**. (Sur `github.io` c'est en général déjà actif et verrouillé : rien à faire.) |
| 5, 9, 10 | **Remplir les pages légales** | Cherchez `[À COMPLÉTER` dans `mentions-legales.html`, `politique-confidentialite.html` et `cgu.html` (surlignés en jaune) : nom ou pseudonyme de l'éditeur, statut, titulaire des droits, mention sur les personnes qui apparaissent dans le film, durée de conservation GoatCounter. Ce sont des modèles, pas un avis juridique : faites-les relire si le site a un usage commercial. |
| 5, 9, 10, 15 | **Adresse e-mail de contact** | Dans chacune des 3 pages, remplacez `data-u=""` par la partie avant le @ et `data-d=""` par le domaine (ex. `data-u="contact" data-d="exemple.fr"`). Elle s'affiche via JavaScript, ce qui la cache aux robots de spam. |
| 17 | **Analytics** | Créez un compte gratuit sur goatcounter.com, choisissez un code (ex. `autopsie2`), puis dans `assets/cookies.js` renseignez `var GOATCOUNTER = "autopsie2";`. Les statistiques ne se chargent que si le visiteur clique sur Accepter. |
| 8 | **Search Console** | 1) search.google.com/search-console → **Ajouter une propriété** → **Préfixe d'URL** → `https://hichemou100-hue.github.io/autopsie-2/`. 2) Choisissez la méthode **Balise HTML**, copiez la balise `<meta name="google-site-verification" …>`. 3) Dans `index.html`, collez-la à l'endroit du commentaire « Google Search Console » (retirez les `<!--` et `-->`). 4) Enregistrez, attendez la mise en ligne, cliquez **Valider**. 5) Menu **Sitemaps** → ajoutez `sitemap.xml`. |
| 7 | **Activer les sauvegardes** | Onglet **Actions** du dépôt → si demandé, **I understand my workflows, enable them**. Test immédiat : **Sauvegarde automatique → Run workflow**. |
| 11 | **Tester l'image de partage** | Collez l'adresse du site dans le débogueur de Facebook (developers.facebook.com/tools/debug) et cliquez **Scrape Again** si l'ancienne aperçu reste en cache. |

## 3. Ce qui a été fait (les 18 points)

1. **HTTPS** : redirection `http → https` dans `assets/https.js`, directive `upgrade-insecure-requests`, aucune ressource en `http://`.
2. **Meta title + description** sur chaque page (titre 54 caractères, description 137), `canonical`, Open Graph, Twitter Cards, données structurées (schema.org).
3. **Clés API hors du front** : aucune clé trouvée dans le code d'origine (vérifié) ; rien à déplacer. Le seul identifiant à venir (GoatCounter) est public par nature.
4. **Textes alternatifs** : images, vidéo, formes décoratives, boutons et onglets annotés (`alt`, `aria-label`, `aria-hidden`).
5. **Mentions légales** : `mentions-legales.html`.
6. **Sitemap + robots.txt** : `sitemap.xml`, `robots.txt` (voir la limite ci-dessous).
7. **Sauvegardes automatiques** : `.github/workflows/sauvegarde.yml` (archive ZIP chaque dimanche, conservée 90 jours, plus une étiquette Git permanente `sauvegarde-AAAA-MM-JJ`).
8. **Search Console** : emplacement de la balise prêt + sitemap (étapes ci-dessus).
9. **Politique de confidentialité** : `politique-confidentialite.html`.
10. **CGU** : `cgu.html`.
11. **Image réseaux** : `assets/og-image.jpg` (1200 × 630).
12. **Bandeau cookies** : Accepter / Refuser à égalité, choix mémorisé 6 mois, lien « Gérer les cookies » en bas de page. Rien n'est chargé avant le choix.
13. **Liens + page 404** : liens du pied de page ajoutés (le site d'origine n'en avait aucun), tous vérifiés ; `404.html` personnalisée.
14. **Responsive** : testé de 320 à 1280 px, aucun défilement horizontal ; titre fluide.
15. **Anti-spam** : le site n'a aucun formulaire ni commentaire, donc rien à filtrer ; l'e-mail de contact est masqué aux robots (voir tableau).
16. **Contrastes** : 4 défauts corrigés (onglet sélectionné 2,6 → 4,7:1 ; bulle bleue et pastille 3,7 → 5,4:1 ; champ de saisie 3,3 → 7,3:1 ; forme d'onde 1,9 → 4,7:1). Contrôle automatique sur les 18 écrans et pages : plus aucune violation.
17. **Analytics** : GoatCounter (sans cookie), chargé uniquement après consentement.
18. **Images + vitesse** : page principale 790 Ko → 25 Ko ; vidéo 18,6 Mo → 2,2 Mo ; audio 460 → 230 Ko ; images en WebP ; CSS et JS en fichiers mis en cache ; site complet 19 Mo → 2,6 Mo.

## 4. Limites à connaître

- **robots.txt et sitemap sur un sous-dossier** : Google ne lit `robots.txt` qu'à la racine du domaine (`hichemou100-hue.github.io/robots.txt`), pas dans `/autopsie-2/`. Le fichier est fourni mais n'a pas d'effet tant que le site n'a pas son propre domaine. Le sitemap, lui, fonctionne via Search Console.
- **En-têtes de sécurité** : GitHub Pages ne permet pas de définir des en-têtes HTTP. La politique de sécurité (CSP) est donc posée par balise `<meta>`, ce qui couvre l'essentiel mais pas tout (ex. interdiction d'affichage dans un cadre). Un domaine personnalisé derrière Cloudflare le permettrait.
- **Polices Google Fonts** : elles sont conservées pour ne pas changer le rendu, et leur usage est déclaré dans la politique de confidentialité. Pour une conformité RGPD plus stricte, il faut les héberger sur le site (téléchargement des fichiers depuis Google Fonts).
- **Sous-titres de la vidéo** : le film n'a pas de piste de sous-titres accessible ; à ajouter (fichier `.vtt`) pour l'accessibilité complète.
- **Liens Instagram / TikTok** : le site les cite sans lien. Donnez-moi vos adresses de profil si vous voulez les ajouter.

## 5. Restaurer une sauvegarde

- Depuis une étiquette : dépôt → **Releases/Tags** → `sauvegarde-AAAA-MM-JJ` → **Download ZIP**, puis remplacez les fichiers du dépôt.
- Depuis l'archive : onglet **Actions** → l'exécution voulue → **Artifacts** → téléchargez le ZIP.
