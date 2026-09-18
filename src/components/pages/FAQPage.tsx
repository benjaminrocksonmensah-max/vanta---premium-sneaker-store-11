import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do VANTA sneakers fit in comparison to other performance or luxury brands?',
      a: 'All VANTA silhouettes are crafted upon bespoke European aluminum lasts and fit true to size according to standard US/EU sizing scales. If you have a wider instep or prefer extra toe box clearance for running, we recommend taking a half-size up. You may also consult our interactive Size Conversion chart on any product page.'
    },
    {
      q: 'What is the Cryptographic NFC Authenticity tag embedded in the sneaker?',
      a: 'Each authentic VANTA sneaker embeds an encrypted, tamper-evident NTAG213 microchip inside the tongue badge. Tapping any modern iPhone or Android smartphone reveals the cryptographic serial certificate, exact workshop allocation timestamp, and activates your complimentary 2-year structural warranty.'
    },
    {
      q: 'Which countries do you ship to, and what are the delivery timeframes?',
      a: 'We ship worldwide via DHL Express Priority and FedEx International Air. Express shipping is complimentary on all orders exceeding GH₵ 200. Shipments to the US, UK, EU, and West Africa (Ghana/Nigeria) arrive in 3-5 business days. Remote territories arrive in 5-7 business days.'
    },
    {
      q: 'What is your return and vault exchange policy?',
      a: 'We offer a 30-day vault return policy from the date of confirmed delivery. Footwear must remain unworn with original serial tags and acrylic casing intact. Returns for store credit or exchange are 100% complimentary.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and localized Mobile Money (MTN MoMo and Telecel Cash in West Africa) via 256-bit encrypted gateways.'
    },
    {
      q: 'How should I clean and maintain the Tuscan calfskin and ballistic mesh?',
      a: 'Wipe down lightly with a soft microfiber cloth dampened with lukewarm water. For tumbled calfskin areas, apply a pea-sized amount of neutral organic leather balm every 3-6 months to preserve suppleness. Never wash in laundry machines or expose to direct radiator heat.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          KNOWLEDGE VAULT & POLICIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Everything you need to know about sizing, international dispatch, and vault authentication.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-[#111114] border border-zinc-850 rounded-2xl overflow-hidden transition-colors hover:border-zinc-750"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-850/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
