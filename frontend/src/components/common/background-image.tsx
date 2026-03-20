import Image from 'next/image';
import bgImage from '@/assets/images/background/ssc_stick.webp';

export default function BackgroundImage() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
      <div className="relative h-full w-full">
        <Image
          src={bgImage}
          alt="Slapshot Background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={75}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/20 to-slate-950/40" />
      </div>
    </div>
  );
}
