import { create } from 'zustand';
import { DashboardMatchPreview } from '../../matches/matches.types';

interface InitialPrediction {
  homeGoals: number;
  awayGoals: number;
}

interface PredictionStore {
  isOpen: boolean;
  selectedMatch: DashboardMatchPreview | null;
  initialPrediction: InitialPrediction | null;
  openPrediction: (match: DashboardMatchPreview, prediction?: InitialPrediction) => void;
  closePrediction: () => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  isOpen: false,
  selectedMatch: null,
  initialPrediction: null,
  openPrediction: (match, prediction) =>
    set({ isOpen: true, selectedMatch: match, initialPrediction: prediction ?? null }),
  closePrediction: () => set({ isOpen: false, selectedMatch: null, initialPrediction: null }),
}));
