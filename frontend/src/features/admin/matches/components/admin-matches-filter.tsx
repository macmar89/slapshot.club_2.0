import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AdminMatchesFilterProps {
  filters: {
    status?: string;
    competitionId?: string;
    teamId?: string;
    isChecked?: boolean;
    isRanked?: boolean;
  };
  updateFilter: (key: string, value: unknown) => void;
}

export const AdminMatchesFilter = ({ filters, updateFilter }: AdminMatchesFilterProps) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between w-full">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        
        <div className="flex flex-col gap-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/50">Status Limiter</Label>
          <Tabs value={(filters.status as string) || 'all'} onValueChange={(val) => updateFilter('status', val === 'all' ? undefined : val)}>
            <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1">
              <TabsTrigger value="all" className="rounded-lg">Všetky</TabsTrigger>
              <TabsTrigger value="scheduled" className="rounded-lg">Plánované</TabsTrigger>
              <TabsTrigger value="live" className="rounded-lg">Live</TabsTrigger>
              <TabsTrigger value="finished" className="rounded-lg">Ukončené</TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-lg">Zrušené</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4 mt-1 md:mt-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isCheckedFilter" 
              checked={(filters.isChecked as boolean) || false} 
              onCheckedChange={(checked) => updateFilter('isChecked', checked)}
              className="border-white/50"
            />
            <Label htmlFor="isCheckedFilter" className="text-sm font-medium leading-none text-white/80 shrink-0">
               Not Checked Only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isRankedFilter" 
              checked={(filters.isRanked as boolean) || false} 
              onCheckedChange={(checked) => updateFilter('isRanked', checked)}
              className="border-white/50"
            />
            <Label htmlFor="isRankedFilter" className="text-sm font-medium leading-none text-white/80 shrink-0">
              Ranked Only
            </Label>
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/50">Competition ID</Label>
        <Input 
          placeholder="Filter by comp ID..." 
          value={(filters.competitionId as string) || ''} 
          onChange={(e) => updateFilter('competitionId', e.target.value)} 
          className="w-full md:w-[200px] border-white/10 bg-white/5 rounded-xl text-white placeholder:text-white/30 h-10"
        />
      </div>
    </div>
  );
};
