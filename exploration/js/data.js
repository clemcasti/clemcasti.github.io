/*
 * Toutes les données chiffrées du site, au même endroit.
 * Pour mettre à jour un graphique, on modifie ce fichier et rien d'autre.
 *
 * Source principale : CNC × BearingPoint, « Quel impact de l'IA sur les filières
 * du cinéma, de l'audiovisuel et du jeu vidéo ? », avril 2024 (115 p.).
 * Les numéros de page renvoient à ce rapport.
 */
window.DATA = {

  /* --- CNC p. 11 : les usages de l'IA à chaque étape de la vie d'un film --
   * Reconstitution fidèle de la planche (cas d'usage regroupés par le CNC).
   * Les anglicismes sont en italique, comme dans l'original.                */
  chaine: [
    { nom: "Développement", icone: "crayon", cas: [
      "Écriture de scénario", "Analyse sémantique de scénario", "Analyse du potentiel d'un script",
      "Assistance à la budgétisation", "<em>Moodboard</em> projet" ] },
    { nom: "Préproduction et tournage", icone: "camera", cas: [
      "Création de plannings de tournage", "<em>Storyboarding</em>",
      "Caméras&nbsp;: <em>tracking</em> automatique", "Caméras&nbsp;: pré-paramétrage" ] },
    { nom: "Postproduction, effets visuels et animation", icone: "ecran", cas: [
      "Montage vidéo et son assisté par l'IA", "Création sonore et musicale", "Création d'effets spéciaux",
      "Création d'œuvres d'animation", "Post-synchro, doublage et <em>lip-sync</em>", "Sous-titrage" ] },
    { nom: "Préparation de la sortie", sous: "Distribution", icone: "megaphone", cas: [
      "Création de bandes-annonces", "Création de contenus promotionnels", "Nouvelles possibilités marketing" ] },
    { nom: "Exploitation en salles", icone: "salle", cas: [] },
    { nom: "Diffusions linéaires et non linéaires", icone: "tele", cas: [
      "Génération de métadonnées", "Optimisation du flux vidéo", "Optimisation des grilles de programme",
      "Recommandation de contenu", "Placement de produit virtuel", "Vérification des obligations réglementaires" ] },
    { nom: "Gestion du catalogue", icone: "classeur", cas: [
      "Restauration", "<em>Clipping</em> automatisé", "Lutte contre le piratage", "Reddition de comptes" ] }
  ],

  /* --- CNC p. 40 : cas d'usage par étape (cinéma & audiovisuel) ---------- */
  etapes: [
    { nom: "Développement",               cas: 4,  impact: 2 },
    { nom: "Préproduction et tournage",   cas: 3,  impact: 2 },
    { nom: "Postproduction et animation", cas: 23, impact: 5 },
    { nom: "Préparation de la sortie",    cas: 3,  impact: 1 },
    { nom: "Exploitation en salles",      cas: 0,  impact: 0 },
    { nom: "Diffusions successives",      cas: 8,  impact: 3 },
    { nom: "Gestion du catalogue",        cas: 3,  impact: 2 }
  ],

  /* --- CNC p. 46-107 : les 62 fiches cas d'usage --------------------------
   * m = maturité technologique (0 à 3), i = impact pressenti sur les métiers (0 à 3)
   * f = filière : "ca" cinéma & audiovisuel, "jv" jeu vidéo, "both" les deux
   * p = page de la fiche                                                     */
  fiches: [
    { n: "Aide à l'écriture de scénarios", m: 2, i: 1, f: "ca", p: 46, metiers: "Auteurs-scénaristes" },
    { n: "Analyse sémantique de scénarios", m: 3, i: 1, f: "ca", p: 47, metiers: "Scénaristes, producteurs" },
    { n: "Analyse du potentiel d'un projet", m: 3, i: 1, f: "ca", p: 48, metiers: "Producteurs, financeurs" },
    { n: "Storyboarding", m: 2, i: 2, f: "both", p: 49, metiers: "Artistes 2D, réalisateurs" },
    { n: "Aide à la budgétisation", m: 1, i: 2, f: "both", p: 50, metiers: "Producteurs" },
    { n: "Plannings de tournage", m: 0, i: 2, f: "ca", p: 51, metiers: "Assistants réalisation, régie" },
    { n: "Concepts de jeux vidéo", m: 2, i: 1, f: "jv", p: 52, metiers: "Game designers" },
    { n: "Cahiers des charges", m: 2, i: 2, f: "jv", p: 53, metiers: "Game designers" },
    { n: "Création de niveaux de jeu", m: 1, i: 2, f: "jv", p: 54, metiers: "Level designers" },
    { n: "Nouvelles formes de gameplay", m: 1, i: 0, f: "jv", p: 55, metiers: "Aucun métier touché" },
    { n: "Dialogues de jeu vidéo", m: 1, i: 2, f: "jv", p: 56, metiers: "Narrative designers" },
    { n: "Trames narratives personnalisées", m: 0, i: 0, f: "jv", p: 57, metiers: "Aucun métier touché" },
    { n: "Caméras intelligentes", m: 3, i: 2, f: "ca", p: 58, metiers: "Cadreurs, machinistes" },
    { n: "Indexation des rushes", m: 3, i: 2, f: "ca", p: 59, metiers: "Monteurs image et son" },
    { n: "Montage vidéo assisté", m: 3, i: 2, f: "ca", p: 60, metiers: "Monteurs image" },
    { n: "Étalonnage assisté", m: 3, i: 2, f: "ca", p: 61, metiers: "Étalonneurs" },
    { n: "Post-production son", m: 3, i: 2, f: "both", p: 62, metiers: "Monteurs son" },
    { n: "Bruitage automatisé", m: 2, i: 3, f: "both", p: 63, metiers: "Bruiteurs" },
    { n: "Composition musicale", m: 1, i: 2, f: "ca", p: 64, metiers: "Compositeurs" },
    { n: "Génération de voix", m: 2, i: 2, f: "both", p: 65, metiers: "Comédiens" },
    { n: "Post-synchronisation", m: 3, i: 2, f: "ca", p: 66, metiers: "Monteurs son, comédiens" },
    { n: "Doublage en langue étrangère", m: 2, i: 3, f: "both", p: 67, metiers: "Doubleurs, interprètes" },
    { n: "Synchronisation labiale", m: 2, i: 0, f: "ca", p: 68, metiers: "Aucun métier touché" },
    { n: "Sous-titrage", m: 3, i: 3, f: "ca", p: 69, metiers: "Traducteurs, sous-titreurs" },
    { n: "Audiodescription", m: 2, i: 2, f: "ca", p: 70, metiers: "Monteurs, traducteurs" },
    { n: "Rotoscopie et compositing", m: 3, i: 2, f: "ca", p: 71, metiers: "Graphistes VFX" },
    { n: "Motion capture sans marqueurs", m: 2, i: 2, f: "both", p: 72, metiers: "VFX, animateurs" },
    { n: "Simulations (foules, tissus…)", m: 2, i: 2, f: "both", p: 73, metiers: "Graphistes VFX" },
    { n: "Rajeunissement, face swap", m: 2, i: 2, f: "both", p: 74, metiers: "Graphistes VFX" },
    { n: "Paysages et extension de décors", m: 2, i: 2, f: "both", p: 75, metiers: "Graphistes VFX" },
    { n: "Lumière assistée", m: 2, i: 2, f: "both", p: 76, metiers: "Graphistes VFX" },
    { n: "Vidéo générée par prompt", m: 0, i: 2, f: "both", p: 77, metiers: "Monteurs, artistes 2D" },
    { n: "Personnages et décors 2D", m: 1, i: 2, f: "both", p: 78, metiers: "Artistes 2D, graphistes" },
    { n: "Optimisation du rendu", m: 3, i: 0, f: "both", p: 79, metiers: "Aucun métier touché" },
    { n: "Modélisation 3D", m: 1, i: 2, f: "both", p: 80, metiers: "Artistes 3D" },
    { n: "Animation assistée", m: 1, i: 2, f: "both", p: 81, metiers: "Animateurs 3D" },
    { n: "Création de textures", m: 1, i: 2, f: "jv", p: 82, metiers: "Artistes texture" },
    { n: "Rigging et skinning", m: 2, i: 2, f: "both", p: 83, metiers: "Riggers" },
    { n: "Personnages non joueurs « intelligents »", m: 1, i: 0, f: "jv", p: 84, metiers: "Aucun métier touché" },
    { n: "Équilibrage de la difficulté", m: 3, i: 0, f: "jv", p: 85, metiers: "Game designers" },
    { n: "Matchmaking", m: 3, i: 0, f: "jv", p: 86, metiers: "Programmeurs" },
    { n: "Programmation assistée", m: 2, i: 1, f: "jv", p: 87, metiers: "Programmeurs" },
    { n: "Tests et débogage", m: 2, i: 3, f: "jv", p: 88, metiers: "Testeurs" },
    { n: "Bandes-annonces", m: 1, i: 1, f: "ca", p: 89, metiers: "Monteurs" },
    { n: "Contenus promotionnels", m: 2, i: 2, f: "both", p: 90, metiers: "Marketing, distributeurs" },
    { n: "Nouvelles formes de marketing", m: 0, i: 0, f: "both", p: 91, metiers: "Aucun métier touché" },
    { n: "Tâches de bureau", m: 2, i: 1, f: "both", p: 92, metiers: "Tous les métiers" },
    { n: "Reddition des comptes", m: 0, i: 1, f: "ca", p: 93, metiers: "Producteurs, auteurs" },
    { n: "Création de métadonnées", m: 2, i: 3, f: "ca", p: 94, metiers: "Aucun métier cité" },
    { n: "Recommandation d'œuvres", m: 3, i: 0, f: "both", p: 95, metiers: "Aucun métier touché" },
    { n: "Grilles de programmes", m: 1, i: 2, f: "ca", p: 96, metiers: "Programmateurs TV" },
    { n: "Optimisation du flux vidéo", m: 2, i: 0, f: "both", p: 97, metiers: "Aucun métier touché" },
    { n: "Conformité réglementaire", m: 0, i: 2, f: "both", p: 98, metiers: "Non précisé" },
    { n: "Placement de produit virtuel", m: 3, i: 0, f: "both", p: 99, metiers: "Aucun métier touché" },
    { n: "Restauration de films", m: 2, i: 2, f: "ca", p: 100, metiers: "Restaurateurs" },
    { n: "Clipping d'extraits", m: 0, i: 2, f: "ca", p: 101, metiers: "Aucun métier touché" },
    { n: "Analyse du comportement des joueurs", m: 3, i: 0, f: "jv", p: 102, metiers: "Programmeurs" },
    { n: "Contenus créés par les joueurs", m: 1, i: 0, f: "jv", p: 103, metiers: "Aucun métier touché" },
    { n: "Avatars personnalisés", m: 1, i: 0, f: "jv", p: 104, metiers: "Aucun métier touché" },
    { n: "Chatbot service client", m: 3, i: 0, f: "jv", p: 105, metiers: "Service client" },
    { n: "Détection de triche", m: 1, i: 2, f: "jv", p: 106, metiers: "Testeurs" },
    { n: "Détection de comportements toxiques", m: 2, i: 2, f: "jv", p: 107, metiers: "Développeurs, testeurs" }
  ],
  echelles: {
    maturite: ["Naissante", "En développement", "Utilisable", "Éprouvée"],
    impact:   ["Aucun impact", "Assistance", "Automatisation partielle", "Automatisation de la majorité des tâches"]
  },

  /* --- CNC p. 26 : potentiel de baisse d'emploi, 27 familles de métiers ----
   * r = risque : 0 pas d'impact, 1 faible, 2 potentiel, 3 fort
   * g = famille : "art" artistique, "proj" chefferie de projet, "tech" technique */
  metiers: [
    { n: "Réalisateurs", g: "art", r: 0 },
    { n: "Comédiens", g: "art", r: 1 },
    { n: "Auteurs-scénaristes", g: "art", r: 1 },
    { n: "Compositeurs de musique de film", g: "art", r: 1 },
    { n: "Coordinateurs musicaux", g: "art", r: 1 },
    { n: "Costume, maquillage, coiffure", g: "art", r: 1 },
    { n: "Cascadeurs", g: "art", r: 2 },
    { n: "Maquillage-truquage", g: "art", r: 2 },
    { n: "Doubleurs", g: "art", r: 3 },
    { n: "Storyboarders", g: "art", r: 3 },
    { n: "Traducteurs", g: "art", r: 3 },
    { n: "Bruiteurs et sound designers", g: "art", r: 3 },

    { n: "Directeurs de casting", g: "proj", r: 0 },
    { n: "Exploitants de salles", g: "proj", r: 0 },
    { n: "Producteurs", g: "proj", r: 0 },
    { n: "Distributeurs", g: "proj", r: 0 },
    { n: "Chefs de projet tournage", g: "proj", r: 2 },
    { n: "Programmateurs TV", g: "proj", r: 2 },

    { n: "Techniciens de tournage (caméra, lumière)", g: "tech", r: 1 },
    { n: "Décor", g: "tech", r: 2 },
    { n: "Techniciens 3D", g: "tech", r: 2 },
    { n: "Techniciens 2D", g: "tech", r: 2 },
    { n: "Restaurateurs de films", g: "tech", r: 2 },
    { n: "Effets visuels (VFX)", g: "tech", r: 2 },
    { n: "Monteurs son", g: "tech", r: 2 },
    { n: "Monteurs image", g: "tech", r: 2 },
    { n: "Sous-titrage, audiodescription", g: "tech", r: 3 }
  ],
  familles: { art: "À dominante artistique", proj: "Chefferie de projet", tech: "À dominante technique" },
  risques: ["Pas d'impact", "Impact faible", "Impact possible", "Risque fort"],

  /* --- CVL Economics, « Future Unscripted », janvier 2024 (n = 300) ------- */
  cvl: [
    { v: 203800, suffixe: "",  label: "emplois du divertissement « perturbés » aux États-Unis d'ici 2026" },
    { v: 21.4,   suffixe: " %", label: "des emplois cinéma, télévision et animation concernés (≈ 118 500)" },
    { v: 75,     suffixe: " %", label: "des dirigeants disent que l'IA a déjà servi à supprimer ou fusionner des postes" },
    { v: 26,     suffixe: " %", label: "seulement jugent leurs équipes prêtes à intégrer ces outils" }
  ],

  /* --- CNC p. 28 : quatre façons d'utiliser l'IA, quatre effets sur l'emploi */
  approches: [
    { but: "Faire le même film pour moins cher", effet: "Baisse probable du volume de travail", baisse: true },
    { but: "Faire plus de films dans le même temps", effet: "Volume de travail plutôt stable", baisse: false },
    { but: "Faire des films plus ambitieux", effet: "Volume de travail plutôt stable", baisse: false },
    { but: "Améliorer les conditions de travail", effet: "Volume de travail plutôt stable", baisse: false }
  ],

  /* --- Frise chronologique ------------------------------------------------ */
  frise: [
    { an: "1915", txt: "Les frères Fleischer inventent la rotoscopie, à la main, image par image.", src: "CNC p. 71" },
    { an: "2018", txt: "Le visage de Thanos (Avengers: Infinity War) est animé avec l'outil Masquerade de Digital Domain.", src: "CNC p. 74" },
    { an: "2020", txt: "Premier deepfake de Luke Skywalker dans The Mandalorian, saison 2.", src: "ÉSEC" },
    { an: "2021", txt: "OpenAI lance DALL·E. Thierry Ardisson fait « revivre » Dalida dans Hôtel du Temps.", src: "CNC p. 2, 74" },
    { an: "2022", txt: "Sortie de ChatGPT. Respeecher recrée la voix de James Earl Jones pour Obi-Wan Kenobi.", src: "CNC p. 2, 65" },
    { an: "2023", txt: "/Imagine d'Anna Apter primé au Nikon Film Festival. Grèves historiques des scénaristes (148 jours) puis des acteurs à Hollywood.", src: "CNC p. 9, 18" },
    { an: "2024", txt: "Le CNC publie sa cartographie. L'Union européenne adopte l'AI Act. OpenAI dévoile Sora.", src: "CNC p. 18, 77" },
    { an: "2026", txt: "Horizon auquel Jeffrey Katzenberg (DreamWorks) prédisait 90 % d'économies sur l'animation.", src: "CNC p. 35" }
  ],

  /* --- CNC, Observatoire de l'IA : perception par le public, 11/09/2024 --
   * Part des Français ayant un avis positif sur l'IA dans la création.     */
  public: [
    { r: "Ensemble des Français", v: 33, approx: true },
    { r: "Moins de 30 ans", v: 50 },
    { r: "Personnes qui connaissent bien l'IA", v: 75 }
  ],

  /* --- Sondage étudiant ---------------------------------------------------
   * ⚠️ VALEURS PROVISOIRES. Tant que placeholder vaut true, le site affiche
   * un bandeau d'avertissement et hachure les barres.
   * Pour publier les vrais résultats : remplacer les pourcentages,
   * indiquer le nombre de répondants, puis passer placeholder à false.     */
  sondage: {
    placeholder: true,
    repondants: 0,
    questions: [
      {
        q: "Pour vous, l'IA dans le cinéma est surtout…",
        reponses: [
          { r: "Un outil utile", v: 40 },
          { r: "Une menace pour les artistes", v: 35 },
          { r: "Un changement de méthode, ni bon ni mauvais", v: 25 }
        ]
      },
      {
        q: "Avez-vous un avis positif sur l'usage de l'IA dans la création de films ?",
        reponses: [
          { r: "Oui", v: 50 },
          { r: "Non", v: 30 },
          { r: "Sans avis", v: 20 }
        ]
      },
      {
        q: "Iriez-vous voir un film dont les images sont générées par IA ?",
        reponses: [
          { r: "Oui, sans problème", v: 20 },
          { r: "Oui, si c'est indiqué clairement", v: 45 },
          { r: "Non", v: 35 }
        ]
      },
      {
        q: "Quel métier l'IA risque-t-elle le plus de remplacer ?",
        reponses: [
          { r: "Doublage et voix", v: 30 },
          { r: "Effets visuels", v: 30 },
          { r: "Montage", v: 20 },
          { r: "Scénario", v: 12 },
          { r: "Réalisation", v: 8 }
        ]
      }
    ]
  }
};
