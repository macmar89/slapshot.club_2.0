'use client';

import React from 'react';
import { Crown, Users, Play, MessageSquare, Briefcase } from 'lucide-react';

export function GroupDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Area Skeleton */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          {/* Group Icon Skeleton */}
          <div className="relative">
            <div className="bg-primary/20 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 backdrop-blur-md md:h-24 md:w-24">
              <Crown className="h-10 w-10 text-white/10" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Group Name Skeleton */}
            <div className="h-8 w-48 rounded-lg bg-white/10 md:h-12 md:w-80" />

            {/* Member Count Badge Skeleton */}
            <div className="flex w-max items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
              <Users className="h-3.5 w-3.5 text-white/20" />
              <div className="h-3 w-16 rounded bg-white/10" />
            </div>
          </div>
        </div>

        {/* Rules Link Placeholder */}
        <div className="hidden items-center gap-2 text-white/30 md:flex">
          <div className="h-4 w-4 rounded-full bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/5" />
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="rounded-app flex w-full overflow-hidden border border-[#5d626d]/30 bg-black/40 backdrop-blur-md md:w-max">
        {[
          { label: 'leaderboard', icon: Play },
          { label: 'cabin', icon: MessageSquare },
          { label: 'office', icon: Briefcase },
        ].map((tab, idx) => (
          <div
            key={tab.label}
            className={`flex flex-1 items-center justify-center gap-3 px-6 py-4 transition-all md:flex-none ${
              idx === 0 ? 'bg-primary text-black' : 'text-white/40'
            }`}
          >
            {idx === 0 ? (
              <div className="h-4 w-24 rounded bg-black/20" />
            ) : (
              <div className="h-4 w-20 rounded bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Leaderboard Table Skeleton */}
      <div className="rounded-app overflow-hidden border border-white/10">
        {/* Table Header */}
        <div className="grid grid-cols-[50px_1fr_80px_80px_80px_80px_80px_80px] border-b border-white/5 bg-white/5 px-6 py-3 text-[10px] font-bold tracking-widest text-white/30 uppercase">
          {['#', 'member', 'tips', 'exact', 'v+r', 'winner', 'miss', 'pts'].map((col) => (
            <div key={col} className="flex justify-center first:justify-start">
              {col}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[50px_1fr_80px_80px_80px_80px_80px_80px] items-center border-b border-white/5 px-6 py-4 last:border-0"
            >
              <div className="h-5 w-4 rounded bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 rounded bg-white/10" />
                  <div className="h-3 w-16 rounded bg-white/5" />
                </div>
              </div>
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="mx-auto h-4 w-8 rounded bg-white/5" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
