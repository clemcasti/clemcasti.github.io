# Le paradoxe des nouvelles technologies sur l'industrie du cinéma

Exploration numérique de **Clémence Castillo et Ninon** : l'intelligence artificielle va-t-elle
remplacer les artistes du cinéma, ou transformer leur manière de créer ?

En ligne : <https://clemcasti.github.io/exploration/>

Le site est statique (HTML, CSS, JavaScript natifs) : aucune installation, aucune étape de
construction. GitHub Pages le publie tel quel depuis ce dossier.

## Organisation

| Fichier | Rôle |
|---|---|
| `index.html` | Toute la page : générique, court-métrage, catalogue, 5 épisodes (Introduction, Question de recherche, Analyse, Corpus, Lectures & sources), générique de fin |
| `css/site.css` | Styles. Les couleurs et polices sont définies une seule fois, en haut (`:root`) |
| `js/data.js` | **Toutes les données chiffrées.** Pour modifier un graphique, c'est ici |
| `js/site.js` | Comportements : générique, navigation, animations, dessin des graphiques |
| `img/` | Visuels de *The Mandalorian* (via ÉSEC) et 5 photographies de Wikimedia Commons |
| `QUESTIONNAIRE.md` | Le sondage à diffuser, et comment reporter les résultats |
| `scripts/wordcount.js` | Compte les mots de la composante écrite |

## Tâches courantes

**Voir le site en local**

```bash
python3 -m http.server 8000
```

puis ouvrir <http://localhost:8000/exploration/> (commande lancée à la racine du dépôt).
Ajouter `?intro=1` à l'adresse pour revoir le générique d'ouverture, qui ne se joue qu'une
fois par session.

**Règles d'écriture demandées par Clémence** : pas de deux-points ni de points-virgules
dans le texte (sauf dans les titres officiels cités en bibliographie), pas d'émojis, pas de
durée de lecture, texte centré, ton d'étudiante, au plus près de ses propres formulations.

**Vérifier le plafond de 4 000 mots**

```bash
node exploration/scripts/wordcount.js
```

Seul le texte placé dans un élément `data-compte` est compté : textes des épisodes,
légendes, titres de graphiques. La bibliographie et les données des graphiques ne le sont
pas. Le même total s'affiche en bas du site.

**Option future : le sondage étudiant.** Il n'est pas affiché pour l'instant. Tout est
prêt pour le remettre : le questionnaire (`QUESTIONNAIRE.md`), les données (bloc `sondage`
de `js/data.js`) et le code qui dessine les graphiques (`grapheSondage` dans `js/site.js`).
Une fois les réponses reçues :

1. Reporter les pourcentages dans `js/data.js` (voir la fin de `QUESTIONNAIRE.md`) et passer
   `placeholder` à `false`.
2. Coller le bloc ci-dessous dans `index.html`, épisode 3 (Analyse), juste avant le
   commentaire `<!-- conclusion -->`, et le numéroter « Plan 6 ».
3. Ajouter un court paragraphe d'analyse, et revoir les passages qui présentent le sondage
   comme une piste future : la méthode (épisode 2) et « Une piste pour la suite » (épisode 5).
   Ajouter le sondage aux études présentées dans le Corpus (épisode 4).
4. Relancer le compteur de mots.

```html
    <!-- 6. sondage -->
    <div class="prose" data-compte>
      <h3><span class="sc">Plan 6</span>Notre sondage auprès d'étudiants</h3>
      <p>Nous avons diffusé un questionnaire auprès d'étudiants qui s'intéressent au cinéma, notamment autour de la Station Cinéma d'Argenton. Nous y avons repris une question du CNC, pour comparer nos réponses à celles des moins de 30 ans.</p>
    </div>
    <div class="graphe large apparait" style="max-width:900px" data-anime>
      <div class="graphe__tete" data-compte><div><h4>Ce qu'en pensent des étudiants cinéphiles</h4><p class="graphe__sous">Questionnaire en ligne · répondants&nbsp;: <span id="sondage-n">en cours</span></p></div></div>
      <div id="g-sondage"></div>
      <p class="graphe__src">Source&nbsp;: sondage réalisé par Clémence et Ninon, 2026.</p>
    </div>
```

**Régler la résistance des arrêts de fin d'épisode** : dans `js/site.js`, fonction `arrets()`.
`SEUIL_MOLETTE` (défilement cumulé nécessaire), `SEUIL_DOIGT` (longueur du glissé sur
téléphone) et `FUITE` (vitesse à laquelle la jauge se vide) : plus ils sont grands, plus il
faut insister. Le menu du haut et les boutons passent toujours sans résistance.

**Après une modification de CSS ou de JS**, augmenter le numéro `?v=` dans les trois balises
qui les chargent en bas et en haut de `index.html`, pour que les navigateurs ne gardent pas
l'ancienne version en cache.

## D'où viennent les données

- **Rapport CNC × BearingPoint, avril 2024** (115 p.) : la chaîne de valeur de l'épisode 1
  est redessinée en HTML d'après la planche de la p. 11 (bloc `chaine` de `js/data.js`) ; les 62 fiches de cas d'usage ont été
  relevées une à une (maturité et impact, notés de 0 à 3, p. 46-107). Le nombre de cas par
  étape vient de la p. 40. Le niveau de risque des 27 métiers a été lu sur la planche de la
  p. 26, d'après la couleur du cadre de chaque métier.
- **CVL Economics, *Future Unscripted*, janvier 2024** : chiffres repris du résumé du rapport.
- **CNC, Observatoire de l'IA, septembre 2024** : « un tiers » des Français est affiché
  « ≈ 33 % » ; les 50 % et 75 % sont les chiffres exacts du CNC.
- **Sondage étudiant** : valeurs de démonstration tant que `placeholder` vaut `true`.

La bibliographie complète, numérotée, est dans le générique de fin du site.

## Droits des images

Les images de *The Mandalorian* (Lucasfilm / Disney+, reprises de l'article de l'ÉSEC)
sont utilisées à des fins pédagogiques, avec leur source affichée sous chaque image.

Les cinq photographies viennent de Wikimedia Commons, sous licence libre. Leurs licences
(CC BY et CC BY-SA) imposent de citer l'auteur, la licence et la source : c'est fait sous
chaque image, avec un lien vers la page d'origine. Ne pas supprimer ces crédits.

| Fichier | Auteur | Licence |
|---|---|---|
| `rotoscope-brevet.webp` | Brevet US 1 242 674, Max Fleischer, 1915 (couleurs inversées) | Domaine public |
| `greve-scenaristes.webp` | David James Henry | CC BY-SA 4.0 |
| `greve-acteurs.webp` | Eden, Janine et Jim | CC BY 2.0 |
| `tournage-fond-vert.webp` | Manfred Werner (Tsui) | CC BY-SA 3.0 |
| `salle-cinema.webp` | Coen | CC BY-SA 4.0 |

Les schémas (chaîne de valeur, graphiques) sont redessinés d'après le rapport du CNC, et
les visuels des cartes d'épisodes sont dessinés en CSS.
