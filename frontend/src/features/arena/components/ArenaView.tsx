'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CompetitionCard } from './CompetitionCard';
import { Header } from '@/components/layout/Header';
import { MainMobileNav } from '@/components/layout/MainMobileNav';
import { User } from '@/features/users/users.types';

interface ArenaViewProps {
  user: User;
  competitions: any[];
  joinedCompetitionIds: string[];
  participantCounts: Record<string, number>;
  userRankings: Record<string, number>;
}

export function ArenaView({
  user,
  competitions,
  joinedCompetitionIds,
  participantCounts,
  userRankings,
}: ArenaViewProps) {
  const t = useTranslations('Arena');
  const [showFinished, setShowFinished] = useState(false);

  const liveCompetitions = competitions.filter((c) => c.status === 'active');
  const upcomingCompetitions = competitions.filter((c) => c.status === 'upcoming');
  const finishedCompetitions = competitions.filter((c) => c.status === 'finished');

  const renderCompetitionGrid = (comps: any[], compact: boolean = false) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-12 grid grid-cols-1 gap-4 duration-700 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {comps.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
          isJoined={joinedCompetitionIds.includes(competition.id)}
          userId={user.id}
          compact={compact}
          participantCount={participantCounts[competition.id] || 0}
          userRank={userRankings[competition.id]}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)] p-4 pb-24 text-white md:p-6 md:pb-8 lg:p-8">
      <Header />
      <div className="sm:pt-20 md:pt-16" />

      <h1 className="mb-8 text-center text-xl font-medium text-white md:text-3xl">
        {t('welcome', { username: user.username })}
      </h1>

      <main className="mx-auto max-w-7xl">
        {showFinished && finishedCompetitions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 fill-mode-both mb-4 border-b border-white/5 pb-12 duration-500 md:mb-16 lg:mb-20">
            {renderCompetitionGrid(finishedCompetitions, true)}
          </div>
        )}

        {liveCompetitions.length > 0 && (
          <div className="mb-10 md:mb-16 lg:mb-20">
            <div className="mb-12 flex items-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              <h2 className="px-4 text-2xl font-black tracking-[0.2em] text-[#eab308] uppercase drop-shadow-[0_0_25px_rgba(234,179,8,0.8)]">
                {t('status.active')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
            </div>
            {renderCompetitionGrid(liveCompetitions, false)}
          </div>
        )}

        {upcomingCompetitions.length > 0 && (
          <div className="mb-10 md:mb-16 lg:mb-20">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              <h2 className="text-sm font-bold tracking-[0.3em] text-white uppercase">
                {t('status.upcoming')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>
            {renderCompetitionGrid(upcomingCompetitions, true)}
          </div>
        )}
      </main>
      {/* <MainMobileNav user={user} /> */}
    </div>
  );
}
