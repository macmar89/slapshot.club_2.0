'use client';

import { useState } from 'react';
import { AdminMatchDto } from '../admin-matches.types';
import { ScoreEditor } from './score-editor';
import { MatchStats } from './match-stats';
import { MatchStatusSidebar } from './match-status-sidebar';
import { MatchVerificationCard } from './match-verification-card';

export interface MatchSaveData {
  homeScore?: string;
  awayScore?: string;
  status?: string;
  isChecked?: boolean;
  isRanked?: boolean;
  apiHockeyId?: string | null;
  apiHockeyStatus?: string | null;
  stageType?: string;
  date?: string;
}

interface MatchDetailEditorProps {
  match: AdminMatchDto;
  onSave: (data: MatchSaveData) => void;
}

export const MatchDetailEditor = ({ match, onSave }: MatchDetailEditorProps) => {
  const [homeScore, setHomeScore] = useState<string>(match.resultHomeScore?.toString() || '0');
  const [awayScore, setAwayScore] = useState<string>(match.resultAwayScore?.toString() || '0');
  const [status, setStatus] = useState<string>(match.status);
  const [matchDate, setMatchDate] = useState<string>(match.date);

  // New API & Stage fields
  const [apiHockeyId, setApiHockeyId] = useState<string>(match.apiHockeyId || '');
  const [apiHockeyStatus, setApiHockeyStatus] = useState<string>(match.apiHockeyStatus || 'NS');
  const [stageType, setStageType] = useState<string>(match.stageType);

  // Dirty state calculation
  const isHomeDirty = (parseInt(homeScore) || 0) !== (match.resultHomeScore || 0);
  const isAwayDirty = (parseInt(awayScore) || 0) !== (match.resultAwayScore || 0);
  const isDateDirty = matchDate !== match.date;
  const isScoreDirty = isHomeDirty || isAwayDirty || isDateDirty;

  const isStatusDirty = status !== match.status;
  const isApiIdDirty = apiHockeyId !== (match.apiHockeyId || '');
  const isApiStatusDirty = apiHockeyStatus !== (match.apiHockeyStatus || 'NS');
  const isStageDirty = stageType !== match.stageType;

  const isSidebarDirty = isStatusDirty || isApiIdDirty || isApiStatusDirty || isStageDirty;

  const handleSaveScores = () => {
    if (!isScoreDirty) return;
    onSave({ homeScore, awayScore, date: matchDate });
  };

  const handleSaveSidebar = () => {
    if (!isSidebarDirty) return;
    onSave({
      status,
      apiHockeyId,
      apiHockeyStatus,
      stageType,
    });
  };

  const handleRecalculate = () => {
    console.log('Recalculating points for match:', match.id);
  };

  const handleUndoScoring = () => {
    console.log('Undoing scoring for match:', match.id);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content Area */}
      <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
        <ScoreEditor
          homeScore={homeScore}
          awayScore={awayScore}
          onHomeScoreChange={setHomeScore}
          onAwayScoreChange={setAwayScore}
          homeTeam={match.homeTeam}
          homeLogoUrl={match.homeLogoUrl}
          awayTeam={match.awayTeam}
          awayLogoUrl={match.awayLogoUrl}
          competitionName={match.competitionName}
          matchDate={matchDate}
          onMatchDateChange={setMatchDate}
          status={status}
          onSave={handleSaveScores}
          onRecalculate={handleRecalculate}
          onUndoScoring={handleUndoScoring}
          isHomeDirty={isHomeDirty}
          isAwayDirty={isAwayDirty}
          isDateDirty={isDateDirty}
          isDirty={isScoreDirty}
          isRanked={match.isRanked}
          rankedAt={match.rankedAt}
        />

        <MatchVerificationCard
          isChecked={!!match.isChecked}
          checkedBy={match.checkedBy}
          checkedAt={match.checkedAt}
          onSave={onSave}
        />

        <MatchStats
          totalPredictionsCount={match.totalPredictionsCount}
          stageType={match.stageType}
          resultEndingType={match.resultEndingType}
          apiHockeyId={match.apiHockeyId}
          apiHockeyStatus={match.apiHockeyStatus}
        />
      </div>

      {/* Sidebar Area */}
      <div className="col-span-1">
        <MatchStatusSidebar
          status={status}
          onStatusChange={setStatus}
          isStatusDirty={isStatusDirty}
          apiHockeyId={apiHockeyId}
          onApiIdChange={setApiHockeyId}
          isApiIdDirty={isApiIdDirty}
          apiHockeyStatus={apiHockeyStatus}
          onApiStatusChange={setApiHockeyStatus}
          isApiStatusDirty={isApiStatusDirty}
          stageType={stageType}
          onStageChange={setStageType}
          isStageDirty={isStageDirty}
          isDirty={isSidebarDirty}
          onSave={handleSaveSidebar}
        />
      </div>
    </div>
  );
};
