import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import hockey1 from '@/assets/images/loader/hockey1.png';
import hockey2 from '@/assets/images/loader/hockey2.png';
import hockey3 from '@/assets/images/loader/hockey3.png';
import hockey4 from '@/assets/images/loader/hockey4.png';

interface HockeyLoaderProps {
  className?: string;
  text?: string;
}

const IMAGES = [hockey1, hockey2, hockey3, hockey4];

export function HockeyLoader({ className, text }: HockeyLoaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black',
        className,
      )}
    >
      {/* Cinematic Background Images */}
      {IMAGES.map((src, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-all duration-1000 ease-in-out',
            index === currentImageIndex ? 'scale-105 opacity-40' : 'scale-100 opacity-0',
          )}
          style={{
            transition: 'opacity 1s ease-in-out, transform 8s linear',
          }}
        >
          <Image
            src={src}
            alt="Hockey Loader Background"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Cinematic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

      {/* Glassmorphism Content Card */}
      <div className="rounded-app relative z-10 mx-4 flex w-full max-w-md flex-col items-center gap-8 border border-white/10 bg-black/40 p-12 shadow-[0_0_50px_-12px_rgba(234,179,8,0.2)] backdrop-blur-2xl">
        <div className="relative">
          {/* Animated Glow Rings */}
          <div className="absolute inset-[-20px] animate-[ping_3s_linear_infinite] rounded-full border border-[#eab308]/20" />
          <div className="absolute inset-[-10px] animate-[pulse_2s_linear_infinite] rounded-full border border-[#eab308]/10" />

          {/* Central Logo/Symbol Representation */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#eab308]/30 bg-gradient-to-b from-[#eab308]/20 to-transparent shadow-[inset_0_0_20px_rgba(234,179,8,0.2)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-black shadow-2xl">
              <div className="h-3 w-3 rounded-full bg-[#eab308] shadow-[0_0_15px_#eab308]" />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Slapshot <span className="text-[#eab308]">Club</span>
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent" />
          <p className="mt-2 animate-pulse text-xs font-black tracking-[0.4em] text-[#eab308]/80 uppercase">
            {text || 'Pripravujem šatňu...'}
          </p>
        </div>
      </div>

      {/* Subtle Progress Bar at bottom */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#eab308] to-transparent opacity-30 blur-sm" />
    </div>
  );
}
