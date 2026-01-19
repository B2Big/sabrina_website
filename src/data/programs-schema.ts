// Data Model for Running Programs with Dynamic VMA Calculation

export type SessionType = 'run' | 'strength' | 'rest' | 'cross-training';

export type RunSessionDetails = {
  warmup?: string; // e.g., "15' footing lent"
  main_set: Array<{
    repetitions: number;
    distance?: number; // meters
    duration?: number; // seconds
    recovery?: number; // seconds
    target_vma_percent: number; // The key for dynamic calculation
    description?: string; // Optional context
  }>;
  cooldown?: string; // e.g., "10' retour au calme"
};

export type Session = {
  day: string; // e.g., "Lundi"
  type: SessionType;
  title: string; // e.g., "Endurance Fondamentale"
  duration_minutes: number;
  content: string | RunSessionDetails; // Simple string for non-run sessions, object for runs
};

export type Week = {
  week_number: number;
  focus?: string; // e.g., "Volume", "Vitesse", "Récupération"
  sessions: Session[];
};

export type Program = {
  program_id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  weeks: Week[];
};

// Example Data (Schema Validation)
export const EXAMPLE_PROGRAM: Program = {
  program_id: "10km_perf",
  title: "Objectif 10km - Performance",
  description: "Programme sur 8 semaines pour battre votre record.",
  level: "intermediate",
  duration_weeks: 8,
  weeks: [
    {
      week_number: 1,
      focus: "Développement VMA",
      sessions: [
        {
          day: "Lundi",
          type: "run",
          title: "Footing + Lignes droites",
          duration_minutes: 45,
          content: {
            warmup: "20' endurance",
            main_set: [
              {
                repetitions: 10,
                duration: 30, // 30s effort
                recovery: 30, // 30s recup
                target_vma_percent: 105,
                description: "Vite !"
              }
            ],
            cooldown: "10' retour calme"
          }
        },
        {
          day: "Mercredi",
          type: "strength",
          title: "Renforcement Jambes",
          duration_minutes: 30,
          content: "Squats, Fentes, Mollets - 4 séries de 12 reps."
        }
      ]
    }
  ]
};
