'use client';

import { ShieldCheck, UserCheck, Zap } from 'lucide-react';

const VALUES = [
  {
    icon: UserCheck,
    title: "Approche 100% Personnalisée",
    desc: "Pas de programme robot. Chaque corps est unique, chaque séance est adaptée à VOTRE forme du jour.",
    color: "text-training"
  },
  {
    icon: ShieldCheck,
    title: "Double Expertise Certifiée",
    desc: "Coach sportive diplômée ET praticienne massages. Je comprends la mécanique du corps et sa récupération.",
    color: "text-slate-900"
  },
  {
    icon: Zap,
    title: "Résultats Visibles & Durables",
    desc: "On ne cherche pas la performance éphémère, mais la santé sur le long terme. Un corps fort, un esprit apaisé.",
    color: "text-care"
  }
];

export function ValuesSection() {
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {VALUES.map((val, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 group">
              <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-300 shadow-sm ${val.color}`}>
                <val.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">{val.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
