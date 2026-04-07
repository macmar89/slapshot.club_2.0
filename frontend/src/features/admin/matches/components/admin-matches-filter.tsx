import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminCompetitionsLookup, useAdminTeamsLookup } from '../api/use-admin-lookups';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';

interface AdminMatchesFilterProps {
  filters: {
    status?: string;
    competitionId?: string;
    teamId?: string;
    isChecked?: boolean;
    isRanked?: boolean;
    dateFrom?: string;
    dateTo?: string;
  };
  updateFilter: (key: string, value: unknown) => void;
}

export const AdminMatchesFilter = ({ filters, updateFilter }: AdminMatchesFilterProps) => {
  const t = useTranslations('Admin.Matches.filter');
  const tStatus = useTranslations('Admin.Matches.statuses');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  
  const { competitions } = useAdminCompetitionsLookup();
  const { teams } = useAdminTeamsLookup(filters.competitionId);

  const statuses = [
    { value: 'all', label: t('all_statuses') },
    { value: 'scheduled', label: tStatus('scheduled') },
    { value: 'live', label: tStatus('live') },
    { value: 'finished', label: tStatus('finished') },
    { value: 'cancelled', label: tStatus('cancelled') },
  ];

  const renderFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Column 1: Status & Options */}
      <div className="flex flex-col gap-6">
        <IceGlassSelect
          label={t('status')}
          placeholder={t('all_statuses')}
          value={filters.status}
          options={statuses}
          onChange={(val: string | undefined) => updateFilter('status', val)}
        />
        
        <div className="flex flex-col gap-3 px-1">
           <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => updateFilter('isChecked', !filters.isChecked)}>
            <Checkbox 
              id="isCheckedFilter" 
              checked={filters.isChecked || false} 
              onCheckedChange={(checked) => updateFilter('isChecked', checked)}
            />
            <Label htmlFor="isCheckedFilter" className="text-sm font-bold text-white/50 group-hover:text-white/80 transition-colors cursor-pointer uppercase tracking-tight">
               {t('is_checked')}
            </Label>
          </div>

          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => updateFilter('isRanked', !filters.isRanked)}>
            <Checkbox 
              id="isRankedFilter" 
              checked={filters.isRanked || false} 
              onCheckedChange={(checked) => updateFilter('isRanked', checked)}
            />
            <Label htmlFor="isRankedFilter" className="text-sm font-bold text-white/50 group-hover:text-white/80 transition-colors cursor-pointer uppercase tracking-tight">
              {t('is_ranked')}
            </Label>
          </div>
        </div>
      </div>

      {/* Column 2: Lookups (Competition & Team) */}
      <div className="flex flex-col gap-6">
        <IceGlassSelect
          label={t('competition')}
          placeholder={t('select_competition')}
          value={filters.competitionId}
          options={competitions.map(c => ({
            value: c.id,
            label: c.name,
            isActive: c.isActive
          }))}
          onChange={(val: string | undefined) => updateFilter('competitionId', val)}
        />

        <IceGlassSelect
          label={t('team')}
          placeholder={t('select_team')}
          value={filters.teamId}
          options={teams.map(team => ({
            value: team.id,
            label: team.name
          }))}
          onChange={(val: string | undefined) => updateFilter('teamId', val)}
          disabled={!filters.competitionId && teams.length === 0}
        />
      </div>

      {/* Column 3: Dates */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/50">{t('date_from')}</Label>
          <div className="relative">
            <Input 
              type="date"
              value={filters.dateFrom || ''} 
              onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
              className="w-full border-white/10 bg-white/5 rounded-xl text-white h-10 pl-10"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/50">{t('date_to')}</Label>
          <div className="relative">
            <Input 
              type="date"
              value={filters.dateTo || ''} 
              onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
              className="w-full border-white/10 bg-white/5 rounded-xl text-white h-10 pl-10"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold tracking-widest uppercase text-white/70">{t('title')}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="text-white/50"
        >
          {isAccordionOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop View / Mobile Accordion Content */}
      <div className={cn(
        "transition-all duration-300 md:block",
        !isAccordionOpen && "hidden"
      )}>
        {renderFilters()}
      </div>
      
      {/* Active Filter Badges (Optional/Cleanup) */}
      {(filters.competitionId || filters.teamId || filters.status || filters.dateFrom || filters.dateTo) && (
         <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || key === 'isChecked' || key === 'isRanked') return null;
              return (
                <div key={key} className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-tighter">
                  {key}: {String(value)}
                  <button onClick={() => updateFilter(key, undefined)}><X className="h-3 w-3" /></button>
                </div>
              );
            })}
         </div>
      )}
    </div>
  );
};
