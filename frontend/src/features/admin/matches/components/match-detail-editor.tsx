'use client';

import { useState } from 'react';
import { AdminMatchDto } from '../admin-matches.types';
import { ScoreEditor } from './score-editor';
import { MatchStats } from './match-stats';
import { AuditInformation } from './audit-information';
import { MatchStatusSidebar } from './match-status-sidebar';

export interface MatchSaveData {
  homeScore?: string;
  awayScore?: string;
  status?: string;
  isChecked?: boolean;
  isRanked?: boolean;
  apiHockeyId?: string | null;
  apiHockeyStatus?: string | null;
  stageType?: string;
}

interface MatchDetailEditorProps {
  match: AdminMatchDto;
  onSave: (data: MatchSaveData) => void;
}

export const MatchDetailEditor = ({ match, onSave }: MatchDetailEditorProps) => {
  const [homeScore, setHomeScore] = useState<string>(match.resultHomeScore?.toString() || '0');
  const [awayScore, setAwayScore] = useState<string>(match.resultAwayScore?.toString() || '0');
  const [status, setStatus] = useState<string>(match.status);
  const [isChecked, setIsChecked] = useState<boolean>(match.isChecked);
  const [isRanked, setIsRanked] = useState<boolean>(match.isRanked);
  
  // New API & Stage fields
  const [apiHockeyId, setApiHockeyId] = useState<string>(match.apiHockeyId || '');
  const [apiHockeyStatus, setApiHockeyStatus] = useState<string>(match.apiHockeyStatus || 'NS');
  const [stageType, setStageType] = useState<string>(match.stageType);

  // Dirty state calculation
  const isHomeDirty = (parseInt(homeScore) || 0) !== (match.resultHomeScore || 0);
  const isAwayDirty = (parseInt(awayScore) || 0) !== (match.resultAwayScore || 0);
  const isScoreDirty = isHomeDirty || isAwayDirty;

  const isStatusDirty = status !== match.status;
  const isCheckedDirty = isChecked !== match.isChecked;
  const isRankedDirty = isRanked !== match.isRanked;
  const isApiIdDirty = apiHockeyId !== (match.apiHockeyId || '');
  const isApiStatusDirty = apiHockeyStatus !== (match.apiHockeyStatus || 'NS');
  const isStageDirty = stageType !== match.stageType;

  const isSidebarDirty = isStatusDirty || isCheckedDirty || isRankedDirty || isApiIdDirty || isApiStatusDirty || isStageDirty;

  const handleSaveScores = () => {
    if (!isScoreDirty) return;
    onSave({ homeScore, awayScore });
  };

  const handleSaveSidebar = () => {
    if (!isSidebarDirty) return;
    onSave({
      status,
      isChecked,
      isRanked,
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
          matchDate={match.date}
          status={status}
          onSave={handleSaveScores}
          onRecalculate={handleRecalculate}
          onUndoScoring={handleUndoScoring}
          isHomeDirty={isHomeDirty}
          isAwayDirty={isAwayDirty}
          isDirty={isScoreDirty}
        />

        <MatchStats
          totalPredictionsCount={match.totalPredictionsCount}
          stageType={match.stageType}
          resultEndingType={match.resultEndingType}
          apiHockeyId={match.apiHockeyId}
          apiHockeyStatus={match.apiHockeyStatus}
        />

        <AuditInformation
          checkedBy={match.checkedBy}
          checkedAt={match.checkedAt}
          rankedAt={match.rankedAt}
          isRanked={match.isRanked}
        />
      </div>

      {/* Sidebar Area */}
      <div className="col-span-1">
        <MatchStatusSidebar
          status={status}
          onStatusChange={setStatus}
          isStatusDirty={isStatusDirty}
          isChecked={isChecked}
          onCheckedChange={setIsChecked}
          isCheckedDirty={isCheckedDirty}
          isRanked={isRanked}
          onRankedChange={setIsRanked}
          isRankedDirty={isRankedDirty}
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
