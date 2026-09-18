import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "The Vanta Runner X1 completely rewired my perception of luxury performance footwear. It has the cushioning of a record-breaking race shoe with the understated brutalism of high fashion.",
      author: "Kwame Asare",
      role: "Architect & Sneaker Collector",
      city: "Accra / London",
      sneaker: "Vanta Runner X1",
      rating: 5
    },
    {
      id: 2,
      quote: "I've collected over 200 pairs from Tokyo to Paris. The calfskin leather on the Street Pro puts standard tier luxury houses to shame. The comfort straight out of the box is unmatched.",
      author: "Mateo Silva",
      role: "Creative Director",
      city: "Milan",
      sneaker: "Vanta Street Pro",
      rating: 5
    },
    {
      id: 3,
      quote: "The limited Eclipse Drop was delivered in under 48 hours to my doorstep. The embedded cryptographic NFC chip and titanium hardware are genuine works of art.",
      author: "Samantha Vance",
      role: "Industrial Designer",
      city: "New York",
      sneaker: "Vanta Eclipse [Drop 04]",
      rating: 5
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-zinc-850">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-2">
          COLLECTOR VOICES
        </span>
        <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
          Trusted by Discerning Creators
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Real feedback from verified collectors across 34 countries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Collector
                </span>
              </div>

              <Quote className="w-6 h-6 text-zinc-600 mb-3 opacity-50" />

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{t.author}</h4>
                <p className="text-[11px] text-zinc-500">{t.role} • {t.city}</p>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/40 px-2 py-1 rounded">
                {t.sneaker}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
