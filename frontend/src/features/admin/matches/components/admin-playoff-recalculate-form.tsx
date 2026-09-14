'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useAdminPlayoffRecalculate } from '../api/use-admin-playoff-recalculate';

export const AdminPlayoffRecalculateForm = () => {
  const [apiSportId, setApiSportId] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const { recalculatePlayoffs, isRecalculating } = useAdminPlayoffRecalculate();

  const handleRecalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiSportId || !seasonYear) return;

    await recalculatePlayoffs(Number(apiSportId), Number(seasonYear));
  };

  return (
    <IceGlassCard className="relative overflow-hidden border-white/10 p-6 shadow-2xl">
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
      
      <form onSubmit={handleRecalculate} className="relative flex flex-col gap-6 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="playoffApiSportId" className="text-[10px] font-black uppercase tracking-widest text-white/50">
            API SPORT ID
          </Label>
          <Input
            id="playoffApiSportId"
            type="number"
            placeholder="57"
            value={apiSportId}
            onChange={(e) => setApiSportId(e.target.value)}
            className="border-white/10 bg-white/5 text-white h-11 rounded-xl"
            required
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="seasonYear" className="text-[10px] font-black uppercase tracking-widest text-white/50">
            ROK (SEZÓNA)
          </Label>
          <Input
            id="seasonYear"
            type="number"
            placeholder="2023"
            value={seasonYear}
            onChange={(e) => setSeasonYear(e.target.value)}
            className="border-white/10 bg-white/5 text-white h-11 rounded-xl"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isRecalculating || !apiSportId || !seasonYear}
          className="h-11 rounded-xl px-8 font-black uppercase tracking-widest bg-orange-600 hover:bg-orange-700"
        >
          {isRecalculating ? (
            <Calculator className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calculator className="mr-2 h-4 w-4" />
          )}
          PREPOČÍTAŤ PLAYOFF
        </Button>
      </form>
    </IceGlassCard>
  );
};
