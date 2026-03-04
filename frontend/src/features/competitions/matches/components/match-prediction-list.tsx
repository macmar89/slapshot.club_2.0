interface MatchPredictionsListProps {
  matchId: string;
}

export const MatchPredictionsList = ({ matchId }: MatchPredictionsListProps) => {
  return (
    <div>
      <h2>Match Predictions List {matchId}</h2>
    </div>
  );
};
