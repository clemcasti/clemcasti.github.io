/* REMPLACER / TRANSFORMER — comportements du site. Aucune dépendance. */
(function () {
  'use strict';

  var D = window.DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nf = new Intl.NumberFormat('fr-FR');

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
        'aria-label': e.nom + ' : ' + e.cas + ' cas d\'usage, impact ' + e.impact + ' sur 5' },
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
  /* Graphique 2 : nuage maturité × impact des 62 fiches                  */
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
    svg.setAttribute('aria-label', 'Nuage de points : maturité technologique en abscisse, impact sur les métiers en ordonnée, pour les 62 cas d\'usage du rapport du CNC.');
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
      var liste = cases[k].slice().sort(function (a, b) { return (a.f === 'jv') - (b.f === 'jv'); });
      var m = +k[0], i = +k[2];
      var cols = 5, pas = 26;
      var x0 = gauche + m * cw + cw / 2 - (Math.min(cols, liste.length) - 1) * pas / 2;
      var rangs = Math.ceil(liste.length / cols);
      var y0 = haut + (3 - i) * ch + ch / 2 - (rangs - 1) * pas / 2;
      liste.forEach(function (f, j) {
        var c = s('circle', { cx: x0 + (j % cols) * pas, cy: y0 + Math.floor(j / cols) * pas, r: 7,
          class: 'point' + (f.f === 'jv' ? ' jv' : ''), tabindex: '0',
          'aria-label': f.n + ', maturité ' + D.echelles.maturite[f.m] + ', impact ' + D.echelles.impact[f.i] + ', page ' + f.p });
        c._f = f;
        points.push(c);
      });
      var compte = s('text', { x: gauche + m * cw + cw - 12, y: haut + (3 - i) * ch + 26, 'text-anchor': 'end', class: 'compte' }, '');
      compte._cle = k;
    });

    var bulle = el('div', { class: 'bulle', 'aria-hidden': 'true' });
    var zone = el('div', { class: 'nuage' });
    zone.appendChild(svg); zone.appendChild(bulle);

    function montrer(c) {
      var f = c._f, r = zone.getBoundingClientRect(), p = c.getBoundingClientRect();
      bulle.innerHTML = '<b>' + f.n + '</b><span>' + f.metiers + '</span><span>' +
        ({ ca: 'Cinéma et audiovisuel', jv: 'Jeu vidéo', both: 'Cinéma, audiovisuel et jeu vidéo' })[f.f] + ' · CNC p. ' + f.p + '</span>';
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

    // filtre de filière
    var filtres = $('#f-nuage');
    function appliquer(tout) {
      points.forEach(function (c) {
        var cache = !tout && c._f.f === 'jv';
        c.classList.toggle('masque', cache);
        if (cache) c.setAttribute('tabindex', '-1'); else c.setAttribute('tabindex', '0');
      });
      $$('text.compte', svg).forEach(function (t) {
        var n = (cases[t._cle] || []).filter(function (f) { return tout || f.f !== 'jv'; }).length;
        t.textContent = n ? n : '';
      });
      $$('button', filtres).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.tout === '1') === tout)); });
      var total = D.fiches.filter(function (f) { return tout || f.f !== 'jv'; }).length;
      $('#nuage-total').textContent = total;
    }
    $$('button', filtres).forEach(function (b) { b.addEventListener('click', function () { appliquer(b.dataset.tout === '1'); }); });

    box.appendChild(el('p', { class: 'nuage__glisser', 'aria-hidden': 'true' }, '← faites glisser le graphique →'));
    box.appendChild(zone);
    appliquer(false);
    box.appendChild(tableau('les 62 fiches', ['Cas d\'usage', 'Filière', 'Maturité (0-3)', 'Impact (0-3)', 'Page'],
      D.fiches.map(function (f) { return [f.n, ({ ca: 'Cinéma, AV', jv: 'Jeu vidéo', both: 'Les deux' })[f.f], f.m, f.i, f.p]; }), [2, 3, 4]));
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

  // Lien profond (#ep3…) : on rejoint la cible une fois la page et les graphiques en place.
  if (location.hash.length > 1) {
    window.addEventListener('load', function () {
      var cible = document.getElementById(location.hash.slice(1));
      if (cible) cible.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
})();
