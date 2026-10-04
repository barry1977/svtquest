import type { CourseModule } from '@/types/course'

export const nutritionCourse: CourseModule = {
  id: 'nutrition-6e',
  title: 'Besoins alimentaires & Équilibre nutritionnel',
  level: '6ème',
  icon: '🥗',
  shortDescription:
    'Découvre pourquoi tu manges, comment varient tes besoins et comment composer une assiette équilibrée.',
  available: true,
  colorScheme: {
    primary: '#10B981',
    secondary: '#F97316',
    accent: '#0284C7',
    soft: '#D1FAE5',
  },
  summary: {
    heroTitle: 'Besoins alimentaires & Équilibre nutritionnel',
    heroSubtitle:
      'Avant de plonger dans les activités, voici le fil rouge du chapitre : pourquoi on mange, pourquoi les besoins changent, et comment bien composer son assiette.',
    objectives: [
      'Expliquer les 3 raisons de manger : énergie, construction, réparation',
      'Relier l\'âge, le sexe, l\'activité et le froid aux besoins en kJ',
      'Classer les aliments : bâtisseurs, énergétiques, fonctionnels',
      'Utiliser la pyramide pour viser un équilibre alimentaire',
      'Interpréter un test de laboratoire (amidon, calcium, lipides…)',
    ],
    keyPoints: [
      {
        id: 'pourquoi',
        icon: '❓',
        title: 'Pourquoi mange-t-on ?',
        text: 'Pour fournir de l\'énergie (mesurée en kJ), fabriquer de nouvelles cellules et réparer celles qui s\'usent — même à l\'âge adulte.',
        color: '#F97316',
      },
      {
        id: 'varient',
        icon: '📊',
        title: 'Des besoins variables',
        text: 'Croissance, sexe, sport et grand froid augmentent la dépense énergétique. Le corps maintient environ 37°C.',
        color: '#0284C7',
      },
      {
        id: 'categories',
        icon: '🍽️',
        title: '3 familles d\'aliments',
        text: 'Bâtisseurs (protéines, calcium), énergétiques (glucides, lipides) et fonctionnels (vitamines, fibres, eau).',
        color: '#8B5CF6',
      },
      {
        id: 'nutriments',
        icon: '💡',
        title: 'Aliment ≠ nutriment',
        text: 'La digestion découpe les aliments en nutriments microscopiques. Un seul aliment (ex. le lait) en contient plusieurs.',
        color: '#10B981',
      },
      {
        id: 'equilibre',
        icon: '⚖️',
        title: 'L\'équilibre alimentaire',
        text: 'Règle d\'or : variété, quantités adaptées, régularité. Eau à volonté ; douceurs limitées.',
        color: '#F59E0B',
      },
      {
        id: 'tp',
        icon: '🧪',
        title: 'Prouver les nutriments',
        text: 'Lugol → amidon ; Fehling → sucres ; oxalate → calcium ; papier → lipides. Un témoin (eau) valide l\'expérience.',
        color: '#8B5CF6',
      },
    ],
    remember: [
      'Métabolisme de base = énergie minimale au repos pour vivre à 37°C',
      'Vitamine = indispensable en petite quantité, sans énergie directe',
      'Pyramide : plus c\'est en bas, plus on peut en consommer souvent',
      'Conclusion type TP : « J\'observe que… donc je déduis que… »',
    ],
    roadmap: [
      {
        section: 'mindmap',
        label: 'Carte mentale',
        blurb: 'Vue d\'ensemble interactive + mode Défi Contrôle',
      },
      {
        section: 'schemas',
        label: 'Schémas',
        blurb: 'Réacteur 37°C, digestion, pyramide',
      },
      {
        section: 'lab',
        label: 'Labo TP',
        blurb: 'Manipule et compare à la correction',
      },
      {
        section: 'games',
        label: 'Mini-jeux',
        blurb: 'Tri express et assiette idéale',
      },
      {
        section: 'quiz',
        label: 'Révision',
        blurb: 'Flashcards + QCM noté sur 20',
      },
    ],
  },
  mindmap: {
    id: 'root',
    label: 'Les Besoins Alimentaires de l\'Être Humain',
    description:
      'Manger sert à fournir de l\'énergie, construire le corps et le réparer. Un équilibre alimentaire varie selon l\'âge, le sexe, l\'activité et la température.',
    icon: '🧑',
    children: [
      {
        id: 'pourquoi',
        label: 'Pourquoi mangeons-nous ?',
        description:
          'Les aliments apportent l\'énergie et les matériaux nécessaires à la vie.',
        icon: '❓',
        children: [
          {
            id: 'energie',
            label: 'Énergie',
            icon: '⚡',
            description:
              'Fonctions vitales (cœur, poumons, 37°C constant), efforts physiques et intellectuels. L\'énergie se mesure en kilojoules (kJ).',
            quiz: {
              prompt: 'Dans quelle unité mesure-t-on l\'énergie des aliments ?',
              options: [
                { id: 'e1', label: 'Kilojoules (kJ)', correct: true },
                { id: 'e2', label: 'Litres (L)', correct: false },
                { id: 'e3', label: 'Grammes (g)', correct: false },
              ],
            },
          },
          {
            id: 'construire',
            label: 'Construire & Grandir',
            icon: '🧱',
            description:
              'Fabriquer de nouvelles cellules et organes : os, muscles, peau… surtout pendant la croissance.',
            quiz: {
              prompt: 'À quoi sert principalement la construction du corps ?',
              options: [
                { id: 'c1', label: 'Fabriquer de nouvelles cellules', correct: true },
                { id: 'c2', label: 'Refroidir le corps', correct: false },
                { id: 'c3', label: 'Digérer l\'eau seule', correct: false },
              ],
            },
          },
          {
            id: 'entretenir',
            label: 'Entretenir & Réparer',
            icon: '🔧',
            description:
              'Remplacer les cellules abîmées ou âgées — même à l\'âge adulte, le corps se renouvelle sans cesse.',
          },
        ],
      },
      {
        id: 'varient',
        label: 'Pourquoi les besoins varient-ils ?',
        description:
          'Les besoins énergétiques et nutritionnels ne sont pas les mêmes pour tout le monde.',
        icon: '📊',
        children: [
          {
            id: 'age',
            label: 'Âge',
            icon: '👶',
            description:
              'Forte croissance chez l\'enfant et l\'adolescent → besoins plus élevés en énergie et en protéines.',
            quiz: {
              prompt: 'Quand les besoins alimentaires sont-ils particulièrement élevés ?',
              options: [
                { id: 'a1', label: 'Pendant la croissance', correct: true },
                { id: 'a2', label: 'Uniquement le dimanche', correct: false },
                { id: 'a3', label: 'Jamais avant 18 ans', correct: false },
              ],
            },
          },
          {
            id: 'sexe',
            label: 'Sexe',
            icon: '⚧',
            description:
              'Le besoin énergétique masculin est généralement supérieur (masse musculaire moyenne plus importante).',
          },
          {
            id: 'activite',
            label: 'Activité physique',
            icon: '🏃',
            description:
              'Plus d\'effort musculaire = plus de dépenses en kJ. Un sportif dépense bien plus qu\'une personne au repos.',
          },
          {
            id: 'temperature',
            label: 'Température extérieure',
            icon: '❄️',
            description:
              'Par grand froid, le corps brûle plus d\'énergie pour maintenir 37°C constants.',
          },
        ],
      },
      {
        id: 'categories',
        label: 'Les catégories d\'aliments',
        description:
          'On classe les aliments selon leur rôle principal dans l\'organisme.',
        icon: '🍽️',
        children: [
          {
            id: 'batisseurs',
            label: 'Bâtisseurs',
            icon: '🧱',
            description:
              'Os et muscles : riches en protéines et calcium (viande, poisson, œufs, légumineuses, produits laitiers).',
            quiz: {
              prompt: 'Quel nutriment caractérise surtout les aliments bâtisseurs ?',
              options: [
                { id: 'b1', label: 'Protéines (et calcium)', correct: true },
                { id: 'b2', label: 'Sucres rapides seuls', correct: false },
                { id: 'b3', label: 'Colorants alimentaires', correct: false },
              ],
            },
          },
          {
            id: 'energetiques',
            label: 'Énergétiques',
            icon: '⚡',
            description:
              'Carburant immédiat et réserves : glucides (pain, pâtes, fruits) et lipides (huiles, beurre, fruits secs).',
          },
          {
            id: 'fonctionnels',
            label: 'Fonctionnels',
            icon: '🛡️',
            description:
              'Protection et santé : vitamines, fibres et sels minéraux (fruits, légumes, eau).',
          },
          {
            id: 'subtilite',
            label: 'Subtilité : nutriments',
            icon: '💡',
            description:
              'Les aliments se digèrent en nutriments microscopiques. Un seul aliment (ex. le lait) en contient plusieurs !',
          },
        ],
      },
      {
        id: 'equilibre',
        label: 'L\'Équilibre Alimentaire',
        description:
          'Bien manger, c\'est varier, adapter les quantités et rester régulier dans le temps.',
        icon: '⚖️',
        children: [
          {
            id: 'pyramide',
            label: 'Pyramide alimentaire',
            icon: '📐',
            description:
              'Eau à volonté → végétaux → féculents → produits laitiers → VPO/légumineuses → lipides modérés → douceurs limitées.',
            quiz: {
              prompt: 'Que trouve-t-on à la base de la pyramide alimentaire ?',
              options: [
                { id: 'p1', label: 'L\'eau (à volonté)', correct: true },
                { id: 'p2', label: 'Les bonbons', correct: false },
                { id: 'p3', label: 'Les fritures', correct: false },
              ],
            },
          },
          {
            id: 'regle-or',
            label: 'Règle d\'or',
            icon: '🎯',
            description:
              'Variété, quantités adaptées à tes besoins, et régularité sur la durée — pas de régime extrême !',
          },
        ],
      },
    ],
  },
  schemas: [
    {
      id: 'reactor',
      title: 'Le Réacteur Humain & les 37°C',
      subtitle: 'Comment ton corps brûle de l\'énergie pour rester en vie',
      kind: 'reactor',
      legend:
        'Le métabolisme de base est l\'énergie brûlée même en dormant au chaud sur ton canapé : cœur, respiration et maintien à 37°C.',
      controls: [
        {
          id: 'weather',
          label: 'Curseur Météo',
          type: 'slider',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 20,
          leftLabel: 'Glacial ❄️',
          rightLabel: 'Chaud ☀️',
        },
        {
          id: 'activity',
          label: 'Curseur Activité',
          type: 'slider',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 10,
          leftLabel: 'Sommeil 😴',
          rightLabel: 'Course 🏃',
        },
      ],
    },
    {
      id: 'digestion',
      title: 'De l\'Aliment au Nutriment',
      subtitle: 'La digestion décomposée en 3 étapes',
      kind: 'digestion',
      legend:
        'Un seul aliment contient généralement plusieurs nutriments différents ! Exemple du lait : eau, calcium, lipides, glucides, protéines.',
      steps: [
        {
          title: 'L\'assiette',
          description: 'Aliments complexes : lait, pomme, poulet…',
        },
        {
          title: 'L\'usine digestive',
          description: 'Découpage mécanique et chimique des aliments.',
        },
        {
          title: 'Les nutriments',
          description: 'Perles microscopiques qui circulent dans le sang.',
        },
      ],
    },
    {
      id: 'pyramid',
      title: 'La Pyramide Interactive Échelonnée',
      subtitle: 'Clique sur un étage pour découvrir son rôle',
      kind: 'pyramid',
      legend:
        'Plus un aliment est vers le bas, plus on peut en consommer souvent. Les douceurs restent au sommet, en petite quantité.',
      tiers: [
        {
          id: 'douceurs',
          label: 'Douceurs & sucreries',
          frequency: 'Limitées (occasionnellement)',
          role: 'Plaisir — à consommer avec modération',
          family: 'Énergétique',
          color: '#F472B6',
          foods: [
            { emoji: '🍬', name: 'Bonbons' },
            { emoji: '🍫', name: 'Chocolat' },
            { emoji: '🍩', name: 'Beignet' },
            { emoji: '🥤', name: 'Soda' },
          ],
        },
        {
          id: 'lipides',
          label: 'Matières grasses',
          frequency: 'Avec modération',
          role: 'Réserves d\'énergie et vitamines liposolubles',
          family: 'Énergétique',
          color: '#FBBF24',
          foods: [
            { emoji: '🧈', name: 'Beurre' },
            { emoji: '🫒', name: 'Huile d\'olive' },
            { emoji: '🥑', name: 'Avocat' },
            { emoji: '🥜', name: 'Noix' },
          ],
        },
        {
          id: 'vpo',
          label: 'Viandes, poissons, œufs, légumineuses',
          frequency: '1 à 2 fois/jour (poisson 1–2×/semaine)',
          role: 'Protéines pour construire muscles et organes',
          family: 'Bâtisseur',
          color: '#F97316',
          foods: [
            { emoji: '🍗', name: 'Poulet' },
            { emoji: '🐟', name: 'Poisson' },
            { emoji: '🥚', name: 'Œuf' },
            { emoji: '🥗', name: 'Légumineuses' },
          ],
        },
        {
          id: 'laitiers',
          label: 'Produits laitiers',
          frequency: '3 produits par jour',
          role: 'Calcium pour des os solides',
          family: 'Bâtisseur',
          color: '#8B5CF6',
          foods: [
            { emoji: '🥛', name: 'Lait' },
            { emoji: '🧀', name: 'Fromage' },
            { emoji: '🥣', name: 'Yaourt' },
          ],
        },
        {
          id: 'feculents',
          label: 'Féculents',
          frequency: 'À chaque repas',
          role: 'Énergie durable (glucides complexes)',
          family: 'Énergétique',
          color: '#F59E0B',
          foods: [
            { emoji: '🍞', name: 'Pain' },
            { emoji: '🍝', name: 'Pâtes' },
            { emoji: '🍚', name: 'Riz' },
            { emoji: '🥔', name: 'Pomme de terre' },
          ],
        },
        {
          id: 'vegetaux',
          label: 'Fruits & légumes',
          frequency: 'Au moins 5 portions/jour',
          role: 'Vitamines, fibres et minéraux protecteurs',
          family: 'Fonctionnel',
          color: '#10B981',
          foods: [
            { emoji: '🍎', name: 'Pomme' },
            { emoji: '🥕', name: 'Carotte' },
            { emoji: '🥦', name: 'Brocoli' },
            { emoji: '🍌', name: 'Banane' },
            { emoji: '🍊', name: 'Orange' },
          ],
        },
        {
          id: 'eau',
          label: 'Eau',
          frequency: 'À volonté',
          role: 'Hydratation indispensable à toutes les fonctions',
          family: 'Base',
          color: '#0284C7',
          foods: [
            { emoji: '💧', name: 'Eau' },
            { emoji: '🚰', name: 'Robinet' },
            { emoji: '🧴', name: 'Gourde' },
          ],
        },
      ],
    },
  ],
  labPractical: {
    title: 'Mission Cantine : traque les nutriments !',
    missionBrief:
      'Chef Nutri a reçu des plateaux mystères de la cantine. Enfile ta blouse virtuelle : tu dois prouver quels nutriments se cachent dans chaque aliment… et démasquer l’intrus !',
    problem:
      'Comment prouver expérimentalement qu’un aliment peut contenir plusieurs nutriments (amidon, sucres, calcium, lipides) et pourquoi un témoin est indispensable ?',
    steps: [
      {
        title: '1. Choisis un échantillon',
        description: 'Prends un aliment (ou le témoin eau) sur la paillasse.',
      },
      {
        title: '2. Sélectionne un réactif',
        description: 'Chaque réactif cible un nutriment précis — lis bien ce qu’il teste.',
      },
      {
        title: '3. Verse et observe',
        description: 'Lance le test, note la couleur / le dépôt, puis interprète.',
      },
      {
        title: '4. Compare au témoin',
        description: 'Sans témoin négatif, on ne peut pas conclure scientifiquement.',
      },
      {
        title: '5. Relève le défi final',
        description: 'Quand tu as assez de preuves, démasque l’aliment mystère !',
      },
    ],
    samples: [
      { id: 'pain', name: 'Morceau de pain', emoji: '🍞' },
      { id: 'lait', name: 'Goutte de lait', emoji: '🥛' },
      { id: 'pomme', name: 'Jus de pomme', emoji: '🍎' },
      { id: 'pate', name: 'Pâte cuite', emoji: '🍝' },
      { id: 'yaourt', name: 'Yaourt nature', emoji: '🥣' },
      { id: 'beurre', name: 'Beurre', emoji: '🧈' },
      { id: 'huile', name: 'Huile', emoji: '🫒' },
      { id: 'eau', name: 'Eau distillée (témoin)', emoji: '💧' },
    ],
    reagents: [
      {
        id: 'lugol',
        name: 'Eau iodée (Lugol)',
        description: 'Compte-gouttes ambré — vire au violet-noir si amidon',
        testsFor: 'Amidon (glucide complexe)',
      },
      {
        id: 'fehling',
        name: 'Liqueur de Fehling (+ chauffage)',
        description: 'Tube + flamme douce — précipité brique si glucose',
        testsFor: 'Sucres simples (glucose)',
      },
      {
        id: 'oxalate',
        name: 'Oxalate d\'ammonium',
        description: 'Réactif blanc — précipité si calcium',
        testsFor: 'Présence de calcium',
      },
      {
        id: 'papier',
        name: 'Papier blanc',
        description: 'Tache translucide persistante = lipides',
        testsFor: 'Lipides (tache grasse)',
      },
    ],
    experiments: [
      {
        id: 'pain-lugol',
        sampleId: 'pain',
        reagentId: 'lugol',
        observation: 'Coloration violet / noir immédiate',
        interpretation: 'Présence d\'amidon (glucide énergétique)',
        resultColor: '#4C1D95',
        visualHint: '💥 Jackpot violet-noir : le pain cache de l\'amidon !',
      },
      {
        id: 'pate-lugol',
        sampleId: 'pate',
        reagentId: 'lugol',
        observation: 'Coloration violet foncé',
        interpretation: 'Les pâtes sont riches en amidon (féculents)',
        resultColor: '#5B21B6',
        visualHint: '🍝 Même famille que le pain : amidon détecté !',
      },
      {
        id: 'lait-oxalate',
        sampleId: 'lait',
        reagentId: 'oxalate',
        observation: 'Précipité blanc visible',
        interpretation: 'Présence de calcium (nutriment bâtisseur)',
        resultColor: '#F8FAFC',
        visualHint: '🦴 Dépôt blanc : calcium pour des os solides !',
      },
      {
        id: 'yaourt-oxalate',
        sampleId: 'yaourt',
        reagentId: 'oxalate',
        observation: 'Léger précipité blanc',
        interpretation: 'Le yaourt apporte aussi du calcium',
        resultColor: '#F1F5F9',
        visualHint: '🥣 Produit laitier confirmé : calcium positif !',
      },
      {
        id: 'beurre-papier',
        sampleId: 'beurre',
        reagentId: 'papier',
        observation: 'Tache translucide qui ne sèche pas',
        interpretation: 'Présence de lipides (réserves d\'énergie)',
        resultColor: '#FDE68A',
        visualHint: '✨ Tache grasse à la lumière : lipides en action !',
      },
      {
        id: 'huile-papier',
        sampleId: 'huile',
        reagentId: 'papier',
        observation: 'Grande tache translucide persistante',
        interpretation: 'Huile = lipides concentrés (énergie)',
        resultColor: '#FCD34D',
        visualHint: '🫒 Encore plus gras que le beurre : lipides max !',
      },
      {
        id: 'pomme-fehling',
        sampleId: 'pomme',
        reagentId: 'fehling',
        observation: 'Précipité brique / orange après chauffage',
        interpretation: 'Présence de sucres simples (glucose)',
        resultColor: '#C2410C',
        visualHint: '🔥 Couleur brique après chauffage = glucose !',
      },
      {
        id: 'eau-lugol',
        sampleId: 'eau',
        reagentId: 'lugol',
        observation: 'Reste jaune-brun (pas de changement)',
        interpretation: 'Absence d\'amidon (témoin négatif)',
        resultColor: '#CA8A04',
        visualHint: '✅ Témoin OK : sans amidon, pas de violet. Science validée !',
      },
      {
        id: 'eau-fehling',
        sampleId: 'eau',
        reagentId: 'fehling',
        observation: 'Reste bleu (pas de précipité brique)',
        interpretation: 'Absence de sucres simples (témoin négatif)',
        resultColor: '#38BDF8',
        visualHint: '💧 Le témoin reste bleu : aucun sucre détecté.',
      },
      {
        id: 'eau-papier',
        sampleId: 'eau',
        reagentId: 'papier',
        observation: 'Aucune tache translucide',
        interpretation: 'Absence de lipides (témoin négatif)',
        resultColor: '#E2E8F0',
        visualHint: '📄 Papier sec : l\'eau ne contient pas de lipides.',
      },
    ],
    conclusion:
      'J\'observe que le pain et les pâtes réagissent au Lugol (amidon), que le lait/yaourt précipitent avec l\'oxalate (calcium), que beurre/huile laissent une tache grasse (lipides) et que le jus de pomme donne un précipité brique au Fehling (glucose). Le témoin eau reste négatif : donc un aliment = plusieurs nutriments, et le témoin prouve que le test est fiable.',
    competences: [
      {
        code: 'D4',
        title: 'Pratiquer des démarches scientifiques',
        description: 'Choisir un test, contrôler avec un témoin, interpréter une coloration.',
      },
      {
        code: 'D1',
        title: 'Communiquer à l\'écrit',
        description:
          'Rédiger « J\'observe que… donc je déduis que… » pour chaque manip.',
      },
      {
        code: 'D5',
        title: 'Adopter un comportement responsable',
        description: 'Relier les résultats aux familles d\'aliments de la pyramide.',
      },
    ],
    challenge: {
      title: 'Défi final — L\'intrus de la cantine',
      prompt:
        'D\'après tes tests : quel aliment est surtout un féculent riche en amidon (bâtisseur d\'énergie durable) ?',
      options: [
        { id: 'a', label: '🍞 Pain / 🍝 Pâtes', correct: true },
        { id: 'b', label: '🥛 Lait', correct: false },
        { id: 'c', label: '🧈 Beurre', correct: false },
        { id: 'd', label: '💧 Eau', correct: false },
      ],
      successMessage:
        'Bravo détective ! Pain et pâtes = amidon = féculents énergétiques. Mission Cantine accomplie 🏅',
    },
  },
  miniGames: [
    {
      id: 'tri-express',
      type: 'sort',
      title: 'Le Tri Express des Aliments',
      description:
        'Classe chaque aliment dans la bonne caisse : Bâtisseurs, Énergétiques ou Fonctionnels.',
      // Grand pool : chaque partie tire ~9 aliments différents
      items: [
        // Bâtisseurs
        { id: 'steak', name: 'Steak', emoji: '🥩', category: 'batisseur', hint: 'Protéines → muscles (bâtisseur).' },
        { id: 'poulet', name: 'Poulet', emoji: '🍗', category: 'batisseur', hint: 'Viande blanche riche en protéines.' },
        { id: 'poisson', name: 'Poisson', emoji: '🐟', category: 'batisseur', hint: 'Protéines + bons lipides, surtout bâtisseur.' },
        { id: 'oeuf', name: 'Œuf', emoji: '🥚', category: 'batisseur', hint: 'Protéines complètes → bâtisseur.' },
        { id: 'fromage', name: 'Fromage', emoji: '🧀', category: 'batisseur', hint: 'Calcium et protéines → os et muscles.' },
        { id: 'yaourt', name: 'Yaourt', emoji: '🥣', category: 'batisseur', hint: 'Produit laitier : calcium bâtisseur.' },
        { id: 'lait', name: 'Lait', emoji: '🥛', category: 'batisseur', hint: 'Calcium pour des os solides.' },
        { id: 'lentilles', name: 'Lentilles', emoji: '🥗', category: 'batisseur', hint: 'Légumineuses = protéines végétales.' },
        { id: 'pois-chiches', name: 'Pois chiches', emoji: '🧆', category: 'batisseur', hint: 'Légumineuses bâtisseuses.' },
        { id: 'tofu', name: 'Tofu', emoji: '🍱', category: 'batisseur', hint: 'Protéines végétales (soja).' },
        { id: 'jambon', name: 'Jambon', emoji: '🥓', category: 'batisseur', hint: 'Charcuterie riche en protéines.' },
        { id: 'thon', name: 'Thon', emoji: '🐠', category: 'batisseur', hint: 'Poisson : protéines bâtisseuses.' },
        // Énergétiques
        { id: 'pain', name: 'Pain', emoji: '🍞', category: 'energetique', hint: 'Amidon = énergie durable.' },
        { id: 'riz', name: 'Riz', emoji: '🍚', category: 'energetique', hint: 'Féculent énergétique.' },
        { id: 'pates', name: 'Pâtes', emoji: '🍝', category: 'energetique', hint: 'Glucides complexes pour l\'effort.' },
        { id: 'pomme-de-terre', name: 'Pomme de terre', emoji: '🥔', category: 'energetique', hint: 'Féculent riche en amidon.' },
        { id: 'mais', name: 'Maïs', emoji: '🌽', category: 'energetique', hint: 'Céréale énergétique.' },
        { id: 'avoine', name: 'Flocons d\'avoine', emoji: '🌾', category: 'energetique', hint: 'Céréales = carburant du matin.' },
        { id: 'huile', name: 'Huile', emoji: '🫒', category: 'energetique', hint: 'Lipides = énergie concentrée.' },
        { id: 'beurre', name: 'Beurre', emoji: '🧈', category: 'energetique', hint: 'Matière grasse énergétique.' },
        { id: 'avocat', name: 'Avocat', emoji: '🥑', category: 'energetique', hint: 'Riche en lipides (énergie).' },
        { id: 'noix', name: 'Noix', emoji: '🥜', category: 'energetique', hint: 'Fruits oléagineux = lipides.' },
        { id: 'banane', name: 'Banane', emoji: '🍌', category: 'energetique', hint: 'Sucres rapides pour l\'énergie.' },
        { id: 'miel', name: 'Miel', emoji: '🍯', category: 'energetique', hint: 'Sucres simples très énergétiques.' },
        { id: 'chocolat', name: 'Chocolat', emoji: '🍫', category: 'energetique', hint: 'Sucres et lipides : énergie / plaisir.' },
        { id: 'croissant', name: 'Croissant', emoji: '🥐', category: 'energetique', hint: 'Farine + beurre = énergétique.' },
        // Fonctionnels
        { id: 'brocoli', name: 'Brocoli', emoji: '🥦', category: 'fonctionnel', hint: 'Vitamines et fibres protectrices.' },
        { id: 'carotte', name: 'Carotte', emoji: '🥕', category: 'fonctionnel', hint: 'Provitamine A : fonctionnel.' },
        { id: 'epinards', name: 'Épinards', emoji: '🥬', category: 'fonctionnel', hint: 'Légume feuille riche en micronutriments.' },
        { id: 'tomate', name: 'Tomate', emoji: '🍅', category: 'fonctionnel', hint: 'Vitamines et eau : fonctionnel.' },
        { id: 'orange', name: 'Orange', emoji: '🍊', category: 'fonctionnel', hint: 'Vitamine C : fonctionnel.' },
        { id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'fonctionnel', hint: 'Très riche en vitamine C.' },
        { id: 'fraise', name: 'Fraises', emoji: '🍓', category: 'fonctionnel', hint: 'Fruit vitaminé, peu énergétique.' },
        { id: 'pomme', name: 'Pomme', emoji: '🍎', category: 'fonctionnel', hint: 'Fibres et vitamines (fonctionnel).' },
        { id: 'concombre', name: 'Concombre', emoji: '🥒', category: 'fonctionnel', hint: 'Très hydratant, micronutriments.' },
        { id: 'poivron', name: 'Poivron', emoji: '🫑', category: 'fonctionnel', hint: 'Vitamine C : légume fonctionnel.' },
        { id: 'eau', name: 'Eau', emoji: '💧', category: 'fonctionnel', hint: 'Indispensable à toutes les fonctions.' },
        { id: 'the', name: 'Thé / infusion', emoji: '🍵', category: 'fonctionnel', hint: 'Boisson sans énergie, hydratation.' },
      ],
    },
    {
      id: 'assiette-ideale',
      type: 'plate',
      title: 'L\'Assiette Idéale du Déjeuner',
      description:
        'Compose un déjeuner équilibré en glissant des ingrédients dans l\'assiette.',
      ingredients: [
        { id: 'poulet', name: 'Poulet', emoji: '🍗', category: 'batisseur', points: 3 },
        { id: 'riz', name: 'Riz', emoji: '🍚', category: 'energetique', points: 3 },
        { id: 'salade', name: 'Salade', emoji: '🥬', category: 'fonctionnel', points: 3 },
        { id: 'yaourt', name: 'Yaourt', emoji: '🥛', category: 'batisseur', points: 2 },
        { id: 'pomme', name: 'Pomme', emoji: '🍎', category: 'fonctionnel', points: 2 },
        { id: 'frites', name: 'Frites', emoji: '🍟', category: 'energetique', points: 1 },
        { id: 'soda', name: 'Soda', emoji: '🥤', category: 'energetique', points: 0 },
        { id: 'bonbons', name: 'Bonbons', emoji: '🍬', category: 'energetique', points: 0 },
        { id: 'haricots', name: 'Haricots verts', emoji: '🫛', category: 'fonctionnel', points: 3 },
        { id: 'pain', name: 'Pain', emoji: '🥖', category: 'energetique', points: 2 },
      ],
      tips: [
        'Super ! Mais n\'oublie pas un fruit ou des légumes pour faire le plein de vitamines !',
        'Ajoute une source de protéines (viande, œuf, légumineuse) pour construire tes muscles.',
        'Les féculents te donnent de l\'énergie pour l\'après-midi.',
        'Trop de douceurs : garde-les pour les occasions !',
        'Assiette équilibrée : féculent + protéine + légume/fruit. Bravo !',
      ],
    },
  ],
  flashcards: [
    {
      id: 'vitamine',
      term: 'Vitamine',
      definition:
        'Substance dont le corps a besoin en petite quantité, n\'apporte aucune calorie ni énergie directe, mais indispensable pour être en forme !',
      color: '#10B981',
    },
    {
      id: 'metabolisme',
      term: 'Métabolisme de base',
      definition:
        'L\'énergie minimale dépensée par ton corps au repos pour respirer, faire battre le cœur et rester à 37°C.',
      color: '#0284C7',
    },
    {
      id: 'batisseurs',
      term: 'Aliments Bâtisseurs',
      definition:
        'Les aliments qui fabriquent et réparent tes os et tes muscles (riches en protéines et calcium).',
      color: '#8B5CF6',
    },
    {
      id: 'energetiques',
      term: 'Aliments Énergétiques',
      definition:
        'Les aliments qui te donnent la force de bouger et de réfléchir (glucides et lipides).',
      color: '#F97316',
    },
    {
      id: 'fonctionnels',
      term: 'Aliments Fonctionnels',
      definition:
        'Les aliments qui protègent ta santé grâce aux vitamines, fibres et sels minéraux (fruits, légumes, eau).',
      color: '#10B981',
    },
    {
      id: 'nutriment',
      term: 'Nutriment',
      definition:
        'Petite molécule issue de la digestion d\'un aliment, utilisable directement par les cellules (eau, glucose, acides aminés…).',
      color: '#0284C7',
    },
    {
      id: 'amidon',
      term: 'Amidon',
      definition:
        'Glucide complexe présent dans le pain, les pâtes et les pommes de terre. Détecté par l\'eau iodée (coloration violet-noir).',
      color: '#F59E0B',
    },
    {
      id: 'equilibre',
      term: 'Équilibre alimentaire',
      definition:
        'Varier les aliments, adapter les quantités à ses besoins et rester régulier sur la durée.',
      color: '#8B5CF6',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Pourquoi l\'être humain a-t-il besoin de manger ?',
      choices: [
        'Uniquement pour le plaisir',
        'Pour fournir de l\'énergie, construire et réparer le corps',
        'Seulement pour grandir jusqu\'à 12 ans',
        'Pour remplacer l\'eau du corps uniquement',
      ],
      correctIndex: 1,
      explanation:
        'Manger sert à trois choses : énergie, construction et entretien/réparation.',
      tipOnError: 'Relis la branche « Pourquoi mangeons-nous ? » de la carte mentale.',
    },
    {
      id: 'q2',
      question: 'Quelle est la température interne constante du corps humain ?',
      choices: ['32°C', '35°C', '37°C', '40°C'],
      correctIndex: 2,
      explanation: 'Le corps maintient environ 37°C grâce au métabolisme.',
      tipOnError: 'Revois le schéma du Réacteur Humain.',
    },
    {
      id: 'q3',
      question: 'En quelle unité mesure-t-on l\'énergie des aliments ?',
      choices: ['Grammes (g)', 'Litres (L)', 'Kilojoules (kJ)', 'Degrés (°C)'],
      correctIndex: 2,
      explanation: 'L\'énergie se mesure en kilojoules (kJ).',
      tipOnError: 'Pense à la branche Énergie de la carte mentale.',
    },
    {
      id: 'q4',
      question: 'Quel aliment est surtout classé comme bâtisseur ?',
      choices: ['Bonbon', 'Steak', 'Huile', 'Soda'],
      correctIndex: 1,
      explanation: 'Le steak est riche en protéines → aliment bâtisseur.',
      tipOnError: 'Les bâtisseurs sont riches en protéines et calcium.',
    },
    {
      id: 'q5',
      question: 'Que révèle l\'eau iodée (Lugol) devenue violet-noir sur le pain ?',
      choices: [
        'Présence de calcium',
        'Présence d\'amidon',
        'Présence de lipides',
        'Absence de nutriments',
      ],
      correctIndex: 1,
      explanation: 'L\'eau iodée colore l\'amidon en violet/noir.',
      tipOnError: 'Relis le TP : test Lugol sur le pain.',
    },
    {
      id: 'q6',
      question: 'Que se passe-t-il quand il fait très froid dehors ?',
      choices: [
        'Le corps dépense moins d\'énergie',
        'Le corps dépense plus d\'énergie pour rester à 37°C',
        'La digestion s\'arrête',
        'On n\'a plus besoin de manger',
      ],
      correctIndex: 1,
      explanation:
        'Par grand froid, le métabolisme augmente pour maintenir 37°C.',
      tipOnError: 'Essaie le curseur Météo du schéma Réacteur.',
    },
    {
      id: 'q7',
      question: 'Un nutriment, c\'est…',
      choices: [
        'Un aliment entier non digéré',
        'Une molécule microscopique issue de la digestion',
        'Uniquement l\'eau',
        'Un réactif de laboratoire',
      ],
      correctIndex: 1,
      explanation:
        'La digestion transforme les aliments en nutriments utilisables par les cellules.',
      tipOnError: 'Regarde le schéma « De l\'Aliment au Nutriment ».',
    },
    {
      id: 'q8',
      question: 'Où place-t-on l\'eau dans la pyramide alimentaire ?',
      choices: [
        'Au sommet (rarement)',
        'Au milieu avec les lipides',
        'À la base (à volonté)',
        'Elle n\'y figure pas',
      ],
      correctIndex: 2,
      explanation: 'L\'eau est à la base : on peut en boire à volonté.',
      tipOnError: 'Clique sur l\'étage Eau de la pyramide interactive.',
    },
    {
      id: 'q9',
      question: 'Le métabolisme de base correspond à…',
      choices: [
        'L\'énergie dépensée uniquement en courant',
        'L\'énergie minimale au repos pour les fonctions vitales',
        'L\'énergie des bonbons',
        'La température extérieure',
      ],
      correctIndex: 1,
      explanation:
        'C\'est l\'énergie brûlée même en dormant au chaud, pour vivre.',
      tipOnError: 'Relis la flashcard « Métabolisme de base ».',
    },
    {
      id: 'q10',
      question: 'Quelle est la règle d\'or de l\'équilibre alimentaire ?',
      choices: [
        'Manger uniquement des protéines',
        'Variété, quantités adaptées, régularité',
        'Sauter le petit-déjeuner',
        'Manger seulement le soir',
      ],
      correctIndex: 1,
      explanation:
        'Varier, adapter les quantités et rester régulier sur la durée.',
      tipOnError: 'Branche « Équilibre alimentaire » de la carte mentale.',
    },
  ],
}
