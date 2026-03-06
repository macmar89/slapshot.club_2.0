import { Button } from '@/components/ui/button';
import { getLogoUrl } from '@/lib/utils/logo';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';

interface TeamInfo {
  name: string;
  logoUrl: string | null;
}

interface ScoreInputProps {
  value: number;
  onChange: (v: number) => void;
  team: TeamInfo;
  disabled?: boolean;
}

export const ScoreInput = ({ value, onChange, team, disabled = false }: ScoreInputProps) => (
  <div className="flex flex-1 flex-col items-center gap-4">
    <div className="flex h-10 w-20 items-center justify-center md:h-12 md:w-24">
      {team.logoUrl ? (
        <Image
          src={getLogoUrl(team.logoUrl)}
          alt={team.name}
          width={80}
          height={60}
          className="rounded-app h-full w-auto object-contain"
        />
      ) : (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/10 shadow-lg"
          style={{ backgroundColor: '#333' }}
        >
          <span className="text-sm font-black text-white">{team.name}</span>
        </div>
      )}
    </div>
    <span className="min-h-[2.5rem] text-center text-[0.8rem] font-black tracking-widest text-white/80 uppercase sm:min-h-[3rem]">
      {team.name}
    </span>
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={() => !disabled && onChange(Math.max(0, value - 1))}
        disabled={disabled}
        className="rounded-full border-white/20 bg-white/10 text-white shadow-sm hover:bg-white/20 disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="rounded-app flex h-14 w-12 items-center justify-center border border-white/20 bg-white/10 text-2xl font-black tracking-tighter select-none md:h-16 md:w-14 md:text-3xl">
        {value}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => !disabled && onChange(value + 1)}
        disabled={disabled}
        className="rounded-full border-white/20 bg-white/10 text-white shadow-sm hover:bg-white/20 disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
