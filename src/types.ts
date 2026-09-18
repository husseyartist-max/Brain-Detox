export type ExhibitId = 'breathe' | 'grass' | 'confess' | 'silence' | 'thought';

export interface ExhibitMeta {
  id: ExhibitId;
  order: number;
  title: string;
  subtitle: string;
  label: string;
  reductionPercentage: number;
  targetRotAfter: number;
}

export interface ConfessionItem {
  id: string;
  text: string;
  category: 'doomscroll' | 'shortform' | 'social' | 'late-night' | 'attention-span';
  purgedAt?: number;
}

export interface HonestThoughtItem {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  isUser?: boolean;
}

export interface DetoxMachineState {
  rotLevel: number; // 100 to 0
  activeExhibit: ExhibitId | 'complete';
  completedExhibits: Record<ExhibitId, boolean>;
  exhibitProgress: {
    breatheCycles: number; // 0 to 3
    grassRustles: number; // 0 to 100
    sinsIncinerated: number; // count
    silenceSecondsCompleted: number; // 0 to 15
    thoughtSubmitted: boolean;
  };
  confessions: ConfessionItem[];
  thoughts: HonestThoughtItem[];
  soundEnabled: boolean;
  startTime: number;
  endTime?: number;
}
