# SVT Quest — Contexte projet (obligatoire pour les prochains chapitres)

À utiliser dans tout nouveau prompt concernant un chapitre, une feature ou un fix :
`@CONTEXT.md`

Dernière mise à jour : 2026-10-04.

---

## Qu’est-ce que c’est ?

Application éducative SVT collège (**6e / 5e**).

Chapitre de référence (modèle à imiter) :
**Besoins alimentaires & Équilibre nutritionnel** → `src/data/courses/nutrition.ts`

Architecture **Course Engine** : données de chapitre découplées des composants UI.

Public : élèves collège → ton ludique, clair, **sans jargon** (pas de « IA », « OpenAI », « API » dans l’UI visible).

---

## Checklist OBLIGATOIRE — nouveau chapitre

Quand l’utilisateur demande un nouveau chapitre, respecter **tout** ceci :

### 1. Course Engine
- [ ] Créer `src/data/courses/<id>.ts` qui respecte pleinement `CourseModule` (`src/types/course.ts`)
- [ ] L’enregistrer dans `src/data/courses/index.ts` (`available: true` quand prêt)
- [ ] Étendre les types **avant** d’ajouter des champs non prévus
- [ ] S’inspirer de `nutrition.ts` pour la richesse du contenu (pas un stub vide)

### 2. Contenu pédagogique attendu (toutes les sections)
Chaque chapitre doit fournir :
- [ ] **Summary** : objectifs, points clés, à retenir, roadmap
- [ ] **Mind map** : racine + branches + enfants, icônes, quizzes Défi sur certains nœuds
- [ ] **Schémas** : 1 à 3 schémas adaptés au thème (`reactor` / `digestion` / `pyramid` ou nouveaux `kind` si besoin)
- [ ] **Labo TP** : mission ludique, étapes, échantillons, réactifs, expériences, témoin, conclusion, compétences, défi final
- [ ] **Mini-jeux** : au moins un jeu pertinent au thème (tri / assiette ou équivalent)
- [ ] **Flashcards** + **QCM** (~10 questions) avec explications et `tipOnError`

### 3. Carte mentale (retours utilisateurs)
- [ ] Libellés **multi-lignes** qui tiennent dans les cercles (pas de débordement)
- [ ] Toute la carte **entièrement visible** dans le cadre au chargement (viewBox calculé + padding)
- [ ] Zoom / pan optionnels ; bouton « tout voir » pour recentrer
- [ ] Mode Défi Contrôle avec nœuds `?` + quiz

### 4. Schémas / pyramide / visuels
- [ ] Icônes / emojis **lisibles** (classe `.emoji` ou font emoji en secours — Nunito peut masquer les emojis)
- [ ] Pour une pyramide / listes d’exemples : `foods` (ou équivalent) avec emoji + nom sur chaque étage
- [ ] Pas de layout qui coupe le contenu hors cadre

### 5. Labo TP
- [ ] TP **élaboré et ludique** par défaut (mission, protocole, progression, défi)
- [ ] Bouton **« Nouveau TP »** (sans dire « IA ») → génération serveur avec **fallback** = TP du cours
- [ ] Toujours un **témoin** quand c’est expérimentalement pertinent
- [ ] Correction détaillée + conclusion type « J’observe… donc je déduis… »

### 6. Mini-jeux
- [ ] Pool d’items **large** ; chaque partie tire un sous-ensemble **varié**
- [ ] Éviter de toujours rejouer les mêmes items (`pickSortRound` + mémoire des récents, ou équivalent)
- [ ] Génération optionnelle via API avec liste d’exclusion des items déjà vus
- [ ] « Rejouer » doit **vraiment** changer l’ordre / le tirage (pas seulement reset d’index)
- [ ] Libellés : « Nouveaux aliments », « Nouveau QCM », « Nouveau TP » — **jamais** « (IA) »

### 7. Quiz / génération
- [ ] QCM du cours + bouton **« Nouveau QCM »**
- [ ] Génération via `buildLessonContext(course)` → `/api/generate-*`
- [ ] Clés API **uniquement serveur** (pas de `VITE_OPENAI_*`)
- [ ] Si pas de clé / erreur → le contenu du cours reste jouable
- [ ] Pas de messages UI du type « configure OPENAI_API_KEY » destinés aux élèves (garder simple : « Génération indisponible »)

