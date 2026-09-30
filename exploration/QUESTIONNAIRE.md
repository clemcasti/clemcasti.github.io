# Questionnaire : les étudiants et l'IA au cinéma

> **Option future.** Le sondage n'est pas affiché sur le site pour l'instant. Pour le
> réactiver une fois les réponses reçues, suivre la section « Option future » du `README.md`.

À copier dans Google Forms (ou Framaforms) puis à diffuser, par exemple auprès des membres
de la Station Cinéma d'Argenton et des étudiants en cinéma ou en audiovisuel.

Les questions 4 à 7 alimentent directement les graphiques du site : **gardez exactement les
mêmes choix de réponse**, sinon les résultats ne se reporteront pas tels quels dans
`js/data.js`. La question 5 reprend celle du CNC (2024), pour comparer nos réponses aux 50 %
d'avis positifs chez les moins de 30 ans.

Durée : environ 3 minutes. Anonyme.

---

**Introduction à afficher en tête du formulaire**

> Bonjour ! Nous sommes deux étudiantes, et nous menons une petite enquête sur
> l'intelligence artificielle dans le cinéma pour un projet universitaire. Le questionnaire
> est anonyme et prend environ 3 minutes. Merci beaucoup !

---

### Profil

1. **Quel âge avez-vous ?**
   - Moins de 18 ans · 18-20 ans · 21-24 ans · 25-29 ans · 30 ans et plus

2. **Quelles études suivez-vous ?**
   - Cinéma ou audiovisuel · Autres études artistiques · Autre domaine · Je ne suis pas étudiant(e)

3. **À quelle fréquence allez-vous au cinéma ?**
   - Plus d'une fois par mois · Environ une fois par mois · Quelques fois par an · Rarement ou jamais

### L'IA au cinéma

4. **Pour vous, l'IA dans le cinéma est surtout…** *(une seule réponse)*
   - Un outil utile
   - Une menace pour les artistes
   - Un changement de méthode, ni bon ni mauvais

5. **Avez-vous un avis positif sur l'usage de l'IA dans la création de films ?**
   - Oui
   - Non
   - Sans avis

6. **Iriez-vous voir un film dont les images sont générées par IA ?**
   - Oui, sans problème
   - Oui, si c'est indiqué clairement
   - Non

7. **Quel métier l'IA risque-t-elle le plus de remplacer ?** *(une seule réponse)*
   - Doublage et voix
   - Effets visuels
   - Montage
   - Scénario
   - Réalisation

### Pour aller plus loin (facultatif)

8. **Avez-vous déjà utilisé un outil d'IA générative pour un projet créatif ?**
   - Oui, souvent · Oui, une ou deux fois · Non

9. **En une phrase : qu'est-ce que l'IA ne pourra jamais faire à la place d'un artiste ?**
   *(réponse libre — de bonnes citations pour le site)*

---

## Reporter les résultats sur le site

1. Dans Google Forms, onglet **Réponses** → résumé : notez le pourcentage de chaque réponse
   aux questions 4 à 7, et le nombre total de répondants.
2. Ouvrez `js/data.js`, bloc `sondage` en bas du fichier :
   - remplacez chaque valeur `v` par le vrai pourcentage (nombre entier) ;
   - mettez le nombre de répondants dans `repondants` ;
   - passez `placeholder: true` à `placeholder: false`.
3. Le bandeau « données provisoires » et les hachures disparaissent tout seuls.
4. Réactivez la section sur le site : voir « Option future » dans le `README.md`.
