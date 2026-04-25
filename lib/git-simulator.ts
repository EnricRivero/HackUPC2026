import type { ChatMessage, GitAction, RepositoryState, SavePoint } from "./types";

const examplesByAction = {
  commit: [
    "Se prepara todo lo que cambiaste",
    "Se crea un nuevo Punto de Guardado en la historia",
    "Tu trabajo queda listo para recuperar o compartir",
  ],
  push: [
    "Tu último Punto de Guardado se envía a la nube",
    "La copia remota queda sincronizada",
    "Puedes seguir trabajando con tranquilidad",
  ],
  restore: [
    "Se recupera una versión anterior segura",
    "Mantienes una referencia clara del cambio",
    "La interfaz te muestra el salto temporal antes de aplicarlo",
  ],
} as const;

const containsAny = (text: string, candidates: string[]) =>
  candidates.some((candidate) => text.includes(candidate));

function isoMinutesAgo(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function createPoint(
  id: string,
  label: string,
  description: string,
  type: SavePoint["type"],
  branch = "main",
  timestamp = new Date().toISOString(),
): SavePoint {
  return { id, label, description, timestamp, type, branch };
}

function cloneRepository(repository: RepositoryState): RepositoryState {
  return {
    ...repository,
    commits: repository.commits.map((point) => ({ ...point })),
    workingChanges: [...repository.workingChanges],
  };
}

function nextPointLabel(count: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return `Punto ${alphabet[count] ?? count + 1}`;
}

function nextPointId(count: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return `point-${alphabet[count] ?? count + 1}`;
}

export function createInitialRepository(): RepositoryState {
  return {
    branchName: "main",
    commits: [
      createPoint("point-a", "Punto A", "Base estable del proyecto", "commit", "main", isoMinutesAgo(180)),
      createPoint("point-b", "Punto B", "Nueva pantalla de bienvenida", "commit", "main", isoMinutesAgo(95)),
      createPoint(
        "point-c",
        "Punto C",
        "Textos refinados para presentar la demo",
        "commit",
        "main",
        isoMinutesAgo(25),
      ),
    ],
    workingChanges: [
      "Nuevo copy para el chat guiado",
      "Ajustes visuales en el panel central",
      "Estado de voz listo para demostración",
    ],
    stagedChanges: 3,
    pushedPointId: "point-b",
    remoteStatus: "Tienes cambios recientes pendientes de subir",
    lastAction: "idle",
  };
}

export function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hola, soy GitEase. Puedes decir cosas como “Guarda lo que he hecho ahora”, “Súbelo a internet” o “Quiero volver a lo de ayer”.",
      timestamp: new Date().toISOString(),
      kind: "normal",
    },
  ];
}

export function getActionFromInput(input: string, repository: RepositoryState): GitAction {
  const normalized = input.trim().toLowerCase();

  if (
    containsAny(normalized, [
      "guarda",
      "guardar",
      "hecho ahora",
      "save",
      "commit",
      "copia de seguridad",
    ])
  ) {
    return {
      type: "commit",
      label: "Guardar progreso",
      naturalExplanation:
        "Voy a guardar lo que has hecho ahora creando un nuevo Punto de Guardado entendible y seguro.",
      gitTranslation: ['git add .', 'git commit -m "Guardar progreso visual"'],
      accent: "from-emerald-400/80 to-teal-300/80",
      previewChanges: examplesByAction.commit,
    };
  }

  if (
    containsAny(normalized, [
      "sube",
      "subelo",
      "súbelo",
      "internet",
      "nube",
      "push",
      "publica",
      "subir",
    ])
  ) {
    return {
      type: "push",
      label: "Subir a la nube",
      naturalExplanation:
        "Voy a subir tu último Punto de Guardado para que quede respaldado y sincronizado fuera de tu ordenador.",
      gitTranslation: [`git push origin ${repository.branchName}`],
      accent: "from-sky-400/80 to-cyan-300/80",
      previewChanges: examplesByAction.push,
    };
  }

  if (
    containsAny(normalized, [
      "volver",
      "ayer",
      "anterior",
      "deshacer",
      "reset",
      "checkout",
      "retrocede",
    ])
  ) {
    return {
      type: "restore",
      label: "Volver a un punto anterior",
      naturalExplanation:
        "Voy a mostrarte cómo volver a un momento anterior de la historia sin que pierdas el contexto actual.",
      gitTranslation: ["git checkout <punto-anterior>", "git reset --soft HEAD~1"],
      accent: "from-amber-400/80 to-orange-300/80",
      previewChanges: examplesByAction.restore,
    };
  }

  return {
    type: "commit",
    label: "Guardar con ayuda guiada",
    naturalExplanation:
      "No identifiqué una intención exacta, así que propongo un guardado seguro como siguiente paso más útil para no perder trabajo.",
    gitTranslation: ['git add .', 'git commit -m "Guardado sugerido por GitEase"'],
    accent: "from-violet-400/80 to-indigo-300/80",
    previewChanges: examplesByAction.commit,
  };
}