### 8. UX / motion
- [ ] Confetti via canvas **transparent** (`src/lib/confetti.ts`) — éviter flash noir avec `backdrop-filter`
- [ ] Ne pas lancer de confetti agressif à chaque micro-action (ex. tri : plutôt fin de manche)
- [ ] Animations Framer légères ; pas d’écran vide/noir entre deux états

### 9. Qualité
- [ ] `npm run lint` OK
- [ ] Mobile-friendly (touch targets, textes lisibles)
- [ ] Cohérence visuelle avec le chapitre nutrition (couleurs `colorScheme`, ton collège)
- [ ] Mettre à jour ce `CONTEXT.md` si de nouvelles règles apparaissent

---

## Stack

| Couche | Techno |
|--------|--------|
| Front | React 19, TypeScript, Vite 6, Tailwind 4, Framer Motion, Lucide, canvas-confetti |
| API locale | Express 5 (`server/index.mjs`) |
| API Vercel | Serverless `api/*.js` |
| Ops | `Makefile` (`make start\|stop\|restart\|status`) |
| Deploy | Docker (Node SPA+API) et/ou Vercel |

---

## Commandes

```bash
npm install
npm run dev          # API :8787 + Vite :5173
make stop | restart | status
make docker-start | docker-stop | docker-restart   # HOST_PORT (souvent 8088)
npm run lint
npm run build && npm start
```

- Front : http://localhost:5173/
- API : http://localhost:8787/health
- Docker : http://localhost:${HOST_PORT}/

---

## Sécurité / secrets (CRITIQUE)

- Secrets **uniquement serveur** (`.env`, Vercel env, Docker env)
- **Jamais** de préfixe `VITE_` pour les secrets
- `.env` gitignored ; `.env.example` versionné sans secret
- Front → `/api/*` seulement (proxy Vite en dev)

| Variable | Rôle |
|----------|------|
| `OPENAI_API_KEY` | Active génération quiz / lab / tri |
| `OPENAI_MODEL` | défaut `gpt-4o-mini` |
| `OPENAI_QUESTION_COUNT` | nb questions QCM |
| `PORT` | port Node (dev `8787`, Docker interne `80`) |
| `HOST_PORT` | port hôte Docker **uniquement** (≠ `PORT`) |

---

## Structure

```
src/types/course.ts
src/data/courses/          # un fichier par chapitre
src/components/{Summary,MindMap,Schemas,Lab,Games,Quiz,layout}/
src/lib/{lessonContext,quizApi,sortDeck,confetti}.ts
server/{index,generateQuiz,generateLab,generateSortGame}.mjs
api/{config,generate-quiz,generate-lab,generate-sort}.js
Makefile
CONTEXT.md                 # ce fichier
.cursor/rules/             # règles agent persistantes
```

---

## Remarques utilisateurs à ne pas reproduire (bugs déjà vus)

| Problème | Règle durable |
|----------|----------------|
| Textes hors cercles (mind map) | Wrap + clip + tailles adaptées |
| Carte mentale coupée dans le cadre | Layout + viewBox fit + padding ; tout visible au load |
| Icônes pyramide invisibles | Font emoji / badges blancs / pas Nunito seul |
| Tri « aléatoire » toujours les mêmes items | Grand pool + tirage + exclusion des récents |
| Rejouer ne mélange pas | Invalider le deck (shuffleKey / nouveau tirage) |
| Écran noir à chaque bonne réponse | Confetti canvas transparent ; pas à chaque clic |
| Boutons « … (IA) » | Libellés neutres pour les élèves |
| Clé API dans le front | Interdit — proxy serveur / Vercel only |

---

## Déploiement Vercel

- Build → `dist` ; functions `api/*.js`
- Env : `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_QUESTION_COUNT` (sans `VITE_`)
- `vercel.json` : rewrites SPA sans capturer `/api/*`

---

## Chapitres stubs déjà listés (à remplir plus tard)

Dans `src/data/courses/index.ts` (aujourd’hui `available: false`) :
- respiration-5e
- reproduction-5e
- ecosystemes-6e
- terre-risques-5e

Quand l’utilisateur dit « fais le chapitre X », **remplir vraiment** le module (pas seulement changer le titre du stub).

---

## Comment démarrer un prompt futur

> `@CONTEXT.md` Crée le chapitre « La respiration et l’effort » (5e) en suivant la checklist nouveaux chapitres.

L’agent doit :
1. Lire ce fichier
2. Suivre la checklist
3. Prendre `nutrition.ts` comme référence de richesse
4. Brancher génération + fallback
5. Vérifier mind map (textes + cadre), jeux variés, UI sans jargon
