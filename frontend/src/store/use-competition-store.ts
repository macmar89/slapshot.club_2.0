import { create } from 'zustand';

interface CompetitionData {
  name: string;
}

interface CompetitionStore {
  competition: CompetitionData | null;
  setCompetition: (data: CompetitionData) => void;
}

export const useCompetitionStore = create<CompetitionStore>((set) => ({
  competition: null,
  setCompetition: (data) => set({ competition: data }),
}));
