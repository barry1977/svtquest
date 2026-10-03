# SVT Quest — Édition Collège 6e / 5e

Application éducative interactive pour réviser le chapitre **Besoins alimentaires & Équilibre nutritionnel**, conçue avec une architecture **Course Engine** évolutive pour accueillir d’autres chapitres de SVT.

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4
- Framer Motion, Lucide React, canvas-confetti

## Démarrage (local)

```bash
npm install
npm run dev
```

Puis ouvre l’URL affichée (souvent `http://localhost:5173`).

```bash
npm run build    # build de production
npm run preview  # prévisualiser le build
```

## Docker

Build + run avec Compose (port **8080** par défaut) :

```bash
docker compose up --build -d
```

Ouvre [http://localhost:8080](http://localhost:8080).

Sans Compose :

```bash
docker build -t svtquest .
docker run --rm -p 8080:80 svtquest
```

Variables utiles :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT`   | `8080` | Port hôte exposé (`PORT=3000 docker compose up -d`) |

Healthcheck : `GET /health` → `ok`.

L’image est multi-stage : build Node Alpine → serveur **nginx** Alpine (SPA + assets cachés).

## Architecture

| Chemin | Rôle |
|--------|------|
| `src/types/course.ts` | Interfaces `CourseModule`, mindmap, lab, jeux, quiz |
| `src/data/courses/` | Données découplées des composants (chapitre nutrition + stubs futurs) |
| `src/components/MindMap/` | Carte mentale SVG + mode Défi Contrôle |
| `src/components/Schemas/` | Réacteur 37°C, Digestion, Pyramide |
| `src/components/Lab/` | TP virtuel + correction barème |
| `src/components/Games/` | Tri Express + Assiette idéale |
| `src/components/Quiz/` | Flashcards 3D + QCM /20 |

Pour ajouter un chapitre : crée un fichier dans `src/data/courses/` qui respecte `CourseModule`, puis enregistre-le dans `src/data/courses/index.ts`.