export function simulateAction(repository: RepositoryState, action: GitAction) {
  const nextState = cloneRepository(repository);

  if (action.type === "commit") {
    const nextIndex = nextState.commits.length;
    const newPoint = createPoint(
      nextPointId(nextIndex),
      nextPointLabel(nextIndex),
      "Guardado generado a partir de lenguaje natural",
      "commit",
      nextState.branchName,
    );

    nextState.commits.push(newPoint);
    nextState.stagedChanges = 0;
    nextState.workingChanges = [];
    nextState.remoteStatus = `${newPoint.label} creado localmente y pendiente de subir`;
    nextState.lastAction = "commit";

    return {
      nextState,
      summary: `Se creará ${newPoint.label} con una copia segura de tu trabajo actual.`,
      backupLabel: newPoint.label,
    };
  }

  if (action.type === "push") {
    const lastPoint = nextState.commits[nextState.commits.length - 1];
    const pushedPoint = createPoint(
      `${lastPoint.id}-cloud`,
      `${lastPoint.label} sincronizado`,
      "Copia compartida en la nube",
      "push",
      nextState.branchName,
    );

    nextState.commits.push(pushedPoint);
    nextState.pushedPointId = lastPoint.id;
    nextState.remoteStatus = `La nube ahora refleja ${lastPoint.label}`;
    nextState.lastAction = "push";

    return {
      nextState,
      summary: `Tu historial mostrará que ${lastPoint.label} también quedó sincronizado en la nube.`,
      backupLabel: lastPoint.label,
    };
  }

  const previousCommit =
    [...nextState.commits]
      .reverse()
      .find((point) => point.type === "commit" && point.id !== nextState.commits[nextState.commits.length - 1]?.id) ??
    nextState.commits[0];

  const restorePoint = createPoint(
    `${previousCommit.id}-restore`,
    `Volver a ${previousCommit.label}`,
    "Recuperación visual de una versión anterior",
    "restore",
    nextState.branchName,
  );

  nextState.commits.push(restorePoint);
  nextState.workingChanges = [`Interfaz recuperada desde ${previousCommit.label}`];
  nextState.stagedChanges = 1;
  nextState.remoteStatus = `Vista preparada para regresar a ${previousCommit.label}`;
  nextState.lastAction = "restore";

  return {
    nextState,
    summary: `La historia mostrará un regreso seguro hasta ${previousCommit.label} antes de aplicarlo.`,
    backupLabel: previousCommit.label,
  };
}

export function createAssistantConfirmation(action: GitAction): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      `Entendido. ${action.naturalExplanation} Para hacer esto, voy a crear una "Copia de Seguridad". ` +
      "Esto guardará tu trabajo actual en el punto A para que nunca lo pierdas. ¿Confirmas?",
    timestamp: new Date().toISOString(),
    kind: "confirmation",
  };
}

export function createAssistantResult(action: GitAction, summary: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: `${action.label} preparado. ${summary}`,
    timestamp: new Date().toISOString(),
    kind: "result",
  };
}

