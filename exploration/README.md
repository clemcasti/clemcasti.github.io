# Remplacer / Transformer

Exploration numérique de **Clémence Castillo et Ninon** : l'intelligence artificielle va-t-elle
remplacer les artistes du cinéma, ou transformer leur manière de créer ?

En ligne : <https://clemcasti.github.io/exploration/>

Le site est statique (HTML, CSS, JavaScript natifs) : aucune installation, aucune étape de
construction. GitHub Pages le publie tel quel depuis ce dossier.

## Organisation

| Fichier | Rôle |
|---|---|
| `index.html` | Toute la page : générique, court-métrage, catalogue, 4 épisodes, générique de fin |
| `css/site.css` | Styles. Les couleurs et polices sont définies une seule fois, en haut (`:root`) |
| `js/data.js` | **Toutes les données chiffrées.** Pour modifier un graphique, c'est ici |
| `js/site.js` | Comportements : générique, navigation, animations, dessin des graphiques |
| `img/` | Planches du rapport du CNC et visuels de *The Mandalorian* (via ÉSEC) |
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

**Vérifier le plafond de 4 000 mots**

```bash
node exploration/scripts/wordcount.js
```

Seul le texte placé dans un élément `data-compte` est compté : textes des épisodes,
légendes, titres de graphiques. La bibliographie et les données des graphiques ne le sont
pas. Le même total s'affiche en bas du site.

**Publier les vrais résultats du sondage** : voir la fin de `QUESTIONNAIRE.md`.

**Régler la résistance des arrêts de fin d'épisode** : dans `js/site.js`, fonction `arrets()`.
`SEUIL_MOLETTE` (défilement cumulé nécessaire), `SEUIL_DOIGT` (longueur du glissé sur
téléphone) et `FUITE` (vitesse à laquelle la jauge se vide) : plus ils sont grands, plus il
faut insister. Le menu du haut et les boutons passent toujours sans résistance.

**Après une modification de CSS ou de JS**, augmenter le numéro `?v=` dans les trois balises
qui les chargent en bas et en haut de `index.html`, pour que les navigateurs ne gardent pas
l'ancienne version en cache.

## D'où viennent les données

- **Rapport CNC × BearingPoint, avril 2024** (115 p.) : les 62 fiches de cas d'usage ont été
  relevées une à une (maturité et impact, notés de 0 à 3, p. 46-107). Le nombre de cas par
  étape vient de la p. 40. Le niveau de risque des 27 métiers a été lu sur la planche de la
  p. 26, d'après la couleur du cadre de chaque métier.
- **CVL Economics, *Future Unscripted*, janvier 2024** : chiffres repris du résumé du rapport.
- **CNC, Observatoire de l'IA, septembre 2024** : « un tiers » des Français est affiché
  « ≈ 33 % » ; les 50 % et 75 % sont les chiffres exacts du CNC.
- **Sondage étudiant** : valeurs de démonstration tant que `placeholder` vaut `true`.

La bibliographie complète, numérotée, est dans le générique de fin du site.

## Droits des images

Les planches du CNC et les images de *The Mandalorian* (Lucasfilm / Disney+, reprises de
l'article de l'ÉSEC) sont utilisées à des fins pédagogiques, avec leur source affichée
sous chaque image. Les visuels des cartes d'épisodes sont dessinés en CSS.
