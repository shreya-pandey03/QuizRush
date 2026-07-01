export const topicTemplates = {
  math: {
    description:
      "Generate questions based on formulas, arithmetic, algebra, geometry",
    rules: "Include calculations, equations, and step-based reasoning",
  },

  science: {
    description: "Physics, chemistry, biology concepts",
    rules: "Focus on definitions, processes, scientific facts",
  },

  history: {
    description: "Historical events, leaders, timelines",
    rules: "Ask factual event-based questions with dates and places",
  },

  cricket: {
    description: "Cricket rules, IPL, World Cup, players, records",
    rules:
      "Include: IPL teams, player stats, match formats, records, famous matches",
    subcategory: "ipl | t20 | test | odi",
  },

  general: {
    description: "Mixed GK questions",
    rules: "Simple knowledge-based MCQs across topics",
  },
} as const;

export type Topic = keyof typeof topicTemplates;
