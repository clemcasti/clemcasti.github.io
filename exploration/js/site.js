/* REMPLACER / TRANSFORMER — comportements du site. Aucune dépendance. */
(function () {
  'use strict';

  var D = window.DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nf = new Intl.NumberFormat('fr-FR');

  // Défilement voulu (lien interne, bouton, lien profond) : les arrêts de fin d'épisode
  // le laissent passer. La fenêtre est prolongée tant que la page défile encore.
  // Un plafond empêche de prolonger indéfiniment en continuant soi-même à défiler.
  var libre = 0, plafond = 0;
  function liberer(ms) {
    var t = Date.now() + (ms || 1200);
    libre = Math.max(libre, t);
    plafond = Math.max(plafond, t + 2500);
  }
  function prolonger() { libre = Math.min(plafond, Math.max(libre, Date.now() + 300)); }
  function estLibre() { return Date.now() < libre; }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function stockage(action, cle, val) {
    try {
      if (action === 'get') return window.sessionStorage.getItem(cle);
      window.sessionStorage.setItem(cle, val);
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------ */
  /* 0. Générique d'ouverture                                             */
  /* ------------------------------------------------------------------ */
  function generique() {
    var intro = $('#intro');
    if (!intro) return;
    var force = /[?&]intro=1/.test(location.search);
    var ancre = location.hash && location.hash !== '#projection';
    if ((stockage('get', 'intro-vue') || ancre) && !force) { intro.remove(); return; }

    document.body.classList.add('verrou');
    var fini = false;
    function terminer() {
      if (fini) return;
      fini = true;
      stockage('set', 'intro-vue', '1');
      intro.classList.add('fini');
      document.body.classList.remove('verrou');
      document.removeEventListener('keydown', clavier);
      setTimeout(function () { intro.remove(); }, 700);
      var affiche = $('#affiche');
      if (affiche) affiche.focus({ preventScroll: true });
    }
    function clavier(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') terminer(); }
    $('#intro-passer').addEventListener('click', terminer);
    document.addEventListener('keydown', clavier);
    setTimeout(terminer, reduit ? 1400 : 3900);
  }

  /* ------------------------------------------------------------------ */
  /* 1. Court-métrage : l'iframe n'est chargée qu'au clic                 */
  /* ------------------------------------------------------------------ */
  function projection() {
    var affiche = $('#affiche');
    if (!affiche) return;
    affiche.addEventListener('click', function () {
      var id = affiche.getAttribute('data-video');
      var debut = affiche.getAttribute('data-debut') || '0';
      var f = el('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&start=' + debut + '&rel=0&modestbranding=1',
        title: '/IMAGINE, court-métrage d\'Anna Apter (2023)',
        allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
        allowfullscreen: ''
      });
      affiche.replaceWith(f);
      f.focus();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Barre du haut : épisode actif et progression                         */
  /* ------------------------------------------------------------------ */
  function navigation() {
    var barre = $('#barre');
    var liens = $$('#barre nav a');
    var sections = liens.map(function (a) { return $(a.getAttribute('href')); });
    var prog = $('#progression');
    var enAttente = false;

    // Ligne de balayage à 40 % de l'écran. Les extrémités sont traitées à part :
    // une section plus courte que l'écran n'atteindrait jamais la ligne.
    function maj() {
      enAttente = false;
      var y = window.scrollY || window.pageYOffset || 0;
      var vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      var idx = -1;
      var ligne = y + vh * 0.4;
      sections.forEach(function (s, i) {
        if (s && ligne >= s.getBoundingClientRect().top + y) idx = i;
      });
      if (max > 0 && y >= max - 2) idx = sections.length - 1;
      liens.forEach(function (a, i) {
        a.classList.toggle('actif', i === idx);
        if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      barre.classList.toggle('pleine', y > 60);
      prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    function planifier() { if (!enAttente) { enAttente = true; requestAnimationFrame(maj); } }
    window.addEventListener('scroll', planifier, { passive: true });
    window.addEventListener('resize', planifier);
    window.addEventListener('load', maj);
    maj();
  }

  /* ------------------------------------------------------------------ */
  /* Révélations au défilement                                            */
  /* ------------------------------------------------------------------ */
  function revelations() {
    // Un épisode est bien plus haut que l'écran : on observe son carton-titre.
    var cibles = $$('.apparait, .carton, [data-anime]');
    if (reduit || !('IntersectionObserver' in window)) {
      $$('.episode').concat(cibles).forEach(function (c) { c.classList.add('vu'); declencher(c); });
      return;
    }
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('vu');
        if (e.target.classList.contains('carton')) e.target.parentNode.classList.add('vu');
        declencher(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    cibles.forEach(function (c) { io.observe(c); });
  }
  function declencher(c) {
    $$('[data-compteur]', c).concat(c.hasAttribute('data-compteur') ? [c] : []).forEach(compter);
  }
  function compter(n) {
    if (n.dataset.fait) return;
    n.dataset.fait = '1';
    var cible = parseFloat(n.getAttribute('data-compteur'));
    var dec = (String(cible).split('.')[1] || '').length;
    var suffixe = n.getAttribute('data-suffixe') || '';
    function ecrire(v) { n.textContent = v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffixe; }
    if (reduit) { ecrire(cible); return; }
    var t0 = null, duree = 1600;
    function pas(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / duree);
      ecrire(cible * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }

  /* ------------------------------------------------------------------ */
  /* Tableau de données repliable, sous chaque graphique                  */
  /* ------------------------------------------------------------------ */
  function tableau(titre, entetes, lignes, numCols) {
    numCols = numCols || [];
    var h = '<summary>Voir les données · ' + titre + '</summary><div class="table-wrap"><table><thead><tr>';
    entetes.forEach(function (t, i) { h += '<th' + (numCols.indexOf(i) > -1 ? ' style="text-align:right"' : '') + '>' + t + '</th>'; });
    h += '</tr></thead><tbody>';
    lignes.forEach(function (l) {
      h += '<tr>' + l.map(function (c, i) { return '<td' + (numCols.indexOf(i) > -1 ? ' class="nb"' : '') + '>' + c + '</td>'; }).join('') + '</tr>';
    });
    return el('details', { class: 'donnees' }, h + '</tbody></table></div>');
  }

  /* ------------------------------------------------------------------ */
  /* Chaîne de valeur (CNC p. 11), reconstruite en HTML                    */
  /* ------------------------------------------------------------------ */
  var ICONES = {
    crayon: '<path d="M4 20l4.2-1.1L19.3 7.8a1.6 1.6 0 000-2.3l-.8-.8a1.6 1.6 0 00-2.3 0L5.1 15.8 4 20z"/><path d="M14.5 6.5l3 3"/>',
    camera: '<rect x="2.5" y="8" width="13" height="10" rx="2"/><path d="M15.5 11.5l6-3v9l-6-3"/><circle cx="6.5" cy="5" r="2"/><circle cx="11.5" cy="5" r="2"/>',
    ecran: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
    megaphone: '<path d="M3 10v4h3l7 4.5v-13L6 10H3z"/><path d="M16.5 9.5a3.5 3.5 0 010 5M19 7a7 7 0 010 10"/>',
    salle: '<rect x="4" y="4" width="16" height="9" rx="1"/><path d="M6 18h2M11 18h2M16 18h2M5 21h14"/>',
    tele: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 3l4 4 4-4"/>',
    classeur: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 12h14M10 7.5h4M10 16.5h4"/>'
  };
  function chaine() {
    var box = $('#g-chaine');
    if (!box) return;
    D.chaine.forEach(function (e, i) {
      var cas = e.cas.length
        ? '<ul class="etape__cas">' + e.cas.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>'
        : '<p class="etape__vide">Pas d\'application directe identifiée</p>';
      box.appendChild(el('li', { class: 'etape' + (e.cas.length ? '' : ' etape--vide'), style: '--i:' + i },
        '<span class="etape__icone" aria-hidden="true"><svg viewBox="0 0 24 24">' + ICONES[e.icone] + '</svg></span>' +
        '<div class="etape__corps"><span class="etape__n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<h4 class="etape__nom">' + e.nom + (e.sous ? ' <small>(' + e.sous + ')</small>' : '') + '</h4>' + cas + '</div>'));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Graphique 1 : cas d'usage par étape de la chaîne de valeur           */
  /* ------------------------------------------------------------------ */
  function grapheEtapes() {
    var box = $('#g-etapes');
    if (!box) return;
    var max = Math.max.apply(null, D.etapes.map(function (e) { return e.cas; }));
    var wrap = el('div', { class: 'barres', role: 'list' });
    D.etapes.forEach(function (e, i) {
      var pastilles = '';
      for (var k = 0; k < 5; k++) pastilles += '<i class="' + (k < e.impact ? 'on' : '') + '"></i>';
      var ligne = el('div', { class: 'barres__ligne' + (e.cas === 0 ? ' zero' : ''), role: 'listitem', tabindex: '0',
        'aria-label': e.nom + ', ' + e.cas + ' cas d\'usage, impact ' + e.impact + ' sur 5' },
        '<span class="barres__nom">' + e.nom + '</span>' +
        '<span class="barres__piste"><span class="barres__barre" style="width:' + (e.cas / max * 78) + '%;transition-delay:' + (i * 70) + 'ms"></span>' +
        '<span class="barres__val">' + (e.cas === 0 ? 'aucun' : e.cas) +
        '<span class="pastilles" title="Impact ' + e.impact + '/5">' + pastilles + '</span></span></span>');
      wrap.appendChild(ligne);
    });
    box.appendChild(wrap);
    box.appendChild(tableau('cas d\'usage par étape', ['Étape', 'Cas d\'usage', 'Impact (sur 5)'],
      D.etapes.map(function (e) { return [e.nom, e.cas, e.impact]; }), [1, 2]));
  }

  /* ------------------------------------------------------------------ */
  /* Graphique 2 : nuage maturité × impact des 44 fiches                  */
  /* ------------------------------------------------------------------ */
  function grapheNuage() {
    var box = $('#g-nuage');
    if (!box) return;
    var W = 760, H = 560, gauche = 150, bas = 60, haut = 10, droite = 10;
    var cw = (W - gauche - droite) / 4, ch = (H - haut - bas) / 4;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Nuage de points. Maturité technologique en abscisse, impact sur les métiers en ordonnée, pour les ' + D.fiches.length + ' cas d\'usage du cinéma et de l\'audiovisuel relevés dans le rapport du CNC.');
    function s(tag, a, txt) { var e = document.createElementNS(ns, tag); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; svg.appendChild(e); return e; }

    for (var m = 0; m < 4; m++) for (var i = 0; i < 4; i++) {
      s('rect', { x: gauche + m * cw + 2, y: haut + (3 - i) * ch + 2, width: cw - 4, height: ch - 4, rx: 6,
        class: 'case' + (i === 3 ? ' chaude' : '') });
    }
    D.echelles.maturite.forEach(function (t, m) { s('text', { x: gauche + m * cw + cw / 2, y: H - bas + 22, 'text-anchor': 'middle', class: 'axe' }, t); });
    s('text', { x: gauche + 2 * cw, y: H - 8, 'text-anchor': 'middle', class: 'axe-titre' }, 'Maturité de la technologie →');
    ['Aucun', 'Assistance', 'Automatisation', 'Majorité des'].forEach(function (t, i) {
      var y = haut + (3 - i) * ch + ch / 2;
      s('text', { x: gauche - 12, y: y, 'text-anchor': 'end', class: 'axe' }, t);
      if (i >= 2) s('text', { x: gauche - 12, y: y + 16, 'text-anchor': 'end', class: 'axe' }, i === 2 ? 'partielle' : 'tâches automatisées');
    });
    s('text', { x: 14, y: haut + 2 * ch, transform: 'rotate(-90 14 ' + (haut + 2 * ch) + ')', 'text-anchor': 'middle', class: 'axe-titre' }, 'Impact sur les métiers →');

    // placement : chaque case est une petite grille de points
    var cases = {};
    D.fiches.forEach(function (f) { var k = f.m + '-' + f.i; (cases[k] = cases[k] || []).push(f); });
    var points = [];
    Object.keys(cases).forEach(function (k) {
      var liste = cases[k];
      var m = +k[0], i = +k[2];
      var cols = 5, pas = 26;
      var x0 = gauche + m * cw + cw / 2 - (Math.min(cols, liste.length) - 1) * pas / 2;
      var rangs = Math.ceil(liste.length / cols);
      var y0 = haut + (3 - i) * ch + ch / 2 - (rangs - 1) * pas / 2;
      liste.forEach(function (f, j) {
        var c = s('circle', { cx: x0 + (j % cols) * pas, cy: y0 + Math.floor(j / cols) * pas, r: 7,
          class: 'point', tabindex: '0',
          'aria-label': f.n + ', maturité ' + D.echelles.maturite[f.m] + ', impact ' + D.echelles.impact[f.i] + ', page ' + f.p });
        c._f = f;
        points.push(c);
      });
      s('text', { x: gauche + m * cw + cw - 12, y: haut + (3 - i) * ch + 26, 'text-anchor': 'end', class: 'compte' }, String(liste.length));
    });

    var bulle = el('div', { class: 'bulle', 'aria-hidden': 'true' });
    var zone = el('div', { class: 'nuage' });
    zone.appendChild(svg); zone.appendChild(bulle);

    function montrer(c) {
      var f = c._f, r = zone.getBoundingClientRect(), p = c.getBoundingClientRect();
      bulle.innerHTML = '<b>' + f.n + '</b><span>' + f.metiers + '</span><span>CNC, fiche p. ' + f.p + '</span>';
      // le conteneur peut défiler horizontalement sur petit écran
      var x = p.left - r.left + zone.scrollLeft + p.width / 2, y = p.top - r.top;
      var larg = Math.min(260, r.width);
      bulle.style.left = Math.max(zone.scrollLeft, Math.min(zone.scrollLeft + r.width - larg, x - larg / 2)) + 'px';
      bulle.style.top = (y - bulle.offsetHeight - 12 < 0 ? y + 24 : y - bulle.offsetHeight - 12) + 'px';
      bulle.classList.add('on');
    }
    function cacher() { bulle.classList.remove('on'); }
    points.forEach(function (c) {
      c.addEventListener('mouseenter', function () { montrer(c); });
      c.addEventListener('focus', function () { montrer(c); });
      c.addEventListener('mouseleave', cacher);
      c.addEventListener('blur', cacher);
    });

    box.appendChild(el('p', { class: 'nuage__glisser', 'aria-hidden': 'true' }, '← faites glisser le graphique →'));
    box.appendChild(zone);
    box.appendChild(tableau('les ' + D.fiches.length + ' fiches', ['Cas d\'usage', 'Maturité (0-3)', 'Impact (0-3)', 'Page'],
      D.fiches.map(function (f) { return [f.n, f.m, f.i, f.p]; }), [1, 2, 3]));
  }

  /* ------------------------------------------------------------------ */
  /* Graphique 3 : les 27 métiers et leur risque                           */
  /* ------------------------------------------------------------------ */
  function grapheMetiers() {
    var box = $('#g-metiers');
    if (!box) return;
    var wrap = el('div', { class: 'metiers' });
    ['art', 'tech', 'proj'].forEach(function (g) {
      var liste = D.metiers.filter(function (m) { return m.g === g; }).sort(function (a, b) { return b.r - a.r; });
      var fam = el('div', { class: 'famille' }, '<h5>' + D.familles[g] + ' · ' + liste.length + ' métiers</h5>');
      var tuiles = el('div', { class: 'tuiles' });
      liste.forEach(function (m, i) {
        tuiles.appendChild(el('div', { class: 'tuile', 'data-r': m.r, style: '--c:var(--risque-' + m.r + ');transition-delay:' + (i * 45) + 'ms' },
          m.n + '<small>' + D.risques[m.r] + '</small>'));
      });
      fam.appendChild(tuiles);
      wrap.appendChild(fam);
    });
    box.appendChild(wrap);
    box.appendChild(tableau('les 27 métiers', ['Métier', 'Famille', 'Potentiel de baisse d\'emploi'],
      D.metiers.map(function (m) { return [m.n, D.familles[m.g], D.risques[m.r]]; })));
  }

  /* ------------------------------------------------------------------ */
  /* Chiffres CVL, approches, frise                                       */
  /* ------------------------------------------------------------------ */
  function grapheCVL() {
    var box = $('#g-cvl');
    if (!box) return;
    D.cvl.forEach(function (c, i) {
      box.appendChild(el('div', { class: 'chiffre' },
        '<b class="' + (i === 0 ? 'rouge' : '') + '" data-compteur="' + c.v + '" data-suffixe="' + c.suffixe + '">0' + c.suffixe + '</b>' +
        '<span>' + c.label + '</span>'));
    });
  }
  function grapheApproches() {
    var box = $('#g-approches');
    if (!box) return;
    D.approches.forEach(function (a) {
      box.appendChild(el('div', { class: 'approche' + (a.baisse ? ' baisse' : '') },
        '<span>' + a.but + '</span><span class="fleche" aria-hidden="true">→</span><span class="effet">' + a.effet + '</span>'));
    });
  }
  function frise() {
    var box = $('#g-frise');
    if (!box) return;
    D.frise.forEach(function (f) {
      box.appendChild(el('li', { class: +f.an > 2025 ? 'futur' : '' },
        '<b>' + f.an + '</b><span>' + f.txt + '</span><small>' + f.src + '</small>'));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Perception du public (CNC, 2024)                                      */
  /* ------------------------------------------------------------------ */
  function graphePublic() {
    var box = $('#g-public');
    if (!box) return;
    var barres = el('div', { class: 'barres' });
    D.public.forEach(function (p, i) {
      barres.appendChild(el('div', { class: 'barres__ligne' },
        '<span class="barres__nom">' + p.r + '</span><span class="barres__piste">' +
        '<span class="barres__barre" style="width:' + (p.v * 0.78) + '%;transition-delay:' + (i * 90) + 'ms"></span>' +
        '<span class="barres__val">' + (p.approx ? '≈ ' : '') + p.v + ' %</span></span>'));
    });
    box.appendChild(barres);
  }

  /* ------------------------------------------------------------------ */
  /* Sondage étudiant                                                      */
  /* ------------------------------------------------------------------ */
  function grapheSondage() {
    var box = $('#g-sondage');
    if (!box) return;
    var S = D.sondage;
    if (S.placeholder) {
      box.appendChild(el('div', { class: 'provisoire', role: 'note' },
        '<span class="ico" aria-hidden="true">!</span><span><strong>Données provisoires.</strong> Le questionnaire est en cours de diffusion. ' +
        'Les barres hachurées sont des valeurs de démonstration, pas des résultats : elles seront remplacées par les vraies réponses.</span>'));
    }
    var wrap = el('div', { class: 'sondage' + (S.placeholder ? ' factice' : '') });
    S.questions.forEach(function (q) {
      var bloc = el('div', {}, '<h5>' + q.q + '</h5>');
      var barres = el('div', { class: 'barres' });
      q.reponses.forEach(function (r, i) {
        barres.appendChild(el('div', { class: 'barres__ligne' },
          '<span class="barres__nom">' + r.r + '</span><span class="barres__piste">' +
          '<span class="barres__barre" style="width:' + (r.v * 0.78) + '%;transition-delay:' + (i * 80) + 'ms"></span>' +
          '<span class="barres__val">' + r.v + ' %' + (S.placeholder ? '<small>fictif</small>' : '') + '</span></span>'));
      });
      bloc.appendChild(barres);
      wrap.appendChild(bloc);
    });
    box.appendChild(wrap);
    var n = $('#sondage-n');
    if (n) n.textContent = S.placeholder ? 'en cours' : nf.format(S.repondants) + ' répondants';
  }

  /* ------------------------------------------------------------------ */
  /* Visionneuse d'images                                                  */
  /* ------------------------------------------------------------------ */
  function visionneuse() {
    var v = el('div', { class: 'visionneuse', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Image agrandie' },
      '<button type="button">Fermer</button><img alt="">');
    document.body.appendChild(v);
    var img = $('img', v), retour = null;
    function fermer() { v.classList.remove('on'); if (retour) retour.focus(); }
    $$('.zoomable').forEach(function (z) {
      z.setAttribute('tabindex', '0');
      z.setAttribute('role', 'button');
      function ouvrir() { retour = z; img.src = z.currentSrc || z.src; img.alt = z.alt; v.classList.add('on'); $('button', v).focus(); }
      z.addEventListener('click', ouvrir);
      z.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } });
    });
    v.addEventListener('click', function (e) { if (e.target !== img) fermer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && v.classList.contains('on')) fermer(); });
  }

  /* ------------------------------------------------------------------ */
  /* Arrêt de fin d'épisode                                               */
  /* On bute sur l'écran « À suivre » : le bouton fait passer, sinon il     */
  /* faut insister (molette, doigt ou clavier) jusqu'à remplir la jauge.   */
  /* ------------------------------------------------------------------ */
  function arrets() {
    var SEUIL_MOLETTE = 800;  // défilement cumulé (px) d'un geste franc
    var SEUIL_DOIGT = 220;    // longueur de glissé (px)
    var PAUSE = 160;          // ms sans molette = nouveau geste (l'élan précédent ne compte pas)
    var FUITE = 1.1;          // la jauge se vide en continu (par seconde) : seul un geste franc la remplit

    var liste = $$('.fin-ep').map(function (f) {
      return { fin: f, suivant: $(f.getAttribute('data-suivant')), passe: false, p: 0, dernier: 0, pret: false, minuteur: null };
    }).filter(function (a) { return a.suivant; });
    if (!liste.length) return;

    // position de défilement où le bas de l'écran touche le début de l'épisode suivant
    function limite(a) { return Math.round(a.suivant.getBoundingClientRect().top + window.scrollY - window.innerHeight); }
    // premier arrêt non franchi, situé au niveau ou en dessous de la position courante
    function devant(y) {
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].passe) continue;
        var l = limite(liste[i]);
        if (l >= y - 2) return { a: liste[i], l: l };
      }
      return null;
    }
    function afficher(a) { a.fin.style.setProperty('--p', Math.max(0, Math.min(1, a.p)).toFixed(3)); }
    // fuite continue de la jauge, tant qu'elle n'est pas vide
    function relacher(a) {
      if (a.minuteur) return;
      var t0 = performance.now();
      function pas(t) {
        if (a.passe) { a.minuteur = null; return; }
        a.p = Math.max(0, a.p - (t - t0) / 1000 * FUITE);
        t0 = t;
        afficher(a);
        a.minuteur = a.p > 0 ? requestAnimationFrame(pas) : null;
      }
      a.minuteur = requestAnimationFrame(pas);
    }
    function pousser(a, dp) {
      a.p += dp; afficher(a);
      if (a.p >= 0.999) passer(a); else relacher(a);
    }
    function passer(a) {
      a.passe = true; a.p = 1; afficher(a);
      a.fin.classList.add('passe');
      liberer(1500);
      a.suivant.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
    }
    function buter(a, l) {
      window.scrollTo({ top: l, behavior: 'instant' });
      a.dernier = Date.now(); a.pret = false;
    }

    // molette et pavé tactile
    window.addEventListener('wheel', function (e) {
      if (estLibre() || e.deltaY <= 0 || e.ctrlKey) return;
      var dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      var y = window.scrollY, d = devant(y);
      if (!d) return;
      if (y < d.l - 2) {
        if (y + dy <= d.l) return;           // l'arrêt n'est pas encore atteint
        e.preventDefault(); buter(d.a, d.l);
        return;
      }
      e.preventDefault();
      var t = Date.now();
      if (t - d.a.dernier > PAUSE) d.a.pret = true;
      d.a.dernier = t;
      if (d.a.pret) pousser(d.a, dy / SEUIL_MOLETTE);
    }, { passive: false });

    // clavier : trois pressions rapprochées sur Page suivante ou Espace
    window.addEventListener('keydown', function (e) {
      if (estLibre() || e.altKey || e.ctrlKey || e.metaKey) return;
      var k = e.key;
      var poids = (k === 'PageDown' || k === 'End' || (k === ' ' && !e.shiftKey)) ? 1 / 3 : k === 'ArrowDown' ? 1 / 6 : 0;
      if (!poids) return;
      if (k === ' ' && e.target.closest && e.target.closest('button, summary, input, textarea, select')) return;
      var y = window.scrollY, d = devant(y);
      if (!d || y < d.l - 2) return;
      e.preventDefault();
      // on compte les pressions des 1,2 dernières secondes (la fuite serait trop sévère ici)
      var t = Date.now(), a = d.a;
      a.frappes = (a.frappes || []).filter(function (f) { return t - f.t < 1200; });
      a.frappes.push({ t: t, w: poids });
      var somme = a.frappes.reduce(function (s, f) { return s + f.w; }, 0);
      a.p = Math.max(a.p, somme);
      pousser(a, 0);
    });

    // doigt : un long glissé vers le haut une fois arrivé à l'arrêt
    var depart = null;
    window.addEventListener('touchstart', function () { depart = null; }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (estLibre() || e.touches.length !== 1 || !e.cancelable) return;
      var y = window.scrollY, d = devant(y);
      if (!d || y < d.l - 2) { depart = null; return; }
      var cy = e.touches[0].clientY;
      if (depart === null) depart = cy;
      var tire = depart - cy;                // > 0 : le doigt monte, la page voudrait descendre
      if (tire <= 0) return;
      e.preventDefault();
      if (d.a.minuteur) { cancelAnimationFrame(d.a.minuteur); d.a.minuteur = null; }
      d.a.p = tire / SEUIL_DOIGT; afficher(d.a);
      if (d.a.p >= 1) passer(d.a);
    }, { passive: false });
    window.addEventListener('touchend', function () {
      depart = null;
      liste.forEach(function (a) { if (!a.passe && a.p) relacher(a); });
    }, { passive: true });

    // filet de sécurité : élan inertiel, barre de défilement, touche Fin…
    var dernierY = window.scrollY;
    // Au chargement (lien profond, retour arrière), la page peut sauter sans que l'on ait
    // suivi le trajet : on repart de la position réelle, une fois tous les « load » passés.
    function resynchroniser() { setTimeout(function () { dernierY = window.scrollY; }, 0); }
    window.addEventListener('load', resynchroniser);
    window.addEventListener('pageshow', resynchroniser);
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (estLibre()) { prolonger(); dernierY = y; return; }  // prolonge tant que ça défile, dans la limite du plafond
      if (y > dernierY) {
        for (var i = 0; i < liste.length; i++) {
          var a = liste[i];
          if (a.passe) continue;
          var l = limite(a);
          if (dernierY <= l + 2 && y > l + 2) { buter(a, l); y = l; break; }
        }
      }
      dernierY = y;
    }, { passive: true });

    // liens internes (menu, cartes, appels de note, bouton « Épisode suivant ») : passage libre
    document.addEventListener('click', function (e) {
      var lien = e.target.closest && e.target.closest('a[href^="#"]');
      if (!lien) return;
      liberer(1500);
      var fin = lien.closest('.fin-ep');
      liste.forEach(function (a) {
        if (a.fin === fin) { a.passe = true; a.p = 1; afficher(a); a.fin.classList.add('passe'); }
      });
    }, true);
  }

  /* ------------------------------------------------------------------ */
  /* Compteur de mots de la composante écrite (plafond : 4 000)            */
  /* ------------------------------------------------------------------ */
  function compteMots() {
    var total = 0;
    $$('[data-compte]').forEach(function (z) {
      // nœud par nœud : deux éléments voisins ne doivent pas coller leurs mots
      var w = document.createTreeWalker(z, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) total += (n.nodeValue.match(/[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9][^\s]*/g) || []).length;
    });
    var cible = $('#nb-mots');
    if (cible) cible.textContent = nf.format(total);
    return total;
  }

  /* ------------------------------------------------------------------ */
  compteMots(); // avant le rendu des graphiques : seul le texte rédigé est compté
  generique();
  projection();
  chaine();
  grapheEtapes();
  grapheNuage();
  grapheMetiers();
  grapheCVL();
  grapheApproches();
  frise();
  graphePublic();
  grapheSondage();
  visionneuse();
  navigation();
  revelations();
  arrets();

  // Lien profond (#ep3…) : on rejoint la cible une fois la page et les graphiques en place.
  if (location.hash.length > 1) {
    liberer(4000);
    window.addEventListener('load', function () {
      var cible = document.getElementById(location.hash.slice(1));
      liberer(1500);
      if (cible) cible.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
})();
