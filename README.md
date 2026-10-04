# SVT Quest — Édition Collège 6e / 5e

Application éducative interactive pour réviser le chapitre **Besoins alimentaires & Équilibre nutritionnel**, conçue avec une architecture **Course Engine** évolutive pour accueillir d’autres chapitres de SVT.

> Contexte & checklist chapitres : [`CONTEXT.md`](./CONTEXT.md) — à mentionner avec `@CONTEXT.md` pour tout nouveau chapitre.  
> Règle Cursor persistante : `.cursor/rules/svtquest-chapters.mdc`.

## Stack

- React 19 + TypeScript + Vite 6
- Express (proxy API sécurisé)
- Tailwind CSS 4
- Framer Motion, Lucide React, canvas-confetti

## Démarrage (local)

```bash
cp .env.example .env   # puis renseigne OPENAI_API_KEY
npm install
npm run dev
```

Cela lance :
- le front Vite (souvent `http://localhost:5173`)
- l’API Express sur `http://localhost:8787`

Les appels `/api/*` sont proxifiés par Vite vers le serveur. **La clé OpenAI ne part jamais dans le bundle navigateur.**

```bash
npm run build    # build de production
npm start        # sert dist + API (PORT=8787 par défaut)
```

## Mode opératoire (stop / restart)

Fichier `Makefile` à la racine :

```bash
make start           # démarre API + Vite
make stop            # arrête le local
make restart         # redémarre le local
make status          # ports web / api / docker

make docker-start    # build + up
make docker-stop     # down
make docker-restart  # rebuild + up
```

Équivalents npm : `npm run app:start` · `app:stop` · `app:restart` · `app:status`.

## Variables d’environnement (serveur uniquement)

Copie `.env.example` → `.env` :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `OPENAI_API_KEY` | — | Clé API OpenAI (obligatoire pour générer des QCM) |
| `OPENAI_MODEL` | `gpt-4o-mini` | Modèle de génération |
| `OPENAI_QUESTION_COUNT` | `10` | Nombre de questions par génération |
| `PORT` | `8787` (dev) / `80` (Docker) | Port du serveur Node |

Ne préfixe **jamais** ces variables avec `VITE_` : tout ce qui commence par `VITE_` serait exposé au navigateur.

## Déploiement Vercel

1. Importe le repo sur [Vercel](https://vercel.com).
2. Dans **Project Settings → Environment Variables**, ajoute (Production / Preview) :

| Name | Value | Sensitive |
|------|-------|-----------|
| `OPENAI_API_KEY` | ta clé `sk-...` | oui |
| `OPENAI_MODEL` | `gpt-4o-mini` | non |
| `OPENAI_QUESTION_COUNT` | `10` | non |

3. Ne mets **pas** de préfixe `VITE_` : ces variables restent côté fonctions serverless (`/api/*`).
4. En local, utilise `.env` (ignoré par git). Sur Vercel, le dashboard remplace `.env`.

Les routes `api/config.js`, `api/generate-quiz.js`, `api/generate-lab.js` et `api/generate-sort.js` exposent la même API que le serveur Express local.

## Docker

Build + run avec Compose (port **8080** par défaut) :

```bash
cp .env.example .env   # renseigne OPENAI_API_KEY
docker compose up --build -d
```

Ouvre [http://localhost:8080](http://localhost:8080).

Sans Compose :

```bash
docker build -t svtquest .
docker run --rm -p 8080:80 --env-file .env svtquest
```

| Variable | Défaut | Description |
|----------|--------|-------------|
| `HOST_PORT` | `8080` | Port hôte exposé (`HOST_PORT=3000 docker compose up -d`) |

Healthcheck : `GET /health` → `ok`.

L’image est multi-stage : build Node Alpine → runtime Node (SPA + `/api/*`). Les secrets sont injectés au runtime, pas au build.

## Architecture

| Chemin | Rôle |
|--------|------|
| `src/types/course.ts` | Interfaces `CourseModule`, mindmap, lab, jeux, quiz |
| `src/data/courses/` | Données découplées des composants (chapitre nutrition + stubs futurs) |
| `server/` | Proxy Express : OpenAI, secrets, `/api/generate-quiz` |
| `src/components/MindMap/` | Carte mentale SVG + mode Défi Contrôle |
| `src/components/Schemas/` | Réacteur 37°C, Digestion, Pyramide |
| `src/components/Lab/` | TP virtuel + correction barème |
| `src/components/Games/` | Tri Express + Assiette idéale |
| `src/components/Quiz/` | Flashcards 3D + QCM /20 (+ génération IA) |

Pour ajouter un chapitre : crée un fichier dans `src/data/courses/` qui respecte `CourseModule`, puis enregistre-le dans `src/data/courses/index.ts`.
