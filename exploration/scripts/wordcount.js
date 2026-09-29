#!/usr/bin/env node
/*
 * Compte les mots de la composante écrite du site (plafond : 4 000).
 * Seul le texte placé dans un élément portant l'attribut data-compte est compté,
 * exactement comme le compteur affiché dans le générique de fin.
 *
 * Usage : node exploration/scripts/wordcount.js
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, '');

const VIDES = new Set(['img', 'br', 'hr', 'meta', 'link', 'input', 'source', 'wbr']);
const MOT = /[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9][^\s]*/g;
const entites = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ');

const pile = [];           // pour chaque balise ouverte : est-ce le début d'une zone comptée ?
let profondeur = 0;        // nombre de zones comptées ouvertes
let total = 0;
const parEpisode = {};
let episode = 'avant';

const re = /<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g;
let m;
while ((m = re.exec(html))) {
  if (m[4] !== undefined) {
    if (profondeur > 0) {
      const n = (entites(m[4]).match(MOT) || []).length;
      total += n;
      parEpisode[episode] = (parEpisode[episode] || 0) + n;
    }
    continue;
  }
  const [, fermante, tag, attrs] = m;
  const t = tag.toLowerCase();
  if (VIDES.has(t) || /\/\s*$/.test(attrs)) continue;
  if (fermante) {
    const zone = pile.pop();
    if (zone) profondeur--;
  } else {
    const id = /\sid="(ep\d)"/.exec(attrs);
    if (id) episode = id[1];
    if (/\sid="generique"/.test(attrs)) episode = 'generique';
    const zone = /\sdata-compte(\s|=|$)/.test(attrs);
    pile.push(zone);
    if (zone) profondeur++;
  }
}

console.log('Mots par partie :');
for (const [k, v] of Object.entries(parEpisode)) console.log(`  ${k.padEnd(10)} ${v}`);
console.log(`\nTotal : ${total} mots / 4000 ${total <= 4000 ? '✔' : '✘ DÉPASSEMENT'}`);
process.exit(total <= 4000 ? 0 : 1);
