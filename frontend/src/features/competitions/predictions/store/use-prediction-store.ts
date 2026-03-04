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
  onSuccess?: () => void;
  openPrediction: (
    match: DashboardMatchPreview,
    prediction?: InitialPrediction,
    onSuccess?: () => void,
  ) => void;
  closePrediction: () => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  isOpen: false,
  selectedMatch: null,
  initialPrediction: null,
  onSuccess: undefined,
  openPrediction: (match, prediction, onSuccess) =>
    set({ isOpen: true, selectedMatch: match, initialPrediction: prediction ?? null, onSuccess }),
  closePrediction: () =>
    set({ isOpen: false, selectedMatch: null, initialPrediction: null, onSuccess: undefined }),
}));
