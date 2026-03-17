"use client";

import { IceGlassCard } from "@/components/ui/ice-glass-card";
import { Users, ShieldCheck, UserPlus, Lock } from "lucide-react";

export const UserManualGroups = () => {
  const groupFeatures = [
    {
      icon: Users,
      title: "Komunita",
      description: "Vytvorte si vlastnú hokejovú kabínu pre svojich priateľov alebo kolegov.",
    },
    {
      icon: ShieldCheck,
      title: "Správa členov",
      description: "Majiteľ skupiny (Kapitán) má plnú kontrolu nad tým, kto sa môže pripojiť.",
    },
    {
      icon: UserPlus,
      title: "Pozývacie kódy",
      description: "Jednoduché zdieľanie pomocou unikátnych kódov, ktoré si vygenerujete.",
    },
    {
      icon: Lock,
      title: "Súkromie",
      description: "Možnosť nastaviť skupinu ako súkromnú alebo verejnú podľa vašich potrieb.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold border border-primary/20">
            01
          </span>
          Súkromné skupiny
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {groupFeatures.map((feature, index) => (
            <IceGlassCard key={index} className="p-6 border-white/5 hover:border-primary/20 transition-all duration-300 group">
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-primary group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </IceGlassCard>
          ))}
        </div>
      </section>

      <IceGlassCard className="p-6 border-primary/20 bg-primary/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 animate-pulse">
            <Users className="w-8 h-8" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Pripravený začať?</h3>
            <p className="text-white/70 mb-0">
              Prejdite do sekcie <strong>Skupiny</strong> v hlavnom menu a vytvorte svoju prvú ligu ešte dnes.
            </p>
          </div>
        </div>
      </IceGlassCard>
    </div>
  );
};
